import StateMachine from 'javascript-state-machine';
import ms from '../app/message'; // сообщения
import psychics from '../app/psychics'; // экстрасенсы

const clientsMap = new Map();

var FSM = StateMachine.factory({
    init: 'connect',
    transitions: [
        { name: 'toBegin', from: 'connect', to: 'begin' },
        { name: 'toGuess', from: 'begin', to: 'guess' },
        { name: 'toAnswer', from: 'guess', to: 'begin' },
    ],
    data: (wss, client) => {
        return { wss: wss, client: client }
    },
    methods: {
        onConnect: function () {
            clientsMap.set(client, []);
            this.wss.sendJson(this.client, {
                psychics: psychics.valueOf(),
            });
        },
        onBegin: function () {
            this.wss.sendJson(this.client, {
                state: this.state,
            });
        },
        onGuess: function () {
            // guesses = psychics.guesses();
            // wss.sendJson({
            //     'guesses': guesses,
            //     state: this.state,
            // });
        },
        onInvalidTransition: function (transition, from, to) {
            this.wss.sendJson(
                this.client,
                ms.er.onInvalidTransition(transition, from, to)
            );
        },
    }
});

export default FSM;
