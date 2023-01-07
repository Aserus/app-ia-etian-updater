<template lang="pug">
q-card.q-mb-md
  q-card-section
    .text-h6 {{item.chapter.title}}
    .text-subtitle2(v-if="item.callsign")
      i Псевдоним: {{item.callsign}}
  q-separator
  q-card-section
    div(v-html="content")

    div(v-if="fileList")
      quiz-task-file-item(v-for="file in fileList" :key="file.id" :file="file" :task="item" )
    //pre {{fileList}}

</template>

<script>
import {
  defineComponent,
  onMounted,
  ref,
} from 'vue';
// import { api } from 'boot/axios'
import { loadArchiveTask } from 'src/helpers/archive';
import QuizTaskFileItem from 'src/components/QuizTaskFileItem.vue';

export default defineComponent({
  components: {
    QuizTaskFileItem,
  },
  props: {
    item: Object,
  },
  setup(props) {
    const content = ref(null);
    const fileList = ref([]);

    const fetchContent = async () => {
      const data = await loadArchiveTask(props.item.id);
      content.value = data.content;

      fileList.value = data.fileList;

      console.log(data);
    };

    onMounted(() => {
      fetchContent();
    });
    return {
      content,
      fileList,
    };
  },

});
</script>
