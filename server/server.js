const express = require('express');
const WebSocket = require('ws');
const path = require('path');
const config = require('config');
const StateMachine = require('javascript-state-machine');


const port = config.get('server.port');
const portWs = config.get('server.portWs');


import Psychic from './psychic.js'; // экстрасенсы
const psychics = [
    new Psychic('Ы', 10),
    new Psychic('2', 11),
    new Psychic('Синий', 12, () => {
        const arr = [10, 22, 33, 33, 50, 78];
        const rand = Psychic.randomInteger(0, arr.length - 1);
        return arr[rand];
    }),
];

// console.log(psychics[0].toString());
// console.log(psychics[0].valueOf());
// psychics[0].rating = 1;
// console.log(psychics[0].rating);
// console.log(psychics[1].id);
// psychics[0].ratingIncrement();
// console.log(psychics[0].rating);
// psychics[0].ratingDecrease();
// console.log(psychics[0].rating);
// console.log(psychics[1].rating);

const ms = { // сообщения
    error: {
        wrongFormat: JSON.stringify({ error: 'не верный формат. json ожидается' }),
        onInvalidTransition: (transition, from, to) =>
            JSON.stringify({ error: `${transition} not allowed ${from} ${to} state` }),
        wrongNumber: JSON.stringify({ error: 'число должно быть 2х значное' }),
    },
};

// openning a websocket server
const wss = new WebSocket.Server({ port: portWs });
const broadcast = (data) => {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};
wss.on('connection', (ws) => {
    // console.log(ws);
    let guesses = [];
    const fsm = new StateMachine({
        /*
        beginning - отправляем рейтинг, ждем запроса догадок
        guess - догадки отправлены, ждем правильный ответ
        answer - получили ответ, возвращаем все в начало
        */
        init: 'begin',
        transitions: [
            { name: 'toGuess', from: 'begin', to: 'guess' },
            { name: 'toBegin', from: 'guess', to: 'begin' },
        ],
        methods: {
            onBegin: function () {
                ws.send(JSON.stringify({
                    'psychics': psychics.map(el => el.valueOf()),
                    state: this.state,
                }));
            },
            onGuess: function () {
                guesses = psychics.map(el => el.guess());
                ws.send(JSON.stringify({
                    'guesses': guesses,
                    state: this.state,
                }));
            },
            onInvalidTransition: (transition, from, to) => {
                ws.send(ms.error.onInvalidTransition(transition, from, to));
            },
        }
    });

    ws.on('message', (message) => {
        let msg = {};
        try {
            msg = JSON.parse(message);
        } catch (e) {
            ws.send(ms.error.wrongFormat);
            return;
        }

        if (msg.step === 'toGuess') {
            fsm.toGuess();
        }
        if (msg.answer !== undefined) {
            if (msg.answer >= 10 && msg.answer < 100) {
                const nb = Number(msg.answer);
                const winIndex = guesses.indexOf(Number(msg.answer));
                psychics.forEach((gu, index) => {
                    if (winIndex === index) {
                        gu.ratingIncrement();
                    } else {
                        gu.ratingDecrease();
                    }
                });
                broadcast({ 'psychics': psychics.map(el => el.valueOf()) });
                fsm.toBegin();
                console.log(winIndex);
            } else {
                ws.send(ms.error.wrongNumber);
            }
        }
        // console.log(message, wss.clients);


        // wss.clients.forEach((client) => {
        //     client.send(message);
        // })
    })
});

const app = express();
app.listen(port, function () {
    console.log(`Server was started on '${port}'`);
});

app.set('view engine', 'pug');
app.set('views', path.resolve(__dirname, '../views'));
app.use(express.static(path.resolve(__dirname, '../assets')));

app.get('/', function (req, res) {
    // console.log(new Psychic('name', 0));
    res.render('index');
});


// const config = require('config');
// const express = require('express');
// let app = express();
// let expressWs = require('express-ws')(app);
//
// app.set('view engine', 'pug');
//
// app.ws('/', (ws, req, next) => {
//     ws.on('message', function (msg) {
//         console.log('msg:', msg)
//     })
// });
// const port = config.get('port');
// app.listen(port, () => {
//     console.log(`Server was started on '${port}'`);
// });
// const Express = require('express');
// const expressWs = require('express-ws');
//
// const app = new Express();
// expressWs(app);
// app.set('view engine', 'pug');
//
// // app.get('/', function (req, res) {
// //     res.render('index', {})
// // });
//
// app.ws('/', function(ws, req, next) {
//     ws.on('message', function(msg) {
//         console.log('msg:', msg)
//     })
// });
//
// app().listen(config.get('port'), () => {
//     // eslint-disable-next-line
//     console.log(`Server was started on '${port}'`);
// });
//
// // export default app;