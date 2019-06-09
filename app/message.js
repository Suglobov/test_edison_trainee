export default {
    er: { // errors
        wrongFormat: { error: 'Не верный формат. Ожидается json.' },
        onInvalidTransition: (transition, from, to) => ({ error: `${transition} not allowed from:${from} to:${to} state` }),
        wrongNumber: { error: 'число должно быть 2х значное' },
    }
};