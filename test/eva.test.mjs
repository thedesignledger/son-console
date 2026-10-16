// The EVA bridge: E, V and A in, the engine's verdict out, and an input outside its domain refused.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

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
