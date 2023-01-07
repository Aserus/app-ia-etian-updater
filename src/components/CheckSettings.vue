<template lang="pug">
div
  q-item
    q-item-section(side )
      q-icon(v-if="isConfigured" name='check' color="green")
      q-icon(v-else name='close' color="red")
    q-item-section Оборудование
    q-item-section(v-if="isConfigured" side) Настроено
    //q-item-section(v-if="isConfigured" side) Настроено и подключено

  q-item(v-if="!isConfigured")
    q-item-section
      q-btn(color="warning" icon="settings" to="/equipment/settings") Настроить

</template>

<script>
import {
  defineComponent,
  onMounted,
  ref,
  computed,
} from 'vue';

export default defineComponent({
  setup() {
    const equipments = ref();

    const fetchSettings = async () => {
      // const { FlashApi } = window;
      console.log('settings API', window.settingsApi);
      console.log('flash API', window.flashApi);
      // console.log('window flash', window.FlashApi.test());

      setTimeout(() => console.log('settings api', window.settingsApi), 2000);

      const settings = await window.settingsApi.loadSettings();

      if (!settings.equipments) settings.equipments = {};
      equipments.value = settings.equipments;
    };

    const isConfigured = computed(() => {
      if (!equipments.value) return false;
      if (!equipments.value.teacher) return false;
      if (!equipments.value.teacher.camera) return false;
      if (!equipments.value.teacher.speaker) return false;
      if (!equipments.value.teacher.microphone) return false;

      if (!equipments.value.student) return false;
      if (!equipments.value.student.camera) return false;
      if (!equipments.value.student.speaker) return false;
      if (!equipments.value.student.microphone) return false;
      return true;
    });

    onMounted(() => {
      fetchSettings();
    });

    return {
      isConfigured,
      equipments,
    };
  },
});
</script>
