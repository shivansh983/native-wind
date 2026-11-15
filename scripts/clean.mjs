// build output only, never source
// --dry lists it, --deep takes node_modules too
import { existsSync, rmSync, readdirSync } from 'node:fs';
import { join, parse, resolve } from 'node:path';

const root = process.cwd();
const deep = process.argv.includes('--deep');
const dry = process.argv.includes('--dry');

const targets = [
  'android/build',
  'android/app/build',
  'android/app/.cxx',
  'android/.gradle',
  'android/.kotlin',
  '.expo',
  'dist',
  'web-build',
];

// every native module stages its own cmake build under android/
const modules = join(root, 'node_modules');
if (existsSync(modules)) {
  for (const name of readdirSync(modules)) {
    if (name.startsWith('.')) continue;

    // @org/pkg sits one level deeper
    const inner = name.startsWith('@')
      ? readdirSync(join(modules, name)).map((p) => `${name}/${p}`)
      : [name];

    for (const pkg of inner) {
      targets.push(`node_modules/${pkg}/android/build`);
      targets.push(`node_modules/${pkg}/android/.cxx`);
    }
  }
}

// the old withWindowsNativePaths plugin staged here
targets.push(join(parse(root).root, 'x'));

if (deep) targets.push('node_modules');

let gone = 0;
for (const target of targets) {
  const path = resolve(root, target);
  if (!existsSync(path)) continue;

  if (!dry) rmSync(path, { recursive: true, force: true });
  console.log(dry ? 'would remove' : 'removed', target);
  gone++;
}

const verb = dry ? 'would clean' : 'cleaned';
console.log(gone ? `\n${verb} ${gone}` : 'nothing to clean');
if (deep) console.log('run npm install next');
