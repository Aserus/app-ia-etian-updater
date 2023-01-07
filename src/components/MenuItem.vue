<template lang="pug">
q-item(clickable  :to="to" :disable="disable")
  q-item-section(v-if='icon' avatar)
    q-icon(:name='icon')
  q-item-section
    q-item-label {{ title }}
    q-item-label(caption) {{ caption }}

</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      default: '',
    },

    to: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    disable: {
      type: Boolean,
      default: null,
    },
  },
});
</script>
