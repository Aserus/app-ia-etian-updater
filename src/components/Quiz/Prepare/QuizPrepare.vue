<template lang="pug">
q-tab-panels(v-model="tab")

  q-tab-panel(name="start")
    quiz-select-section(:list="sectionList" @success="onSectionSelect")

  q-tab-panel(name="sectionInfo")
    QuizSectionInfo(
      :section="selectSection"
      :list="chapterListBySection"
      @success="onSectionInfoSuccess"
      @cancel="onSectionInfoCancel")

  q-tab-panel(name="settingsTeacher")
    equipment-settings(
      label="Преподаватель"
      :params="equipments.teacher"
      @update="changeEquipment('teacher',$event)")
    .text-right.q-mt-md
      q-btn(@click="tab = 'settingsStudent'" color="primary") Далее

  q-tab-panel(name="settingsStudent")
    equipment-settings(
      label="Студент"
      :params="equipments.student"
      @update="changeEquipment('student',$event)")
    .text-right.q-mt-md
      q-btn(@click="startQuiz()" color="primary") Далее

  q-tab-panel(name="quizCallsign")
    quiz-callsign-info(
      :list="quizList"
      @cancel="onCallsignCancel()"
      @success="onCallsignSuccess()")
</template>

<script>
import {
  defineComponent,
  onMounted,
  ref,
  computed,
} from 'vue';
// import { api } from 'boot/axios';
import { loadArchive } from 'src/helpers/archive';
import EquipmentSettings from 'components/EquipmentSettings.vue';
import QuizComponent from 'src/components/Quiz/QuizComponent.vue';
import QuizSelectSection from 'src/components/Quiz/Prepare/SelectSection.vue';
import QuizSectionInfo from 'src/components/Quiz/Prepare/SectionInfo.vue';
import QuizCallsignInfo from 'src/components/Quiz/Prepare/CallsignInfo.vue';
import { shuffle } from 'src/helpers';

export default defineComponent({
  components: {
    EquipmentSettings,
    QuizComponent,
    QuizSelectSection,
    QuizSectionInfo,
    QuizCallsignInfo,
  },
  setup(_, { emit }) {
    const project = ref();
    const sectionList = ref([]);
    const chapterList = ref([]);
    const taskList = ref([]);
    const selectSection = ref();
    const tab = ref('start');
    const quizList = ref([]);

    const fetchArchive = async () => {
      const info = await loadArchive();
      sectionList.value = info.sectionList;
      chapterList.value = info.chapterList;
      taskList.value = info.taskList;
      project.value = info;
    };

    const equipments = ref(null);

    const fetchSettings = async () => {
      const data = await window.settingsApi.loadSettings();
      equipments.value = data.equipments || {};
    };

    onMounted(() => {
      fetchArchive();
      fetchSettings();
    });

    const chapterListBySection = computed(() => {
      if (!selectSection.value) return [];
      const list = chapterList.value.filter((item) => item.sectionId === selectSection.value.id);
      return list;
    });
    const taskInQuiz = computed(() => {
      if (chapterListBySection.value.length === 0) return [];

      const ids = chapterListBySection.value.map((item) => item.id);
      const list = taskList.value.filter((item) => ids.includes(item.chapterId));

      return list;
    });

    const generateQuiz = () => {
      const assocChapters = new Map();

      chapterListBySection.value.forEach((item) => assocChapters.set(item.id, item));

      const tasks = [];
      chapterListBySection.value.forEach((chapter) => {
        const filteredTaskList = taskList.value.filter((task) => task.chapterId === chapter.id);
        let list = shuffle(filteredTaskList);
        list = list.slice(0, chapter.countTask);
        // console.log('list slice',list.length)
        if (list.length) {
          tasks.push(...list);
        }
      });
      tasks.forEach((item) => {
        item.chapter = assocChapters.get(item.chapterId);
      });

      return tasks;
    };

    const startQuiz = () => {
      tab.value = 'quizCallsign';
      quizList.value = generateQuiz();
    };

    return {
      equipments,
      quizList,
      taskInQuiz,
      tab,
      chapterListBySection,
      project,
      sectionList,
      chapterList,
      taskList,
      selectSection,

      startQuiz,

      fetchArchive,
      async changeEquipment(propName, params) {
        const settings = await window.settingsApi.loadSettings();
        if (!settings.equipments) settings.equipments = {};
        settings.equipments[propName] = JSON.parse(JSON.stringify(params));
        await window.settingsApi.saveSettings(settings);
      },

      onSectionSelect(item) {
        selectSection.value = item;
        tab.value = 'sectionInfo';
      },
      onSectionInfoSuccess() {
        tab.value = 'settingsTeacher';
      },
      onSectionInfoCancel() {
        tab.value = 'start';
      },
      onCallsignCancel() {
        tab.value = 'sectionInfo';
      },

      onCallsignSuccess() {
        const params = {
          section: selectSection.value,
          quizList: quizList.value,
        };
        emit('success', params);
      },
    };
  },

});
</script>
