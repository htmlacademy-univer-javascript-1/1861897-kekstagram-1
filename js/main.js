import {renderPictures} from './pictures.js';
import './image-upload.js';
import {getData} from './api.js';
import {showAlert} from './utils.js';

getData((pictures) => {
  renderPictures(pictures);
},
() => {
  showAlert('Не удалось загрузить данные. Проверьте подключение к Интернету и попробуйте перезагрузить страницу.');
});
