<template lang="pug">
div
  q-item(  )
    q-item-section(side )
      q-icon(name='check' color="green")
    q-item-section Версия программы
    q-item-section(side) {{appVersion}}

</template>

<script>
import { defineComponent } from 'vue';
// import { api } from 'boot/axios';
// import dayjs from 'dayjs';

export default defineComponent({
  setup() {
    const appVersion = process.env.APP_VERSION;

    // onMounted(() => {

    // });

    return {
      appVersion,
    };
  },
});
</script>
