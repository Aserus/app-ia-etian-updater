<template lang="pug">
q-layout(view='hHh lpR fFf')
  q-page-container.page-container
    router-view

</template>

<script>
import NavigationMenu from 'components/NavigationMenu.vue';

import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'MainLayout',

  components: {
    NavigationMenu,
  },

  setup() {
    const leftDrawerOpen = ref(true);

    return {
      appVersion: process.env.APP_VERSION,

      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      logout() {

      },
    };
  },
});
</script>

<style>
.page-container{
  background: url('assets/background.svg') 50% 50% no-repeat;
  background-size: cover;
  background-attachment: fixed;
}

</style>
