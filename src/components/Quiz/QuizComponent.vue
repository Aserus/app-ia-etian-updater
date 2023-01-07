<template lang="pug">
div.quiz-block.q-pa-md
  //- .text-h3 Тестирование
  .text-h4.q-mb-md Раздел: {{section.title}}

  template(v-if="!isEnded")
    quiz-task-item(v-for="item in quizList" :key="item.id" :item="item")
    .text-right
      q-btn(@click="stopStart()" color="primary") Завершить тестирование
  template(v-else) тестирование завершено

</template>

<script>
import {
  defineComponent,
  ref,
  onMounted,
} from 'vue';

import QuizTaskItem from 'src/components/QuizTaskItem.vue';
import { CaptureQuiz } from 'src/helpers/quiz-record';
import { cloneObj } from 'src/helpers';
import { loadArchiveTask } from 'src/helpers/archive';
import { onBeforeRouteLeave } from 'vue-router';

async function loadArchiveData(item) {
  const data = await loadArchiveTask(item.id);
  const { content } = data;
  const { fileList } = data;

  return {
    ...item,
    content,
    fileList,
  };
}

export default defineComponent({
  components: {
    QuizTaskItem,
  },
  props: {
    section: Object,
    quizList: Array,
  },
  setup(props) {
    const quizCapture = ref(null);
    const isEnded = ref(false);

    const timer = null;

    const stopStart = async () => {
      console.log(quizCapture.value);
      const capture = quizCapture.value;
      await capture.stop();
      clearInterval(timer);
      isEnded.value = true;

      setTimeout(() => capture.clear(), 1000);
    };

    onBeforeRouteLeave(async () => {
      if (isEnded.value) return true;
      const answer = window.confirm('Вы хотите закончить тестирование!');

      if (answer) {
        await stopStart();
      }

      return answer;
    });

    const fetchContents = async () => {
      const list = await Promise.all(props.quizList.map(loadArchiveData));
      return list;
    };

    const startTest = async () => {
      const data = await window.settingsApi.loadSettings();
      const { equipments } = data;

      const teacher = {
        camera: equipments.teacher.camera,
        microphone: equipments.teacher.microphone,
      };
      const student = {
        camera: equipments.student.camera,
        microphone: equipments.student.microphone,
      };
      const capture = new CaptureQuiz(teacher, student);

      const quizList = await fetchContents();

      capture.setInfo(cloneObj({
        section: props.section,
        quizList,
      }));
      await capture.start();
      quizCapture.value = capture;
    };

    onMounted(() => startTest());

    return {
      quizCapture,
      stopStart,
      isEnded,
    };
  },

  onBeforeRouteLeave() {
    console.log('hello');
  },

});
</script>

<style scoped>
.quiz-block{
  font-size:16px;
}
</style>
