require('./server/serverHtml');
import WSS from './server/servetWebSocet';
import ms from './message';
import psychics from './psychics/psychic.js'; // экстрасенсы

let wss = WSS((client) => {
        wss.sendJson(client, {
            psychics: psychics.valueOf(),
            state: 'begin',
        });
    },
    (client, message) => {
        console.log(message);
        if (message.step === 'toGuess') {
            let guesses = psychics.guesses(client);
            wss.sendJson(client, {
                guesses: guesses,
                state: 'guess',
            });
        }
        if (message.step === 'toAnswer') {
            psychics.recalcRating(client, message.answer);
            wss.broadcastJson({
                psychics: psychics.valueOf(),
            });
            wss.sendJson(client, {
                state: 'begin',
            });
        }
    },
    (client, err) => {
        wss.sendJson(client, {
            error: ms.er.wrongFormat,
            err: err,
        });
    },
    (client) => {
        psychics.deleteClientMap(client);
    });
// webSocketServer.on('connection', (client) => {
//     // console.dir(client);
//     client.on('message', (message) => {
//         let msg = {};
//         try {
//             msg = JSON.parse(message);
//         } catch (e) {
//             wsJsonSend(ms.er.wrongFormat);
//             return;
//         }
//     })
// });
// console.log(WebSocketServer);