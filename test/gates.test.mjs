// The Git adapter end to end, in throwaway repositories: the gate mode is
// explicit, ENFORCE blocks, ADVISORY reports, an unsigned identity is not an
// anchor, and in ENFORCE mode a kernel that cannot run blocks the commit.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync, execSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, copyFileSync, writeFileSync, rmSync, chmodSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
// The machine's own git configuration never reaches these repositories.
const ENV = { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_NOSYSTEM: '1' };

function repo() {
  const dir = mkdtempSync(join(tmpdir(), 'son-gates-'));
  const git = (args) => execSync(`git ${args}`, { cwd: dir, stdio: 'pipe', env: ENV });
  git('init -q');
  git('config user.email agency@example.org');
  git('config user.name Agency');
  git('config commit.gpgsign false');
  mkdirSync(join(dir, 'bin'));
  copyFileSync(join(ROOT, 'bin', 'gamma-check.mjs'), join(dir, 'bin', 'gamma-check.mjs'));
  copyFileSync(join(ROOT, 'engine.mjs'), join(dir, 'bin', 'engine.mjs'));
  writeFileSync(join(dir, 'work.txt'), 'a line of work\n');
  git('add work.txt');
  return { dir, git };
}

function gate(dir, mode, env = {}) {
  return spawnSync(process.execPath, [join(dir, 'bin', 'gamma-check.mjs'), 'pre-commit'], {
    cwd: dir, encoding: 'utf8', env: { ...ENV, CTPIP_GATES: mode, ...env },
  });
}

test('ENFORCE blocks a failing pre-commit; ADVISORY reports it and says so', () => {
  const { dir } = repo();
  try {
    const enforced = gate(dir, 'enforce');
    assert.equal(enforced.status, 1, enforced.stdout);
    assert.match(enforced.stdout, /mode: ENFORCE/);
    const advisory = gate(dir, 'advisory');
    assert.equal(advisory.status, 0, advisory.stdout);
    assert.match(advisory.stdout, /mode: ADVISORY/);
    assert.match(advisory.stdout, /ADVISORY MODE: reported, not enforced/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('the mode can be set per repository, and an unknown mode is refused', () => {
  const { dir, git } = repo();
  try {
    git('config ctpip.gates enforce');
    const r = spawnSync(process.execPath, [join(dir, 'bin', 'gamma-check.mjs'), 'pre-commit'], {
      cwd: dir, encoding: 'utf8', env: { ...ENV, CTPIP_GATES: '' },
    });
    assert.match(r.stdout, /mode: ENFORCE/);
    assert.equal(gate(dir, 'sometimes').status, 2);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('an unsigned git identity is not an anchor; signing or registration is', () => {
  const { dir, git } = repo();
  try {
    assert.match(gate(dir, 'advisory').stdout, /UNSIGNED IDENTITY/);
    mkdirSync(join(dir, '.son'));
    writeFileSync(join(dir, '.son', 'operators'), '# One email per line.\nagency@example.org\n');
    assert.match(gate(dir, 'advisory').stdout, /registered: agency@example.org/);
    rmSync(join(dir, '.son'), { recursive: true });
    git('config user.signingkey ABCDEF0123456789');
    assert.match(gate(dir, 'advisory').stdout, /UNSIGNED IDENTITY/, 'a key that never signs proves nothing');
    git('config commit.gpgsign true');
    assert.match(gate(dir, 'advisory').stdout, /GPG: ABCDEF01/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('ENFORCE: a hook whose kernel is missing blocks the commit; ADVISORY steps aside', () => {
  const { dir, git } = repo();
  try {
    const hook = join(dir, '.git', 'hooks', 'pre-commit');
    copyFileSync(join(ROOT, 'hooks', 'pre-commit'), hook);
    chmodSync(hook, 0o755);
    rmSync(join(dir, 'bin'), { recursive: true });
    const commit = (mode) => spawnSync('git', ['commit', '-q', '-m', 'work'], {
      cwd: dir, encoding: 'utf8', env: { ...ENV, CTPIP_GATES: mode },
    });
    const blocked = commit('enforce');
    assert.notEqual(blocked.status, 0);
    assert.match(blocked.stdout + blocked.stderr, /ENFORCE mode: blocked/);
    const passed = commit('advisory');
    assert.equal(passed.status, 0, passed.stdout + passed.stderr);
    assert.match(passed.stdout + passed.stderr, /ADVISORY mode: stepping aside/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('the EVA bridge refuses an input outside its domain', () => {
  const run = (...a) => spawnSync(process.execPath, [join(ROOT, 'bin', 'eva.mjs'), ...a], { encoding: 'utf8' });
  const ok = run('0.85', '0.85', '0.97');
  assert.equal(ok.status, 0);
  assert.equal(JSON.parse(ok.stdout).verdict, 'VALID');
  for (const args of [['1.2', '1', '1'], ['0.5', 'x', '0.5'], ['0.5', '0.5', '0.5', '-1']]) {
    const r = run(...args);
    assert.equal(r.status, 2, args.join(' '));
  }
});
