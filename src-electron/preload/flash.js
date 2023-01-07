import os from 'os';
import axios from 'axios';
import { ipcRenderer } from 'electron';
// import pkcs11js from 'pkcs11js';
// import path from 'path';
// import fs from 'fs/promises';
// import { v4 as uuidv4 } from 'uuid';

export async function getCompInfo() {
  const osInfo = {
    // machine: os.machine(),
    hostname: os.hostname(),
    platform: os.platform(),
    release: os.release(),
    version: os.version(),
    homedir: os.homedir(),
    userInfo: os.userInfo(),
    networkInterfaces: os.networkInterfaces(),
  };

  const { data } = await axios.get('http://ifconfig.me');

  return {
    osInfo,
    ifconfig: data,
  };
}

export async function tokenInit() {
  return ipcRenderer.invoke('token-init');
}

export async function tokenRead() {
  return ipcRenderer.invoke('token-read');
}
export async function tokenFinalize() {
  return ipcRenderer.invoke('token-finalize');
}
