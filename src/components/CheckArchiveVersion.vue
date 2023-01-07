<template lang="pug">
div
  q-item
    q-item-section(side )
      q-spinner(v-if="loading" color="primary")
      q-icon(v-else-if="needUpdate" name='close' color="red")
      q-icon(v-else name='check' color="green")

    template(v-if="!needUpdate")
      q-item-section Версия архива
      q-item-section(side)
        template(v-if="localArchive")
          small {{localArchive.version}}
          small {{formatDate(localArchive.createdAt)}}
    template(v-else)
      q-item-section
        span(v-if="upgradeInProcess") Загружается
        span(v-else-if="externalArchive")
          | Есть новая версия {{externalArchive.version}} от {{formatDate(externalArchive.created)}}
        //upgradeInProcess

      q-item-section(v-if="upgradeInProcess" side) {{formatFilesize(upgradeLoaded)}}
      q-item-section(side)
        q-btn(
          color="primary"
          icon="file_download"
          flat
          round
          :loading="upgradeInProcess"
          square
          hint="Обновить архив"
          @click="upgrade")

</template>

<script>
import {
  defineComponent,
  onMounted,
  ref,
  computed,
} from 'vue';
import { api } from 'boot/axios';
import { formatDate } from 'src/helpers';
import { loadArchive, upgradeArchive } from 'src/helpers/archive';
import { filesize } from 'humanize';
// import  from 'humanize';

export default defineComponent({
  setup() {
    const loading = ref(false);
    const upgradeInProcess = ref(false);
    const localArchive = ref(null);
    const externalArchive = ref(null);
    const upgradeLoaded = ref(0);

    const fetchExternalArchive = async () => {
      const { data } = await api.get('/archives/last');
      externalArchive.value = data;
    };

    const fetchLocalArchive = async () => {
      localArchive.value = await loadArchive();
    };

    const fetchData = async () => {
      loading.value = true;
      try {
        await Promise.all([
          fetchExternalArchive(),
          fetchLocalArchive(),
        ]);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => fetchData());

    const needUpdate = computed(() => {
      if (loading.value) return false;
      if (!localArchive.value) return true;
      if (!externalArchive.value) return true;
      if (localArchive.value.version !== externalArchive.value.version) return true;

      return false;
    });

    return {
      upgradeInProcess,
      loading,
      needUpdate,
      localArchive,
      externalArchive,
      upgradeLoaded,
      formatDate,
      formatFilesize: filesize,
      async upgrade() {
        upgradeInProcess.value = true;
        try {
          upgradeLoaded.value = 0;
          await upgradeArchive({
            onDownloadProgress: (e) => {
              upgradeLoaded.value = e.loaded;
            },
          });
          await fetchLocalArchive();
          await fetchExternalArchive();
        } finally {
          upgradeInProcess.value = false;
        }
      },
    };
  },
});
</script>
