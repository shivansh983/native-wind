// clean, regenerate android, build the release apk
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const win = process.platform === 'win32';

const run = (label, cmd, args, cwd) => {
  console.log(`\n== ${label}`);

  const { status, error } = spawnSync(cmd, args, {
    cwd,
    stdio: 'inherit',
    shell: win,
  });

  if (error) throw error;
  if (status !== 0) {
    console.error(`\n${label} failed`);
    process.exit(status ?? 1);
  }
};

run('1. clean', process.execPath, ['./scripts/clean.mjs']);
run('2. prebuild', win ? 'npx.cmd' : 'npx', [
  'expo',
  'prebuild',
  '--platform',
  'android',
  '--clean',
]);
// absolute path, cmd does not check cwd
const android = join(process.cwd(), 'android');
run('3. build', join(android, win ? 'gradlew.bat' : 'gradlew'), [
  'assembleRelease',
], android);

console.log('\napk: android/app/build/outputs/apk/release/app-release.apk');
