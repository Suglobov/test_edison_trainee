require('./server/serverHtml');
import { wss, onConnect, listenClient } from './server/servetWebSocet';
import ms from './message'; // сообщения
import psychics from './psychics/index.js'; // экстрасенсы

onConnect((client) => {
    wss.sendJson(client, {
        psychics: psychics.valueOf(),
        state: 'begin',
    });
    listenClient(client,
        (message) => {
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
        () => {
            psychics.deleteClientMap(client);
        },
        (er) => {
            wss.sendJson(client, {
                error: ms.er.wrongFormat,
                er,
            });
        },
    );
});
