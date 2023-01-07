// import { contextBridge } from 'electron'
import { api } from 'boot/axios';
import { LocalStorage } from 'quasar';

const { flashApi } = window;

// const ipcRenderer  = window.ipcRenderer;
// console.log('ipcRenderer',contextBridge)

// const flashPath = null;// ipcRenderer.sendSync('flash-path', 'ping')

export async function loadArchive() {
  const projectName = LocalStorage.getItem('last_project');
  if (!projectName) return null;

  const info = await flashApi.readArchive(projectName);
  if (!info) return null;
  return info;
}

export async function loadArchiveTask(taskId) {
  const projectName = LocalStorage.getItem('last_project');
  if (!projectName) return null;

  const info = await flashApi.readArchiveTask(projectName, taskId);
  if (!info) return null;
  return info;
}

export async function loadArchiveTaskFile(filename) {
  const projectName = LocalStorage.getItem('last_project');
  if (!projectName) return null;

  const info = await flashApi.readArchiveTaskFile(projectName, filename);
  if (!info) return null;
  return info;
}

export async function upgradeArchive(params = {}) {
  const response = await api.get('/archives/last');
  const { contentUrl } = response.data;
  // console.log(contentUrl, params);
  const { data } = await api.get(contentUrl, {
    responseType: 'blob',
    timeout: 0,
    ...params,
  });
  // const projectName = await flashApi.saveArchive('hello');
  const projectName = await flashApi.saveArchive(data);
  // const info = await flashApi.readArchive(projectName);
  await flashApi.readArchive(projectName);

  LocalStorage.set('last_project', projectName);

  return null;
}
