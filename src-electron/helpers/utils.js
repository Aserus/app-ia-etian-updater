import path from 'path';

import { execFile } from 'child_process';
import { app, ipcMain } from 'electron';
import fs, { promises as fsAsync } from 'fs';

const execAsync = (command, args) => new Promise((resolve, reject) => {
  execFile(command, args, (err, stdout) => (err ? reject(err) : resolve(stdout)));
});

// const testPath = path.resolve(__dirname, 'utils/rtadmin.exe');
// console.log(testPath);

// const RTADMIN = path.join(process.cwd(), 'utils', 'rtadmin.exe');

export async function runClear() {
  const libUserData = path.join(app.getPath('userData'), 'rtadmin.exe');
  console.log(libUserData);
  if (!fs.existsSync(libUserData)) {
    // await fsAsync.copyFile(path.join(__dirname, '/assets/utils/rtadmin.exe'), libUserData);
    console.log(!fsAsync);
  }
  const stdout = await execAsync(libUserData, ['-q', '-f']);
  return stdout;
}

ipcMain.handle('token-restart', () => runClear());
