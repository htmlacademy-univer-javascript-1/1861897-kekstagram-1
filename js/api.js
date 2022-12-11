const getData = (onSuccess, onFail) => {
  fetch('https://26.javascript.pages.academy/kekstagram/data')
    .then((response) => {
      if (response.ok) {
        response.json().then((posts) => {
          onSuccess(posts);
        });
      } else {
        throw new Error('Not OK response');
      }
    })
    .catch(() => {
      onFail('Произошла ошибка. Не удалось загрузить данные. Попробуйте перезагрузить страницу.');
    });
};

const sendData = (onSuccess, onFail, body) => {
  fetch(
    'https://26.javascript.pages.academy/kekstagram',
    {
      method: 'POST',
      body,
    },
  )
    .then((response) => {
      if (response.ok) {
        onSuccess();
      } else {
        onFail('Не удалось отправить форму. Попробуйте ещё раз.');
      }
    })
    .catch(() => {
      onFail('Не удалось отправить форму. Попробуйте ещё раз.');
    });
};

export {getData, sendData};
