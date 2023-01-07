import EventEmitter from 'events';
import { CaptureDevice } from './capture';
import { convertImage } from './index';

const TIMER_SCREENSHOT = 30 * 1000;
const TIMER_PHOTOS = 45 * 1000;

export class CaptureQuiz extends EventEmitter {
  constructor(teacher, student) {
    super();

    this.capture = {
      teacher: new CaptureDevice(teacher),
      student: new CaptureDevice(student),
    };

    this.log = [];

    this.capture.teacher.on('microphone', async (item) => {
      const tag = 'teacher';
      const type = 'microphone';

      const { duration, blob } = item;
      const filename = await window.quizApi.pushBlob(this.recordId, blob);
      const data = {
        type,
        tag,
        duration,
        filename,
      };
      this.pushLog(data);
    });

    this.on('photo', async (item) => {
      const { blob, tag } = item;
      const filename = await window.quizApi.pushBlob(this.recordId, blob);
      const data = {
        type: 'photo',
        tag,
        filename,
      };
      this.pushLog(data);
    });
    this.on('screen', async (item) => {
      const { blob, tag } = item;
      const filename = await window.quizApi.pushBlob(this.recordId, blob);
      const data = {
        type: 'screenshot',
        filename,
        tag,
      };
      this.pushLog(data);
    });
  }

  async pushLog(data) {
    const ts = Date.now();
    this.log.push({ ts, ...data });

    await window.quizApi.saveLog(this.recordId, this.log);
  }

  async start() {
    await Promise.all([
      this.capture.teacher.start(),
      this.capture.student.start(),
    ]);
    this.recordId = await window.quizApi.newRecord();
    this.timerPhotos = setInterval(() => this.makePhotos(), TIMER_PHOTOS);
    this.timerScreens = setInterval(() => this.makeScreens(), TIMER_SCREENSHOT);

    const data = {
      startAt: Date.now(),
      info: this.info,
    };
    await window.quizApi.saveInfo(this.recordId, data);
  }

  async stop() {
    await Promise.all([
      this.capture.teacher.stop(),
      this.capture.student.stop(),
    ]);
    clearInterval(this.timerScreens);
    clearInterval(this.timerPhotos);
  }

  async clear() {
    await Promise.all([
      this.capture.teacher.clear(),
      this.capture.student.clear(),
    ]);
  }

  async makePhotos() {
    return Promise.all([
      this.capture.teacher
        .makePhoto()
        .then((blob) => this.emit('photo', { tag: 'teacher', blob })),

      this.capture.student
        .makePhoto()
        .then((blob) => this.emit('photo', { tag: 'student', blob })),

    ]);
  }

  async makeScreens() {
    const screens = await window.screenApi.displays();
    const res = await Promise.all(screens.map((src) => convertImage(src)));

    res.forEach((blob) => this.emit('screen', { tag: 'system', blob }));
  }

  setInfo(info) {
    this.info = info;
  }
}
