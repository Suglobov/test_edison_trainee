const storage = { // сюда сохранятся всякие объекты
    sl: { // селекторы
        dom: { // элементы, которые надо найти на странице
            errors: '.errors',
            psychicsContainer: '.psychicsContainer',
            guessesContainer: '.guessesContainer',
            preloader: '.preloader',
            startButton: '.start',
            form: '#form',
            // test: '.test',
        },
        cl: { // классы
            uikit: {
                hidden: 'uk-hidden',
            },
            psychic: 'psychic',
            guess: 'guess',
        }
    },
    dom: {}, // элементы, которые надо найти на странице
    errors: (er) => {
        if (!storage.dom.errors) return;
        const erElem = document.createElement('div');
        storage.dom.errors.appendChild(erElem);
    },
    // чет внятной обработки ошибок не придумал.
    // errors: new Proxy([], {
    //     set(target, property, value) {
    //         if (property === 'length') return true;
    //         target[property] = value;
    //         if (storage.dom.errors) {
    //             storage.dom.errors.textContent = '';
    //             storage.dom.errors.classList.add(storage.sl.cl.uikit.hidden);
    //             storage.errors.forEach(er => {
    //                 storage.dom.errors.classList.remove(storage.sl.cl.uikit.hidden);
    //                 const err = document.createElement('div');
    //                 err.textContent = er;
    //                 storage.dom.errors.appendChild(err);
    //             });
    //         }
    //         // console.error(value);
    //         return true;
    //     },
    //     deleteProperty(target, prop) {
    //         if (prop in target) {
    //             delete target[prop];
    //             console.log(`property removed: ${prop}`);
    //             // expected output: "property removed: texture"
    //         }
    //     }
    // }),
    templates: { // шаблоны
        psychics: (data) => {
            const el = document.createElement('div');
            el.classList.add(storage.sl.cl.psychic);
            el.insertAdjacentHTML('afterBegin', [
                `<div class="uk-card uk-card-default uk-card-body">`,
                `<h3 class="uk-card-title">${data.name}</h3>`,
                `<p>Рейтинг: ${data.rating}</p>`,
                `</div>`,
            ].join(''));
            return el;
        },
        guesses: (data) => {
            const el = document.createElement('div');
            el.classList.add(storage.sl.cl.guess);
            el.insertAdjacentHTML('afterBegin', [
                `<div class="uk-card uk-card-default uk-card-body">`,
                `<h3 class="uk-card-title">${data}</h3>`,
                `</div>`,
            ].join(''));
            return el;
        },
    },
    state: { // состояния
        'begin': () => {
            storage.dom.startButton.classList.remove(storage.sl.cl.uikit.hidden);
            storage.dom.form.classList.add(storage.sl.cl.uikit.hidden);
            storage.dom.guessesContainer.classList.add(storage.sl.cl.uikit.hidden);
            storage.dom.form.elements.number.value = '';
        },
        'guess': () => {
            storage.dom.startButton.classList.add(storage.sl.cl.uikit.hidden);
            storage.dom.form.classList.remove(storage.sl.cl.uikit.hidden);
            storage.dom.guessesContainer.classList.remove(storage.sl.cl.uikit.hidden);
        },
    },
    ms: { // сообщения
        toGuess: JSON.stringify({ step: 'toGuess' }),
        toAnswer: (number) => JSON.stringify({ answer: number }),
        lostConnection: 'потеряно соединение, перезагрузите страницу',
    }
};

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
    const ws = new WebSocket('ws://localhost:81');
    ws.onerror = (error) => {
        console.log('WebSocket connection error');
        throw error;
    };
    ws.onopen = () => {
        console.log('WebSocket connection established');
        storage.dom.preloader.classList.add(storage.sl.cl.uikit.hidden);
    };
    ws.onclose = () => {
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
    });
    storage.dom.form.addEventListener('submit', (event) => {
        event.preventDefault();
        ws.send(storage.ms.toAnswer(form.elements.number.value));
        //     const textInput = document.getElementById('chat-message');
        //     const chatText = textInput.value;
        //     textInput.value = '';
        //     console.log(chatText);
        //     ws.send(chatText);
    });
});

windowsLoad()
    .then(findDomElems)
    .then(webSockerConnect)
    .catch(err => {
        console.log(err);
    });