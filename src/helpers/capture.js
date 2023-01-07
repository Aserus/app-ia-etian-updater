import EventEmitter from 'events';
import { takeScreenByVideo } from './index';

const CAPTURE_CLIP_RECORD_TIMER = 60 * 1000;

async function createVideoStream(deviceId) {
  const params = {
    video: {
      height: 720,
      deviceId,
    },
  };
  return navigator.mediaDevices.getUserMedia(params);
}

function createVideo(stream) {
  const video = document.createElement('video');
  video.muted = true;
  video.autoplay = true;
  video.srcObject = stream;
  return video;
}

export class CaptureDevice extends EventEmitter {
  constructor(params) {
    super();
    this.cameraId = params.camera.deviceId;
    this.microphoneId = params.microphone.deviceId;
  }

  async start() {
    this.isStart = true;
    this.stream = await createVideoStream(this.cameraId);
    this.video = createVideo(this.stream);

    if (this.microphoneId) {
      await this.createRecorder();
      this.startRecord();
    }
  }

  async makePhoto() {
    const { width, height } = this.stream.getTracks()[0].getSettings();
    const size = { width, height };

    const photo = await takeScreenByVideo(this.video, size);
    this.emit('screen', photo);
    return photo;
  }

  clear() {
    this.stream.getTracks().forEach((track) => track.stop());
    this.stream = null;
    this.video = null;
    this.recorder = null;
    this.name = null;

    this.clearRecord();
  }

  startRecord() {
    this.recorder.start();

    setTimeout(() => this.recorder.stop(), CAPTURE_CLIP_RECORD_TIMER);
  }

  recordStopped() {
    console.log('recordStopped', this, this.recordedChunks);
    const now = Date.now();

    const duration = this.processStartTime ? Math.floor((now - this.processStartTime) / 1000) : 0;

    const recordedBlob = new Blob(this.recordedChunks, { type: 'audio/ogg' });
    const resultItem = { duration, blob: recordedBlob };

    this.emit('microphone', resultItem);
    this.recordedChunks = [];
    if (this.isStart) {
      this.startRecord();
    }
  }

  onRecordError(err) {
    console.log(err, this);
  }

  clearRecord() {
    console.log('clearRecord');
    if (this.recorderStream) this.recorderStream.getTracks().forEach((track) => track.stop());
    this.recorder = null;
    this.recordedChunks = [];
    this.processStartTime = null;
  }

  async createRecorder() {
    const params = {
      audio: {
        deviceId: this.microphoneId,
      },
    };
    const stream = await navigator.mediaDevices.getUserMedia(params);

    this.recorder = new MediaRecorder(stream);
    this.recorderStream = stream;
    this.recordedChunks = [];

    this.recorder.ondataavailable = (event) => this.recordedChunks.push(event.data);
    this.recorder.onstop = () => this.recordStopped();
    this.recorder.onerror = (err) => this.onRecordError(err);

    this.recorder.onstart = () => {
      this.processStartTime = Date.now();
    };
  }

  stop() {
    this.isStart = false;
    this.recorder.stop();
  }
}
