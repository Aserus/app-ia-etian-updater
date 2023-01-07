import { boot } from 'quasar/wrappers';
import { useAuthStore } from 'src/stores/auth';
import { api } from 'boot/axios';

export default boot(async ({ router, urlPath, redirect }) => {
  const authStore = useAuthStore();

  api.interceptors.request.use((config) => {
    if (authStore.hasToken) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  });

  router.beforeEach((to) => {
    // console.log('urlPath', urlPath);
    // console.log('to', to);
    // console.log('to m', to.matched);
    // to.matched.some((route) => {
    if (!authStore.hasToken && to.meta.requiresAuth && !urlPath.startsWith('/login')) {
      authStore.setReturnUrl(urlPath);
      // console.log('redirect', authStore.returnUrl, urlPath);
      redirect('/login');
    }
    // });
  });

  authStore.afterLoginCallback.push(() => redirect(authStore.returnUrl || '/'));
  authStore.afterLogoutCallback.push(() => redirect('/login'));
});
