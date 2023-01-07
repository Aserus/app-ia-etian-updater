<template lang="pug">
q-page.flex.flex-center
  q-card

    q-card-section(v-if="loading")
      .text-h6 Идет процесс обновления
      .text-center
        q-spinner(
          color="primary"
          size="5em"
          :thickness="10")

    q-card-section(v-else-if="errorMessage")
      .text-h6 Произошла ошибка
      pre {{errorMessage}}
</template>

<script>
import {
  defineComponent, ref, onMounted, onUnmounted,
} from 'vue';
import { api } from 'boot/axios';

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const loading = ref(true);
    const errorMessage = ref();

    const checkSrvCanUpdate = async (data) => {
      // Получаем данные о компе
      const info = await api.post('/dflash-update/', data);
      return info;
    };

    // Получаем данные флешки
    // const getFlashInfo = async () => null;

    const checkFlash = async () => {
      try {
        const compInfo = await window.flashApi.getCompInfo();
        console.log(compInfo);
        await window.flashApi.tokenInit();
        const flashInfo = await window.flashApi.tokenRead();
        if (!flashInfo) {
          throw new Error('Флешка не найден. Пожалуйста подключит флешку и запустите приложение заново');
        }
        console.log('flashInfo', flashInfo);

        const result = await checkSrvCanUpdate({ flashInfo, compInfo });
        console.log(result);
        // Проверяем всставлена ли флешка
        // Если Да
        // Получаем данные флешки
        // Получаем данные о компе
        // Отправляем на сервак
      } catch (err) {
        console.log(err.message);
        errorMessage.value = err.message;
        loading.value = false;
      }
    };

    onMounted(() => checkFlash());
    onUnmounted(() => window.flashApi.tokenFinalize());

    return {
      loading,
      errorMessage,
    };
  },
});
</script>
