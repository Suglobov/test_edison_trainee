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
        console.log(er);
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
                `    <div class="uk-card-media-top">`,
                `        <img src="${data.photoPath}" ${data.photoPath ? '' : storage.sl.cl.uikit.hidden}>`,
                `    </div>`,
                `    <div class="uk-card-body">`,
                `        <h3 class="uk-card-title">${data.name}</h3>`,
                `        <p>Рейтинг: ${data.rating}</p>`,
                `    </div>`,
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
        toAnswer: (number) => JSON.stringify({ step: 'toAnswer', answer: number }),
        lostConnection: 'потеряно соединение, перезагрузите страницу',
    }
};

export default storage;