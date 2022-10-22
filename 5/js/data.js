import { faker } from 'https://cdn.skypack.dev/@faker-js/faker';
import {getRandomPositiveInteger} from './utils.js';

const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

let commentIdx = 1;

const createComment = () => ({
  id: commentIdx++,
  avatar: `img/avatar-${getRandomPositiveInteger(1, 6)}.svg`,
  message: faker.datatype.boolean() ? MESSAGES[getRandomPositiveInteger(0, MESSAGES.length - 1)] :
    `${MESSAGES[getRandomPositiveInteger(0, MESSAGES.length - 1)]} ${MESSAGES[getRandomPositiveInteger(0, MESSAGES.length - 1)]}`,
  name: faker.name.firstName(),
});

const createPhotos = () => Array.from({length: 25}).map((value, index) => ({
  id: index + 1,
  url: `photos/${index + 1}.jpg`,
  description: faker.lorem.sentences(getRandomPositiveInteger(1, 5)),
  likes: getRandomPositiveInteger(15, 200),
  comments: Array.from({length: getRandomPositiveInteger(0, 15)}).map(() =>
    createComment()),
}));

export {createPhotos};

