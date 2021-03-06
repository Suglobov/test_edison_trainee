import storage from './storage';

const windowsLoad = () => new Promise((resolve) => // ждем загрузки страницы
    window.addEventListener('load', () => resolve('load')));
const findDomElems = () => new Promise((resolve, reject) => { // находим нужные элементы на странице
    Object.keys(storage.sl.dom).forEach(el => {
        storage.dom[el] = document.querySelector(storage.sl.dom[el]);
        if (!storage.dom[el]) reject(`'${storage.sl.dom[el]}' в dom не найден`);
    });
    resolve();
});

const putOnPage = (arr, name) => {
    if (!arr.length) return;
    storage.dom[`${name}Container`].textContent = '';
    arr.forEach(data => {
        const el = storage.templates[name](data);
        storage.dom[`${name}Container`].appendChild(el);
    });
};

const webSockerConnect = () => new Promise((resolve, reject) => {
    const HOST = location.origin.replace(/^https?/, 'ws');
    const ws = new WebSocket(HOST);
    ws.onerror = (error) => {
        // console.log('WebSocket connection error');
        reject(error);
    };
    ws.onopen = () => {
        console.log('WebSocket connection established');
        storage.dom.preloader.classList.add(storage.sl.cl.uikit.hidden);
    };
    ws.onclose = (event) => {
        if (event.wasClean) {
            console.log('Соединение закрыто чисто');
        } else {
            console.log('Обрыв соединения'); // например, "убит" процесс сервера
        }
        console.log('Код: ' + event.code + ' причина: ' + event.reason);
        console.log(event);
        storage.errors(storage.ms.lostConnection);
    };
    ws.onmessage = (event) => {
        const jsonData = JSON.parse(event.data);
        console.log(jsonData);
        const { psychics = [], guesses = [], state = '' } = jsonData;
        putOnPage(psychics, 'psychics');
        putOnPage(guesses, 'guesses');
        storage.state[state] && storage.state[state]();
    };
    storage.dom.startButton.addEventListener('click', () => {
        ws.send(storage.ms.toGuess);
        // ws.send('storage.ms.toGuess');
    });
    storage.dom.form.addEventListener('submit', (event) => {
        event.preventDefault();
        ws.send(storage.ms.toAnswer(form.elements.number.value));
        // ws.send(JSON.stringify({ step: 'toAnswer', answer: 1 }));
    });
});

windowsLoad()
    .then(findDomElems)
    .then(webSockerConnect)
    .catch(err => {
        console.log(err);
    });