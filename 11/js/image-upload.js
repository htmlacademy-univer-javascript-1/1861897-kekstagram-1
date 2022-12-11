import {isEscKey} from './utils.js';
import {sendData} from './api.js';

const MAX_HASHTAGS_NUMBER = 5;
const MAX_COMMENT_LENGTH = 140;

const documentBody = document.querySelector('body');

const successfulSubmission = document.querySelector('#success').content.querySelector('.success');
const errSubmission = document.querySelector('#error').content.querySelector('.error');
const successButton = successfulSubmission.querySelector('.success__button');
const errorButton = errSubmission.querySelector('.error__button');

const uploadImage = document.querySelector('#upload-file');
const overlayImage = document.querySelector('.img-upload__overlay');
const closeButton = document.querySelector('#upload-cancel');

const form = document.querySelector('.img-upload__form');
const hashtagInput = form.querySelector('.text__hashtags');
const commentInput = form.querySelector('.text__description');
const submitButton = form.querySelector('.img-upload__submit');

const zoomOutButton = overlayImage.querySelector('.scale__control--smaller');
const zoomInButton = overlayImage.querySelector('.scale__control--bigger');
const scaleControl = overlayImage.querySelector('.scale__control--value');
const previewImage = overlayImage.querySelector('.img-upload__preview');

const effects = overlayImage.querySelector('.effects__list');
const slider = overlayImage.querySelector('.effect-level__slider');
const effectLevelInput = overlayImage.querySelector('.effect-level__value');
const sliderField = overlayImage.querySelector('.img-upload__effect-level');
let selectedEffect;

const pristine = new Pristine(form, {
  classTo: 'text',
  errorClass: 'text-invalid',
  successClass: 'text-valid',
  errorTextParent: 'text',
  errorTextTag: 'div',
  errorTextClass: 'text-invalid__error'
}, true);

const changeScale = (evt) => {
  const scaleValue = scaleControl.value.replace('%', '');
  const changeScaleControlValue = (zoomOut) => zoomOut ? `${parseInt(scaleValue, 10) - 25}%` :
    `${parseInt(scaleValue, 10) + 25}%`;
  const changeScaleStyle = (zoomOut) => zoomOut ? `scale(${(parseInt(scaleValue, 10) - 25) / 100})` :
    `scale(${(parseInt(scaleValue, 10) + 25) / 100})`;
  if (evt.target === zoomOutButton && scaleValue > 25) {
    scaleControl.value = changeScaleControlValue(true);
    previewImage.style.transform = changeScaleStyle(true);
  } else if (evt.target === zoomInButton && scaleValue < 100) {
    scaleControl.value = changeScaleControlValue(false);
    previewImage.style.transform = changeScaleStyle(false);
  }
};

const onZoomInButtonClick = (evt) => {
  changeScale(evt);
};

const onZoomOutButtonClick = (evt) => {
  changeScale(evt);
};

const EFFECTS = {
  chrome: {
    min: 0,
    max: 1,
    step: 0.1,
    style: 'grayscale',
    unit: '',
  },
  marvin: {
    min: 0,
    max: 100,
    step: 1,
    style: 'invert',
    unit: '%',
  },
  sepia: {
    min: 0,
    max: 1,
    step: 0.1,
    style: 'sepia',
    unit: '',
  },
  phobos: {
    min: 0,
    max: 3,
    step: 0.1,
    style: 'blur',
    unit: 'px',
  },
  heat: {
    min: 1,
    max: 3,
    step: 0.1,
    style: 'brightness',
    unit: '',
  }
};

const applyEffectOnImage = (evt) => {
  selectedEffect = evt.target.value;
  const effectConfig = EFFECTS[selectedEffect];
  if (!effectConfig) {
    sliderField.classList.add('hidden');
    return;
  }
  sliderField.classList.remove('hidden');

  const {min, max, step} = effectConfig;

  slider.noUiSlider.updateOptions({
    range: {min, max},
    start: max,
    step,
  });

  previewImage.className = 'img-upload__preview';
  const effectsPreview = evt.target.parentNode.querySelector('.effects__preview');
  previewImage.classList.add(effectsPreview.getAttribute('class').split('  ')[1]);
};

const onEffectsChange = (evt) => {
  applyEffectOnImage(evt);
};

const changeEffectIntensity = () => {
  const sliderValue = slider.noUiSlider.get();
  effectLevelInput.value = sliderValue;
  const effectConfig = EFFECTS[selectedEffect];
  previewImage.style.filter = effectConfig
    ? `${effectConfig.style}(${sliderValue}${effectConfig.unit})`
    : '';
};

const onSliderUpdate = () => {
  changeEffectIntensity();
};

const closeOverlayImage = () => {
  uploadImage.value = '';
  form.reset();

  zoomInButton.removeEventListener('click', onZoomInButtonClick);
  zoomOutButton.removeEventListener('click', onZoomOutButtonClick);

  effects.removeEventListener('change', onEffectsChange);
  slider.noUiSlider.destroy();

  removeEventListenerImageEscKeydown();

  overlayImage.classList.add('hidden');
  document.body.classList.remove('modal-open');

  pristine.destroy();
};

