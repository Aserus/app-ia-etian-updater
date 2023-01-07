<template lang="pug">
.text-h6 Выберите раздел для тестирования
q-list(bordered separator).bg-white.q-mt-md
  q-item(v-for="item in list" v-ripple tag="label")
    q-item-section(avatar)
      q-radio(v-model="selectItem" :val="item")
    q-item-section
      q-item-label {{item.title}}
QuizBottomActions(
  :disabled-success="!selectItem"
  no-back
  @success="onSuccess()")
</template>

<script>
import {
  defineComponent,
  ref,
} from 'vue';
import QuizBottomActions from './BottomActions.vue';

export default defineComponent({
  components: { QuizBottomActions },
  props: {
    list: Array,
  },
  emits: ['success'],
  setup(_, { emit }) {
    const selectItem = ref(null);

    return {
      selectItem,
      onSuccess() {
        emit('success', selectItem.value);
      },
    };
  },
});
</script>
