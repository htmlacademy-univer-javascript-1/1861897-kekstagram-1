import {openPictureModal} from './modal.js';
import {faker} from './main.js';

const DEBOUNCE_DELAY = 500;
const NUMBER_OF_PICTURES_FOR_RANDOM_FILTER = 10;

const buttonDefault = document.querySelector('#filter-default');
const buttonRandom = document.querySelector('#filter-random');
const buttonDiscussed = document.querySelector('#filter-discussed');

const FILTERS = {
  'filter-default': buttonDefault,
  'filter-random': buttonRandom,
  'filter-discussed': buttonDiscussed,
};

const filters = document.querySelector('.img-filters');
const filtersGroup = document.querySelector('.img-filters__form');

let newPictures, currentPictures = [];

const picturesListElem = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');
const picturesFragment = document.createDocumentFragment();

const removePictures = () => {
  currentPictures.forEach((pic) => picturesListElem.removeChild(pic));
  currentPictures = [];
};

const appendPicture = (picture) => {
  const {id, url, likes, comments} = picture;

  const newPicture = pictureTemplate.cloneNode(true);
  newPicture.querySelector('.picture__img').src = url;
  newPicture.querySelector('.picture__likes').textContent = likes;
  newPicture.querySelector('.picture__comments').textContent = comments.length;

  newPicture.dataset.id = id;

  picturesFragment.appendChild(newPicture);

  currentPictures.push(newPicture);
};

const activateButtons = (filter) => {
  [buttonDefault, buttonRandom, buttonDiscussed].forEach((button) => button.classList
    .remove('img-filters__button--active'));
  FILTERS[filter].classList.add('img-filters__button--active');
};

const renderPictures = () => {
  removePictures();

  newPictures.forEach(appendPicture);
  picturesListElem.appendChild(picturesFragment);

  picturesListElem.addEventListener('click', (evt) => {
    const pictureElement = evt.target.closest('.picture');
    if (pictureElement) {
      const clickedPicture = newPictures.find(({id}) => Number(pictureElement.dataset.id) === id);
      openPictureModal(clickedPicture);
    }
  });
};

const changeFilter = (pictures) => {
  let currentFilter = 'filter-default';
  let timeoutId;

  filtersGroup.addEventListener('click', (evt) => {
    const allPictures = JSON.parse(JSON.stringify(pictures));
    const shuffledPictures = JSON.parse(JSON.stringify(pictures));
    const sortedPictures = JSON.parse(JSON.stringify(pictures));

    const filter = evt.target.id;
    switch (filter) {
      case 'filter-default':
        newPictures = allPictures;
        break;
      case 'filter-random':
        faker.helpers.shuffle(shuffledPictures);
        newPictures = shuffledPictures.slice(0, NUMBER_OF_PICTURES_FOR_RANDOM_FILTER);
        break;
      case 'filter-discussed':
        newPictures = sortedPictures.sort((a, b) => b.comments.length - a.comments.length);
        break;
    }

    activateButtons(filter);

    if (filter !== currentFilter) {
      currentFilter = filter;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => renderPictures(), DEBOUNCE_DELAY);
    }
  });
};

const initialRenderPictures = (pictures) => {
  filters.classList.remove('img-filters--inactive');
  newPictures = [...pictures];

  renderPictures();
  changeFilter(pictures);
};

export {initialRenderPictures};
