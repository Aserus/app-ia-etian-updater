import { contextBridge } from 'electron';

import * as flashApi from './preload/flash';

console.log('flashApi', flashApi);
contextBridge.exposeInMainWorld('flashApi', flashApi);
