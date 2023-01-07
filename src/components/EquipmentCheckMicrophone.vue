<template lang="pug">
q-dialog(v-model="dialog")
  q-card
    q-card-section
      .text-h6 Проверка микрофона
    q-separator
    //- q-card-section
    q-linear-progress(
      size="20px"
      :value="micLevel"
      color="green"
      class="q-mt-sm").dev-mic-level
    q-card-actions(align="right")
      q-btn(color="red" icon="close" @click="clickError()") Не работает
      q-btn(color="primary" icon="check" @click="clickSuccess()") Микрофон работает
</template>

<script>
import {
  defineComponent,
  ref,
  onUnmounted,
  onMounted,
  watch,
  // nextTick,
} from 'vue';

export default defineComponent({
  props: {
    deviceId: String,
  },
  setup(props, { emit }) {
    const dialog = ref(true);

    let streamMic = null;
    let micInterval = null;

    const micLevel = ref(0);

    const clearMic = () => {
      if (streamMic) {
        streamMic.getTracks().forEach((track) => track.stop());
        streamMic = null;
        clearInterval(micInterval);
      }
    };

    const showMicrophone = async () => {
      clearMic();

      const constraints = {
        audio: {
          deviceId: props.deviceId,
          // echoCancellation: true
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamMic = stream;

      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;

      microphone.connect(analyser);
      analyser.connect(javascriptNode);
      javascriptNode.connect(audioContext.destination);

      const handleMic = () => {
        const array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        let values = 0;

        const { length } = array;
        for (let i = 0; i < length; i += 1) {
          values += (array[i]);
        }

        const average = values / length;
        micLevel.value = average / 100;
      };

      micInterval = setInterval(handleMic, 100);
    };

    onUnmounted(() => clearMic());

    onMounted(() => showMicrophone());

    watch(() => props.deviceId, (v) => {
      clearMic();
      if (v) showMicrophone();
    });

    return {
      micLevel,
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
