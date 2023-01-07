import { defineStore } from 'pinia';
import { LocalStorage } from 'quasar';
import { api } from 'boot/axios';

const STORAGE_KEY_TOKEN = 'token';
const STORAGE_KEY_RETURN_URL = 'returnUrl';

function shortedName(name) {
  if (!name) return null;
  if (name.indexOf(' ') === -1) return name;
  const arr = name.split(' ');
  return `${arr[0]} ${arr.slice(1).map((str) => `${str.charAt(0)}.`).join('')}`;
}

export const useAuthStore = defineStore('auth', {

  state: () => ({
    token: LocalStorage.getItem(STORAGE_KEY_TOKEN) || null,
    user: null,
    returnUrl: LocalStorage.getItem(STORAGE_KEY_RETURN_URL) || null,
    afterLoginCallback: [],
    afterLogoutCallback: [],
  }),
  getters: {
    shortName: (state) => (state.user ? shortedName(state.user.name) : null),
    // isAuth: (state) => !!state.user,
    hasToken: (state) => !!state.token,
    isLoggedIn: (state) => !!state.user,
    isLogginIn: (state) => !!state.token && !state.user,
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    setReturnUrl(value) {
      this.returnUrl = value;
      LocalStorage.set(STORAGE_KEY_RETURN_URL, value);
    },
    setToken(token) {
      this.token = token;
      LocalStorage.set(STORAGE_KEY_TOKEN, token);
    },
    async login(username, password) {
      const { data } = await api.post('/auth', { username, password });
      this.setToken(data.token);
      await this.request();
      this.afterLoginCallback.forEach((cb) => cb());
    },
    async request() {
      const { data } = await api.get('/auth/current');
      this.user = data.user;
    },
    logout() {
      this.user = null;
      this.token = null;
      LocalStorage.remove(STORAGE_KEY_TOKEN);
      LocalStorage.remove(STORAGE_KEY_RETURN_URL);
      this.afterLogoutCallback.forEach((cb) => cb());
    },
  },
});
