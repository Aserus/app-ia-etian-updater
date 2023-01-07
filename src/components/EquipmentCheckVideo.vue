<template lang="pug">
q-dialog(v-model="dialog")
  q-card
    q-card-section
      .text-h6 Проверка видео
    q-separator
    //- q-card-section
    video(ref="videoEl").dev-camera-video
    q-card-actions(align="right")
      q-btn(color="red" icon="close" @click="clickError()") Не работает
      q-btn(color="primary" icon="check" @click="clickSuccess()") Видео работает
</template>

<script>
import {
  defineComponent,
  ref,
  onUnmounted,
  onMounted,
  nextTick,
} from 'vue';

export default defineComponent({
  props: {
    deviceId: String,
  },
  setup(props, { emit }) {
    const videoEl = ref(null);

    const dialog = ref(true);
    let streamCamera = null;

    const clearCamera = () => {
      console.log('clearCamera');
      if (streamCamera) {
        streamCamera.getTracks().forEach((track) => track.stop());
        streamCamera = null;
      }
      if (videoEl.value) {
        videoEl.value.srcObject = null;
      }
    };

    const showCamera = async () => {
      clearCamera();
      // if(!devParams.cameraId) return;

      const constraints = {
        video: {
          deviceId: props.deviceId,
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamCamera = stream;
      console.log('videoEl.value', videoEl.value);
      videoEl.value.srcObject = stream;
      videoEl.value.play();
    };

    onUnmounted(() => {
      clearCamera();
    });

    onMounted(() => {
      nextTick().then(() => showCamera());
    });

    return {
      videoEl,
      dialog,
      clickError() {
        dialog.value = false;
        emit('error');
      },
      clickSuccess() {
        dialog.value = false;
        emit('success');
      },
    };
  },
});
</script>

<style scoped>
.dev-camera-video{
  width:100%;
}

.pids-wrapper{
  width: 100%;
}
.pid{
  width: calc(10% - 10px);
  height: 10px;
  display: inline-block;
  margin: 5px;
  background: #CCC;
}

.dev-mic-level ::v-deep(.q-linear-progress__model--with-transition){
  transition: none!important;
}

.equipment-settings{
  width:500px;
  max-width: 100%;
}
</style>
