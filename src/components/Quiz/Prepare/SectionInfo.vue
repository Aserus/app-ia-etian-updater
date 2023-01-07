<template lang="pug">
.text-h6
  | Выбран раздел:
  b.q-pl-md {{section.title}}

p В этом разделе содержится:
q-list(v-if="section" bordered separator).bg-white.q-mt-md
  q-item(v-for="item in list" :key="item.id")
    q-item-section {{item.title}}
    q-item-section(side) Заданий: {{item.countTask}}
QuizBottomActions(@cancel="onCancel()" @success="onSuccess()")
</template>

<script>
import {
  defineComponent,
  // ref,
} from 'vue';
import QuizBottomActions from './BottomActions.vue';

export default defineComponent({
  components: { QuizBottomActions },
  props: {
    section: Object,
    list: Array,
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
