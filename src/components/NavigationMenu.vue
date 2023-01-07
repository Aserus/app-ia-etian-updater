<template lang="pug">
q-list
  q-item-label(header) Меню
  menu-item(v-for='(item,i) in linkList' :key='i' v-bind='item')

  q-separator
  //- q-item
  //-   q-item-section Версия программы
  //-   q-item-section(side) {{appVersion}}

</template>

<script>
import MenuItem from 'components/MenuItem.vue';

const linkList = [
  // {
  //   title: 'Проверка оборудования',
  //   icon: 'school',
  //   to: '/equipment/check'
  // },
  {
    title: 'Главная',
    icon: 'home',
    to: '/home',
  },
  {
    title: 'Тестирование',
    icon: 'quiz',
    to: '/quiz',
  },
  {
    title: 'Расписание',
    icon: 'today',
    to: '/schedule',
    disable: true,
  },
  {
    title: 'Архив',
    icon: 'today',
    to: '/schedule',
    disable: true,
  },
  {
    title: 'Настройка оборудования',
    icon: 'school',
    to: '/equipment/settings',
  },
  {
    title: 'Devtest',
    icon: 'school',
    to: '/devtest',
  },
];

import { defineComponent, ref } from 'vue';

export default defineComponent({

  components: {
    MenuItem,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      appVersion: process.env.APP_VERSION,
      linkList,
      leftDrawerOpen,
    };
  },
});
</script>
