import path from 'path';
import fs from 'fs/promises';
import { ipcRenderer } from 'electron';

const configFolder = 'aquest-storage';

export async function getStoragePath(autoMkdir) {
  const userDataPath = await ipcRenderer.invoke('get-path-user-data');
  const dir = path.join(userDataPath, configFolder);
  if (autoMkdir) {
    await fs.mkdir(dir, { recursive: true });
  }
  return dir;
}
