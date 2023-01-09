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
    q-card-section(v-else)
      .text-h6 Готово

    q-card-actions
      q-btn(@click="clearFlash" color="primary") Test del
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

    const checkSrvCanUpdate = async (params) => {
      // Получаем данные о компе
      const { data } = await api.post('/dflash-update', params);
      return data;
    };

    const clearFlash = async () => {
      console.log('start clear');
      await window.flashApi.tokenClear();
      console.log('cleared');
    };

    // Получаем данные флешки
    // const getFlashInfo = async () => null;

    const checkFlash = async () => {
      try {
        console.log('test-cwd', await window.flashApi.testCwd());
        const compInfo = await window.flashApi.getCompInfo();
        console.log(compInfo);
        await window.flashApi.tokenInit();
        const flashInfo = await window.flashApi.tokenRead();
        if (!flashInfo) {
          throw new Error('Флешка не найден. Пожалуйста подключит флешку и запустите приложение заново');
        }
        console.log(flashInfo);
        if (flashInfo.version === '0.2') { throw new Error('Обновление уже выполнено'); }

        console.log('flashInfo', flashInfo.version);

        const result = await checkSrvCanUpdate({ flashInfo, compInfo });
        console.log(result.clear);

        if (result.success && result.update) {
          console.log('success', result);
          try {
            await window.flashApi.tokenWrite(result.update);
            loading.value = false;
          } catch (err) {
            throw new Error('Код ошибки 11. Что то пошло не так - обратитесь по адресу it@aeronav.aero');
          }
        } else if (result.clear) {
          try {
            await clearFlash();
          } catch (err) {
            throw new Error('Код ошибки 34. Что то пошло не так - обратитесь по адресу it@aeronav.aero');
          }
        } else {
          throw new Error('Код ошибки 12. Что то пошло не так - обратитесь по адресу it@aeronav.aero');
        }
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
      clearFlash,
    };
  },
});
</script>
