import {isEscKey} from './utils.js';

const pictureModalElement = document.querySelector('.big-picture');
const commentCounterElement = pictureModalElement.querySelector('.comments-count');
const imageElement = pictureModalElement.querySelector('.big-picture__img img');
const likesCounterElement = pictureModalElement.querySelector('.likes-count');
const descriptionElement = pictureModalElement.querySelector('.social__caption');
const buttonCloseElement = pictureModalElement.querySelector('#picture-cancel');

const commentsCounterOnPic = pictureModalElement.querySelector('.social__comment-count');
const commentsLoader = pictureModalElement.querySelector('.social__comments-loader');

const commentListElement = pictureModalElement.querySelector('.social__comments');
const commentTemplate = document.querySelector('#comment')
  .content
  .querySelector('.social__comment');

let picComments;
let loadCounter = 0;

const renderComment = (comment) => {
  const commentElement = commentTemplate.cloneNode(true);

  commentElement.querySelector('.social__picture').src = comment.avatar;
  commentElement.querySelector('.social__picture').alt = comment.name;
  commentElement.querySelector('.social__text').textContent = comment.message;

  return commentElement;
};

const onLoadMoreButton = () => {
  for (let i = loadCounter; i < loadCounter + 5; i++) {
    const allComments = ` из ${picComments.length} комментариев`;
    if (i === picComments.length - 1) {
      commentsLoader.classList.add('hidden');
    }
    if (i >= picComments.length) {
      break;
    }
    const comment = renderComment(picComments[i]);
    commentListElement.appendChild(comment);
    commentsCounterOnPic.textContent = `${i + 1}${allComments}`;
  }
  loadCounter += 5;
};

const renderPartOfComments = () => {
  const allComments = ` из ${picComments.length} комментариев`;
  const commentsNumber = picComments.length < 6 ? picComments.length : 5;
  commentsCounterOnPic.textContent = `${commentsNumber}${allComments}`;
  for (let i = 0; i < commentsNumber; i++) {
    const comment = renderComment(picComments[i]);
    commentListElement.appendChild(comment);
    loadCounter = i + 1;
  }
};

const closePictureModal = () => {
  pictureModalElement.classList.add('hidden');
  document.body.classList.remove('modal-open');

  commentsCounterOnPic.classList.add('hidden');
  commentsLoader.classList.add('hidden');

  commentsLoader.removeEventListener('click', onLoadMoreButton);
};

const onPictureModalKeydown = (evt) => {
  if (isEscKey(evt.key)) {
    closePictureModal();
  }
};

const onPictureModalCloseClick = () => {
  closePictureModal();
};

const openPictureModal = ({url, likes, comments, description}) => {
  imageElement.src = url;
  commentCounterElement.textContent = comments.length;
  likesCounterElement.textContent = likes;
  descriptionElement.textContent = description;

  document.body.classList.add('modal-open');
  pictureModalElement.classList.remove('hidden');

  commentsCounterOnPic.classList.remove('hidden');
  commentsLoader.classList.remove('hidden');

  commentListElement.textContent = '';
  loadCounter = 0;
  picComments = comments;

  if (picComments.length <= 5) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
    commentsLoader.addEventListener('click', onLoadMoreButton);
  }

  renderPartOfComments();

  document.addEventListener('keydown', onPictureModalKeydown);
  buttonCloseElement.addEventListener('click', onPictureModalCloseClick, {once: true});
};

export {openPictureModal};
