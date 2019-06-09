const express = require('express');
const WebSocket = require('ws');
const path = require('path');
const config = require('config');
const StateMachine = require('javascript-state-machine');


const port = config.get('server.port');
const portWs = config.get('server.portWs');


import psychics from '../psychics/curent.js'; // экстрасенсы

const ms = { // сообщения
    error: {
        wrongFormat: { error: 'не верный формат. json ожидается' },
        onInvalidTransition: (transition, from, to) =>
            ({ error: `${transition} not allowed ${from} ${to} state` }),
        wrongNumber: { error: 'число должно быть 2х значное' },
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
    const wsJsonSend = (data) => {
        const jsonData = JSON.stringify(data);
        ws.send(jsonData);
    };
    let guesses = [];
    const fsm = new StateMachine({
        /*
        beginning - отправляем рейтинг, ждем запроса догадок
        guess - догадки отправлены, ждем правильный ответ
        */
        init: 'begin',
        transitions: [
            { name: 'toGuess', from: 'begin', to: 'guess' },
            { name: 'toBegin', from: 'guess', to: 'begin' },
        ],
        methods: {
            onBegin: function () {
                wsJsonSend({
                    'psychics': psychics.valueOf(),
                    state: this.state,
                });
            },
            onGuess: function () {
                guesses = psychics.guesses();
                wsJsonSend({
                    'guesses': guesses,
                    state: this.state,
                });
            },
            onInvalidTransition: (transition, from, to) => {
                wsJsonSend(ms.error.onInvalidTransition(transition, from, to));
            },
        }
    });

    ws.on('message', (message) => {
        let msg = {};
        try {
            msg = JSON.parse(message);
        } catch (e) {
            wsJsonSend(ms.error.wrongFormat);
            return;
        }

        if (msg.step === 'toGuess') {
            fsm.toGuess();
        }
        if (msg.answer !== undefined) {
            if (msg.answer >= 10 && msg.answer < 100) {
                psychics.recalcRating(msg.answer, guesses);
                broadcast({ 'psychics': psychics.valueOf() });
                fsm.toBegin();
            } else {
                wsJsonSend(ms.error.wrongNumber);
            }
        }
        // console.log(message, wss.clients);


        // wss.clients.forEach((client) => {
        //     client.send(message);
        // })
    })
});

// const app = express();
// app.listen(port, function () {
//     console.log(`Server was started on '${port}'`);
// });
//
// app.set('view engine', 'pug');
// app.set('views', path.resolve(__dirname, '../views'));
// app.use(express.static(path.resolve(__dirname, '../assets')));
//
// app.get('/', function (req, res) {
//     // console.log(new Psychic('name', 0));
//     res.render('index');
// });
