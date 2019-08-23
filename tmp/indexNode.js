require('./server/serverHtml');
import { wss, onConnect, listenClient } from './server/servetWebSocet';
import ms from './message'; // сообщения
import FSM from './stateMachine'; // конечный автомат


onConnect((client) => {
    const stateMachine = new FSM(wss, client);
    stateMachine.toBegin();
    listenClient(client,
        (message) => {
            console.log(message);
            if (message.step === 'toGuess') {
                stateMachine.toGuess();
            //     let guesses = psychics.guesses(client);
            //     wss.sendJson(client, {
            //         guesses: guesses,
            //         state: 'guess',
            //     });
            }
            // if (message.step === 'toAnswer') {
            //     psychics.recalcRating(client, message.answer);
            //     wss.broadcastJson({
            //         psychics: psychics.valueOf(),
            //     });
            //     wss.sendJson(client, {
            //         state: 'begin',
            //     });
            // }
        },
        () => {
            // psychics.deleteClientMap(client);
            // clientsMap.delete(client);
        },
        (er) => {
            wss.sendJson(client, {
                error: ms.er.wrongFormat,
                er,
            });
        },
    );
});
