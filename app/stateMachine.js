import StateMachine from 'javascript-state-machine';
import ms from './message';

export default (met) => new StateMachine.factory({
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
            // wsJsonSend({
            //     'psychics': psychics.valueOf(),
            //     state: this.state,
            // });
        },
        onGuess: function () {
            // guesses = psychics.guesses();
            // wsJsonSend({
            //     'guesses': guesses,
            //     state: this.state,
            // });
        },
        onInvalidTransition: (transition, from, to) => {
            // wsJsonSend(ms.error.onInvalidTransition(transition, from, to));
        },
    }
});