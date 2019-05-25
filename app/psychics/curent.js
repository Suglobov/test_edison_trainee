import { Psychic, Psychics } from './psychic.js'; // экстрасенсы

const psychics = new Psychics([
    { name: 'Ы', rating: 1 },
    { name: '2', rating: 2 },
    {
        name: 'Синий', rating: 3, guess: () => {
            const arr = [10, 22, 33, 33, 50, 78];
            const rand = Psychic.randomInteger(0, arr.length - 1);
            return arr[rand];
        }
    },
]);

export default psychics;