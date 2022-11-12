import {isEscKey} from './utils.js';

const uploadImage = document.querySelector('#upload-file');
const overlayImage = document.querySelector('.img-upload__overlay');
const closeButton = document.querySelector('#upload-cancel');

const form = document.querySelector('.img-upload__form');
const hashtagInput = form.querySelector('.text__hashtags');
const commentInput = form.querySelector('.text__description');
const submitButton = form.querySelector('.img-upload__submit');

const closeOverlayImage = () => {
  uploadImage.value = '';
  overlayImage.classList.add('hidden');
  document.body.classList.remove('modal-open');
};

const onOverlayEscKeydown = (evt) => {
  if (isEscKey(evt.key) && evt.target !== hashtagInput && evt.target !== commentInput) {
    closeOverlayImage();
  }
};

uploadImage.addEventListener('change', () => {
  document.addEventListener('keydown', onOverlayEscKeydown);
  closeButton.addEventListener('click', closeOverlayImage, {once: true});

  document.body.classList.add('modal-open');
  overlayImage.classList.remove('hidden');
});

// Validation
let isCheckPassedForHashtag = true;
let isCheckPassedForComment = true;

const pristine = new Pristine(form, {
  classTo: 'text',
  errorClass: 'text-invalid',
  successClass: 'text-valid',
  errorTextParent: 'text',
  errorTextTag: 'div',
  errorTextClass: 'text-invalid__error'
}, true);

const checkSubmitButton = () => {
  submitButton.disabled = !isCheckPassedForHashtag || !isCheckPassedForComment;
};

const regexHashtag = /(^\s*$)|(^#[A-Za-zА-Яа-яЁё0-9]{1,19}$)/;

const isCorrectHashtag = (value) => regexHashtag.test(value);
const isCorrectComment = (value) => value.length < 140;

const validateHashtag = (value) => {
  const hashtags = value.split(' ');
  isCheckPassedForHashtag = hashtags.every(isCorrectHashtag);
  checkSubmitButton();
  return isCheckPassedForHashtag;
};

const validateComment = (value) => {
  isCheckPassedForComment = isCorrectComment(value);
  checkSubmitButton();
  return isCheckPassedForComment;
};

pristine.addValidator(
  hashtagInput,
  validateHashtag,
  'Хэштэг задан неправильно'
);

pristine.addValidator(
  commentInput,
  validateComment,
  'Длина комментария не должна превышать 140 символов'
);

form.addEventListener('submit', () => {
  pristine.validate();
});
