import {FILE_TYPES} from './data.js';

const fileChooser = document.querySelector('input[type=file]');
const preview = document.querySelector('.img-upload__preview').querySelector('img');

fileChooser.addEventListener('change', () => {
  const file = fileChooser.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

  if (matches) {
    preview.src = URL.createObjectURL(file);
  }
});
