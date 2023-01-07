<template lang="pug">
q-card(square dense).equipment-settings
  q-card-section.bg-primary.text-white.q-py-sm
    .text-h6 {{label}}
    //.text-subtitle2 by John Doe
  q-card-section
    .text-h6 Вебкамера
    q-select(
      v-model="devParams.camera"
      :options="cameraList"
      label="Устройство"
      outlined
      dense
      )
      template(v-slot:after)
        q-btn(
          color="primary"
          :disable="!devParams.camera"
          @click="dialogCheckVideo = true") проверить

  equipment-check-video(
    v-if="dialogCheckVideo && devParams && devParams.camera"
    :device-id="devParams.camera.deviceId"
    @error="dialogCheckVideo = false"
    @success="dialogCheckVideo = false"
    )
  q-separator

  q-card-section
    .text-h6 Микрофон
    q-select(
      v-model="devParams.microphone"
      :options="microphoneList"
      label="Устройство"
      outlined
      dense
      )
      template(v-slot:after)
        q-btn(
          color="primary"
          label="Проверить"
          :disable="!devParams.microphone"
         @click="dialogCheckMicrophone = true" )
  //- pre {{dialogCheckMicrophone && devParams && devParams.microphone}}
  equipment-check-microphone(
    v-if="dialogCheckMicrophone && devParams && devParams.microphone"
    :device-id="devParams.microphone.deviceId"
    @error="dialogCheckMicrophone = false"
    @success="dialogCheckMicrophone = false"
    )

  q-separator
  q-card-section
    .text-h6 Наушники
    q-select(
      v-model="devParams.speaker"
      :options="speakerList"
      label="Устройство"
      outlined
      dense
      )
      template(v-slot:after)
        q-btn(
          color="primary"
          :disable="!devParams.speaker"
          @click="clickSpeaker") проверить

  //pre {{devParams}}
</template>

<script>
import {
  defineComponent,
  ref,
  reactive,
  watch,
  // onUnmounted,
  onMounted,
} from 'vue';
import audioTest from 'assets/test-sound.mp3';
import EquipmentCheckVideo from './EquipmentCheckVideo.vue';
import EquipmentCheckMicrophone from './EquipmentCheckMicrophone.vue';

export default defineComponent({
  props: {
    label: String,
    params: Object,
  },
  components: {
    EquipmentCheckVideo,
    EquipmentCheckMicrophone,
  },
  setup(props, { emit }) {
    const cameraList = ref([]);
    const microphoneList = ref([]);
    const speakerList = ref([]);

    const dialogCheckVideo = ref(false);
    const dialogCheckMicrophone = ref(false);

    console.log('props.params', props.params);

    const devParams = reactive({
      camera: props.params ? props.params.camera : null,
      speaker: props.params ? props.params.speaker : null,
      microphone: props.params ? props.params.microphone : null,
    });

    const fetchDeviceList = async () => {
      let deviceInfos = await navigator.mediaDevices.enumerateDevices();

      deviceInfos = deviceInfos.filter((item) => item.deviceId !== 'default');

      cameraList.value = deviceInfos.filter((item) => item.kind === 'videoinput');
      microphoneList.value = deviceInfos.filter((item) => item.kind === 'audioinput');
      speakerList.value = deviceInfos.filter((item) => item.kind === 'audiooutput');
    };

    const onUpdateParams = () => {
      emit('update', devParams);
      console.log('upd test', devParams);
    };

    watch(
      () => devParams.camera,
      () => onUpdateParams(),
    );
    watch(
      () => devParams.microphone,
      () => onUpdateParams(),
    );
    watch(
      () => devParams.speaker,
      () => onUpdateParams(),
    );

    onMounted(() => fetchDeviceList());

    return {
      devParams,

      cameraList,
      microphoneList,
      speakerList,

      dialogCheckVideo,
      dialogCheckMicrophone,

      clickSpeaker() {
        const audio = new Audio(audioTest);
        audio.setSinkId(devParams.speaker.deviceId);
        audio.play();
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
