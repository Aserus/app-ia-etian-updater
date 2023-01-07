import dayjs from 'dayjs';

export const formatDate = (d) => dayjs(d).format('DD.MM.YYYY');

export function shuffle(srcArr) {
  const array = [...srcArr];
  let currentIndex = array.length; let temporaryValue; let
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// function blobToBase64(blob) {
//   return new Promise((resolve) => {
//     const reader = new FileReader();
//     reader.onloadend = () => resolve(reader.result);
//     reader.readAsDataURL(blob);
//   });
// }

export function canvasToBlob(canvas, mime, quality) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, mime, quality);
  });
}

export function loadImg(src) {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Ошибка при получении картинки'));
    img.src = src;
  });
}

export async function convertImage(src) {
  const original = await loadImg(src);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = original.naturalWidth;
  canvas.height = original.naturalHeight;

  ctx.drawImage(original, 0, 0);
  return canvasToBlob(canvas, 'image/webp', 0.92);
}

export async function takeScreenByVideo(video, size) {
  const canvas = document.createElement('canvas');
  canvas.width = size.width;
  canvas.height = size.height;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const blob = await canvasToBlob(canvas, 'image/webp', 0.92);
  return blob;
}

export const cloneObj = (obj) => JSON.parse(JSON.stringify(obj));
