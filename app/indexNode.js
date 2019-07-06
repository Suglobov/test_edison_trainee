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
            if (message.step === 'toGuess') { // клиент хочет получить догадки
                let guesses = psychics.guesses(client);
                wss.sendJson(client, {
                    guesses: guesses,
                    state: 'guess',
                });
            }
            if (message.step === 'toAnswer') { // прислали правильный ответ (загаданное число)
                const answer = +message.answer;
                console.log(message);
                if (!(answer >= 10 && answer <= 99)) {
                    wss.sendJson(client, {
                        error: ms.er.wrongNumber,
                        er: ms.er.wrongNumber,
                    });
                    return;
                }
                psychics.recalcRating(client, message.answer);
                wss.broadcastJson({
                    psychics: psychics.valueOf(),
                });
                wss.sendJson(client, {
                    state: 'begin',
                });
            }
        },
        () => { // очищаем переменные при закрытии соединения
            psychics.deleteClientMap(client);
        },
        (er) => { // если формат сообщения не json
            wss.sendJson(client, {
                error: ms.er.wrongFormat,
                er,
            });
        },
    );
});
