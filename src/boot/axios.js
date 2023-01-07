import { boot } from 'quasar/wrappers';
import axios from 'axios';

const baseURL = process.env.VUE_APP_API_URL || `${window.location.protocol}//${window.location.host}/api`;
const baseMediaUrl = process.env.VUE_APP_MEDIA_URL || '';

const api = axios.create({ baseURL });

const apiUrl = (url) => baseURL + url;
const mediaLink = (src) => baseMediaUrl + src;

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
  app.config.globalProperties.$apiUrl = apiUrl;
  app.config.globalProperties.$mediaLink = mediaLink;
});

export {
  api,
  apiUrl,
  mediaLink,
};
