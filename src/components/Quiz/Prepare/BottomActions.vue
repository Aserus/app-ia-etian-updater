<template lang="pug">
.flex.justify-end.q-gutter-md.q-mt-md
  q-btn(v-if="!noBack" color="primary" flat  @click="onCancel()") Назад
  slot(name="middle")
  slot(v-if="!noNext")
    q-btn(color="primary" @click="onSuccess()" :disabled="disabledSuccess") Далее

</template>

<script>
import {
  defineComponent,
  // ref,
} from 'vue';

export default defineComponent({
  props: {
    noBack: Boolean,
    noNext: Boolean,
    disabledSuccess: Boolean,
  },
  emits: ['success', 'cancel'],
  setup(_, { emit }) {
    return {
      onCancel() {
        emit('cancel');
      },
      onSuccess() {
        emit('success');
      },
    };
  },
});
</script>
