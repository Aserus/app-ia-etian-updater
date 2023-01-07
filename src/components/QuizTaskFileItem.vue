<template lang="pug">
div
  q-item(v-if="!src" @click="fetchContent()" clickable)
    q-item-section(avatar)
      q-icon(name="play_arrow" color="primary")
    q-item-section {{file.name}}
  div(v-else)
    audio(:src="src" controls autoplay)
    pre {{src}}

    //pre {{file.filename}}

</template>

<script>
import {
  defineComponent,
  ref,
} from 'vue';
// import { api } from 'boot/axios'
import { loadArchiveTaskFile } from 'src/helpers/archive';

export default defineComponent({
  components: {

  },
  props: {
    file: Object,
    task: Object,
  },
  setup(props) {
    const src = ref(null);
    // const content = ref(null)
    // const fileList = ref([])

    const fetchContent = async () => {
      const data = await loadArchiveTaskFile(props.file.filename);
      const blob = new Blob([data], { type: 'audio/ogg' });

      const blobURL = window.URL.createObjectURL(blob);
      src.value = blobURL;
      // const audio0 = new Audio(blobURL);
      // content.value = data.content

      // fileList.value = data.fileList

      console.log(blob);
    };

    // onMounted(()=>{
    //   fetchContent()
    // })
    return {
      src,
      fetchContent,
    };
  },

});
</script>
