export { faker } from 'https://cdn.skypack.dev/@faker-js/faker';
import {initialRenderPictures} from './pictures.js';
import './image-upload.js';
import {getData} from './api.js';
import {showAlert} from './utils.js';

getData((pictures) => {
  initialRenderPictures(pictures);
},
() => {
  showAlert('Не удалось загрузить данные. Проверьте подключение к Интернету и попробуйте перезагрузить страницу.');
});
