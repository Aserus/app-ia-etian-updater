import { boot } from 'quasar/wrappers';
import { Notify } from 'quasar';

const notify = {};

notify.success = (message) => Notify.create({
  color: 'green-4',
  textColor: 'white',
  icon: 'cloud_done',
  message,
});
notify.error = async (message) => Notify.create({
  color: 'red-5',
  textColor: 'white',
  icon: 'warning',
  message,
});

export default boot(({ app }) => {
  app.config.globalProperties.$notify = notify;
});

export { notify };
