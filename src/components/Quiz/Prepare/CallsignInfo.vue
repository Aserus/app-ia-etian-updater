<template lang="pug">
.flex
  .text-h6 Псевдонимы
  q-space

q-list(bordered separator).q-mt-md
  q-item(v-for="(item,i) in list" dense)
    q-item-section(avatar) {{i+1}}.
    q-item-section {{item.callsign || '---'}}

QuizBottomActions(
  :no-next="!isPrinted"
  @cancel="onCancel()"
  @success="onSuccess()" )
  template(#middle)
    q-btn(icon="print" color="info" @click="printList()") Печать
</template>

<script>
import {
  defineComponent,
  ref,
} from 'vue';
// import PDFDocument from 'pdfkit';
// import blobStream from 'blob-stream';

import QuizBottomActions from './BottomActions.vue';

export default defineComponent({
  components: { QuizBottomActions },
  props: {
    list: Array,
  },
  emits: ['success', 'cancel'],
  setup(props, { emit }) {
    const isPrinted = ref(false);
    return {
      isPrinted,
      onCancel: () => emit('cancel'),
      onSuccess: () => emit('success'),
      async printList() {
        // hello
        const nameTxt = props.list.map((item, i) => {
          const numb = i + 1;
          const name = item.callsign || '---';
          return `${numb}. ${name}`;
        }).join('\n');

        const prtHtml = `<pre>Псевдонимы:\n_____________</pre>
          <pre>${nameTxt}</pre>`;

        await window.printApi.printHtml(prtHtml);
        isPrinted.value = true;
      },
    };
  },
});
</script>
