#!/usr/bin/env node
// Automatic hook installation — runs on `npm install`
// Zero dependencies. Equivalent to husky.

import { execSync } from 'child_process';
import { existsSync, copyFileSync, chmodSync, mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Only install if we're in a git repo
const gitDir = join(root, '.git');
if (!existsSync(gitDir)) {
  try {
    const parentRoot = execSync('git rev-parse --show-toplevel', { encoding: 'utf-8', cwd: root }).trim();
    installHooks(parentRoot);
  } catch {
    console.log('  Not a git repository — skipping hook installation');
  }
  process.exit(0);
}

installHooks(root);

function installHooks(targetRoot) {
  const hooksDir = join(targetRoot, '.git', 'hooks');
  const sourceHooks = join(root, 'hooks');

  console.log('');
  console.log('  ┌─ CTP/IP Guardian Gates ─────────────────────┐');

  for (const hook of ['pre-commit', 'commit-msg', 'pre-push', 'pre-merge-commit']) {
    const src = join(sourceHooks, hook);
    const dest = join(hooksDir, hook);
    if (existsSync(src)) {
      copyFileSync(src, dest);
      chmodSync(dest, 0o755);
      console.log(`  │  ✓ ${hook.padEnd(20)}                       │`);
    }
  }

  // Ensure bin is accessible
  const binSrc = join(root, 'bin', 'gamma-check.mjs');
  const binDest = join(targetRoot, 'bin', 'gamma-check.mjs');
  if (existsSync(binSrc) && targetRoot !== root) {
    mkdirSync(join(targetRoot, 'bin'), { recursive: true });
    copyFileSync(binSrc, binDest);
    console.log('  │  ✓ gamma-check.mjs copied                   │');
  }

  // Create operator registry
  const sonDir = join(targetRoot, '.son');
  mkdirSync(sonDir, { recursive: true });
  const opsFile = join(sonDir, 'operators');
  if (!existsSync(opsFile)) {
    try {
      const email = execSync('git config --get user.email', { encoding: 'utf-8' }).trim();
      writeFileSync(opsFile, email + '\n');
      console.log('  │  ✓ .son/operators created                    │');
    } catch { }
  }

  console.log('  └─────────────────────────────────────────────┘');
  console.log('');
  console.log('  CC BY-NC 4.0 — Non-commercial use with attribution.');
  console.log('  Commercial deployment: license LUX at designledger.co');
  console.log('');
  console.log('  This protocol must not be used for surveillance,');
  console.log('  coercion, social credit, weapons, or extraction.');
  console.log('  See LICENSE for full terms.');
  console.log('');
}