const onCloseButtonClick = () => {
  closeOverlayImage();
};

const onOverlayImageEscKeydown = (evt) => {
  if (isEscKey(evt.key) && evt.target !== hashtagInput && evt.target !== commentInput
    && !documentBody.contains(errSubmission)) {
    closeOverlayImage();
  }
};

function removeEventListenerImageEscKeydown() {
  document.removeEventListener('keydown', onOverlayImageEscKeydown);
}

const disableSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = 'Идет публикация...';
};

const enableSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = 'Опубликовать';
};

const closeMessages = () => {
  if (documentBody.contains(successfulSubmission)) {
    documentBody.removeChild(successfulSubmission);
  }
  if (documentBody.contains(errSubmission)) {
    overlayImage.classList.remove('hidden');
    documentBody.removeChild(errSubmission);
  }
  removeEventListenersMsg();
};

const onCloseSuccessMsgClick = (evt) => {
  if (evt.target === successfulSubmission) {
    closeMessages();
  }
};

const onCloseErrorMsgClick = (evt) => {
  if (evt.target === errSubmission) {
    closeMessages();
  }
};

const onErrorMsgEscKeydown = (evt) => {
  if (isEscKey(evt.key)) {
    closeMessages();
  }
};

function removeEventListenersMsg() {
  document.removeEventListener('keydown', onErrorMsgEscKeydown);

  document.removeEventListener('click', onCloseSuccessMsgClick);
  successButton.removeEventListener('click', closeMessages);

  document.removeEventListener('click', onCloseErrorMsgClick);
  errorButton.removeEventListener('click', closeMessages);
}

uploadImage.addEventListener('change', () => {
  document.addEventListener('keydown', onOverlayImageEscKeydown);
  closeButton.addEventListener('click', onCloseButtonClick, {once: true});

  scaleControl.value = '100%';
  previewImage.style.transform = 'scale(1)';
  zoomOutButton.addEventListener('click', onZoomOutButtonClick);
  zoomInButton.addEventListener('click', onZoomInButtonClick);

  selectedEffect = 'effect-none';
  previewImage.className = 'img-upload__preview';
  previewImage.classList.add('effects__preview--none');
  effects.addEventListener('change', onEffectsChange);

  sliderField.classList.add('hidden');
  noUiSlider.create(slider, {
    range: {
      min: 0,
      max: 100,
    },
    start: 100
  });
  slider.noUiSlider.on('update', () => {
    onSliderUpdate();
  });

  document.body.classList.add('modal-open');
  overlayImage.classList.remove('hidden');
});

// Validation
const regexHashtag = /^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/;

const splitHashtags = (values) => values.split(' ');

const isCorrectHashtag = (value) => regexHashtag.test(value);
const isCorrectComment = (value) => value.length <= MAX_COMMENT_LENGTH;
const isCorrectHashtagsNumber = (values) => {
  const hashtags = splitHashtags(values);
  return hashtags.length <= MAX_HASHTAGS_NUMBER;
};

const hasNoDuplicates = (values) => {
  const hashtags = splitHashtags(values);
  const lowerCaseHashtags = [];
  for (const hashtag of hashtags) {
    lowerCaseHashtags.push(hashtag.toLowerCase());
  }
  return !((new Set(lowerCaseHashtags)).size !== lowerCaseHashtags.length);
};

const validateHashtags = (values) => {
  if (values === '') {
    return true;
  }
  const hashtags = splitHashtags(values);
  return hashtags.every(isCorrectHashtag);
};

const validateComment = (value) => isCorrectComment(value);

pristine.addValidator(
  hashtagInput,
  (value) => validateHashtags(value),
  'Хэштэг задан неправильно',
  3
);

pristine.addValidator(
  hashtagInput,
  (value) => hasNoDuplicates(value),
  'Хэштэги должны быть уникальными',
  2
);

pristine.addValidator(
  hashtagInput,
  (value) => isCorrectHashtagsNumber(value),
  'Хэштэгов не должно быть больше 5',
  1
);

pristine.addValidator(
  commentInput,
  (value) => validateComment(value),
  'Длина комментария не должна превышать 140 символов'
);

form.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const isValidForm = pristine.validate();

  if (isValidForm) {
    disableSubmitButton();
    sendData(
      () => {
        closeOverlayImage();
        enableSubmitButton();
        successButton.addEventListener('click', closeMessages);
        document.addEventListener('keydown', onErrorMsgEscKeydown);
        document.addEventListener('click', onCloseSuccessMsgClick);
        documentBody.appendChild(successfulSubmission);
      },
      () => {
        overlayImage.classList.add('hidden');
        enableSubmitButton();
        errorButton.addEventListener('click', closeMessages);
        document.addEventListener('keydown', onErrorMsgEscKeydown);
        document.addEventListener('click', onCloseErrorMsgClick);
        documentBody.appendChild(errSubmission);
      },
      new FormData(evt.target),
    );
  }
});
