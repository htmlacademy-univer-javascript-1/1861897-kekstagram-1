const documentBody = document.querySelector('body');

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

const isEscKey = (keyCode) => keyCode === 'Escape';

const showAlert = (message) => {
  const alertContainer = document.createElement('div');
  const alertBlock = document.createElement('div');
  alertContainer.style.zIndex = '100';
  alertContainer.style.backgroundColor = 'rgba(95,86,32,0.62)';
  alertContainer.style.position = 'fixed';
  alertContainer.style.left = '0';
  alertContainer.style.top = '0';
  alertContainer.style.bottom = '0';
  alertContainer.style.right = '0';
  alertContainer.style.width = '100%';
  alertContainer.style.height = '100%';
  alertContainer.style.display = 'flex';
  alertContainer.style.justifyContent = 'center';
  alertContainer.style.alignItems = 'center';
  alertBlock.style.padding = '3%';
  alertBlock.style.position = 'relative';
  alertBlock.style.display = 'flex';
  alertBlock.style.justifyContent = 'center';
  alertBlock.style.alignItems = 'center';
  alertBlock.style.width = '50%';
  alertBlock.style.height = '50%';
  alertBlock.style.fontSize = '25px';
  alertBlock.style.lineHeight = '1.5';
  alertBlock.style.textAlign = 'center';
  alertBlock.style.backgroundColor = '#3c3614';
  alertBlock.style.Color = '#ffe753';
  alertBlock.style.borderRadius = '10px';
  alertBlock.textContent = message;

  alertContainer.appendChild(alertBlock);
  documentBody.appendChild(alertContainer);
};

export {getRandomPositiveInteger, checkStringLength, isEscKey, showAlert};
