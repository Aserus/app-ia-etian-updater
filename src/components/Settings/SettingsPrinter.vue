<template lang="pug">
q-card(square)
  q-card-section.bg-primary.text-white.q-py-sm
    .text-h6 Принтер
  q-card-section
    p Способ печати
    div
      q-radio(v-model="printVariant" label="Системный" :val="null" dense)
    div
      q-radio(v-model="printVariant" label="Драйвер" val="drive" dense)

</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({

  components: {

  },
  setup() {
    const printVariant = ref(null);
    return {
      printVariant,

    };
  },
});
</script>
