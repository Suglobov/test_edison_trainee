const sl = { // селекторы
    dom: { // элементы, которые надо найти на странице
        errors: '.errors',
        psychics: '.psychics',
        guesses: '.guesses',
        // test: '.test',
    },
    cl: { // классы
        uikit: {
            hidden: 'uk-hidden',
        },
    }
};
const state = { // сюда сохранятся всякие объекты
    dom: {}, // элементы, которые надо найти на странице
    errors: new Proxy([], {
        set(target, property, value) {
            if (property === 'length') return true;
            target[property] = value;
            if (state.dom.errors) {
                state.dom.errors.classList.remove(sl.cl.uikit.hidden);
                const err = document.createElement('div');
                err.textContent = value;
                state.dom.errors.appendChild(err);
            }
            console.error(value);
            return true;
        }
    }),
};

const windowsLoad = () => new Promise((resolve) => // ждем загрузки страницы
    window.addEventListener('load', () => resolve('load')));
const findDomElems = () => new Promise((resolve, reject) => { // находим нужные элементы на странице
    Object.keys(sl.dom).forEach(el => {
        state.dom[el] = document.querySelector(sl.dom[el]);
        if (!state.dom[el]) reject(`'${sl.dom[el]}' в dom не найден`);
    });
    resolve();
});

const webSockerConnect = () => new Promise((resolve, reject) => {
    const ws = new WebSocket('ws://localhost:81');
    ws.onerror = (error) => {
        state.errors.push('ошибка WebSocket, сообщение в консоли');
        throw error;
    };
    ws.onopen = function () {
        console.log('WebSocket connection established');
    };
    ws.onmessage = function (event) {
        console.log(event);
        const li = document.createElement('li');
        li.textContent = event.data;
        const ul = document.getElementById('message-container');
        ul.appendChild(li);
    };
    // const form = document.getElementById('chat');
    // console.log(form);
    // form.addEventListener('submit', function (event) {
    //     const textInput = document.getElementById('chat-message');
    //     const chatText = textInput.value;
    //     textInput.value = '';
    //     console.log(chatText);
    //     ws.send(chatText);
    //     event.preventDefault();
    // });
});

windowsLoad()
    .then(findDomElems)
    .catch(err => {
        state.errors.push(err);
    });