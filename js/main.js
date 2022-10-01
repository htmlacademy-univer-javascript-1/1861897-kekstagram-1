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


