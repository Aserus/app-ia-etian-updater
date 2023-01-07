import path from 'path';

import { exec } from 'child_process';
import { ipcMain } from 'electron';

const execAsync = (command) => new Promise((resolve, reject) => {
  exec(command, (err, stdout) => (err ? reject(err) : resolve(stdout)));
});

const testPath = path.resolve(__dirname, 'utils/rtadmin.exe');
console.log(testPath);

const RTADMIN = path.join(process.cwd(), 'utils', 'rtadmin.exe');

export async function runClear() {
  const command = `${RTADMIN} -q -f`;
  const stdout = await execAsync(command);
  return stdout;
}

ipcMain.handle('token-clear', () => runClear());
