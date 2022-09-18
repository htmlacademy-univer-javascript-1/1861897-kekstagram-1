function OutOfRangeException(message) {
  this.message = message;
  this.name = 'OutOfRangeException';
}

const randomInteger = (min, max) => {
  if (min < 0 || max < 0) {
    throw new OutOfRangeException('Negative range');
  }
  if (min > max) {
    [min, max] = [max, min];
  }
  const rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(Math.abs(rand));  // to avoid negative zero
};

try {
  randomInteger(50, 0);
} catch (e) {
  // eslint-disable-next-line no-console
  console.error(e.message, e.name);
}

const checkMaxString = (string, maxLength) => string.length <= maxLength;

checkMaxString('abcde', 4);


