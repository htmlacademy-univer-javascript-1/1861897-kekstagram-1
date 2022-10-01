import { faker } from 'https://cdn.skypack.dev/@faker-js/faker';

function OutOfRangeException(message) {
  this.message = message;
  this.name = 'OutOfRangeException';
}

const getRandomPositiveInteger = (min, max) => {
  if (min < 0 || max < 0) {
    throw new OutOfRangeException('Negative range');
  }
  let minCopy = min;
  let maxCopy = max;
  if (minCopy > maxCopy) {
    [minCopy, maxCopy] = [maxCopy, minCopy];
  }
  const rand = minCopy - 0.5 + Math.random() * (maxCopy - minCopy + 1);
  return Math.round(Math.abs(rand));  // to avoid negative zero
};

try {
  getRandomPositiveInteger(50, 0);
} catch (e) {
  // eslint-disable-next-line no-console
  console.error(e.message, e.name);
}

const checkStringLength = (string, maxLength) => string.length <= maxLength;

checkStringLength('abcde', 4);

const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

let commentIdx = 1;
const photos = Array.from({length: 25}).map((value, index) => ({
  id: ++index,
  url: `photos/${index}.jpg`,
  description: faker.lorem.sentences(getRandomPositiveInteger(1, 5)),
  likes: getRandomPositiveInteger(15, 200),
  comments: Array.from({length: getRandomPositiveInteger(0, 15)}).map(() => ({
    id: commentIdx++,
    avatar: `img/avatar-${getRandomPositiveInteger(1, 6)}.svg`,
    message: getRandomPositiveInteger(1, 2) === 1 ? MESSAGES[getRandomPositiveInteger(0, 5)] :
      `${MESSAGES[getRandomPositiveInteger(0, 5)]} ${MESSAGES[getRandomPositiveInteger(0, 5)]}`,
    name: faker.name.firstName(),
  })),
}));

// eslint-disable-next-line no-console
console.log(photos);


