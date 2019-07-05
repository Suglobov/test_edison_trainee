import {Psychic, Psychics} from './psychic';

const psychics = new Psychics([
    { name: 'Ы', rating: 1, photoPath: 'images/Ы.jpg' },
    { name: '2', rating: 2, photoPath: 'images/2.jpg' },
    {
        name: 'Синий', rating: 3, photoPath: 'images/123.jpg', guess: () => {
            const arr = [10, 22, 33, 33, 50, 78];
            const rand = Psychic.randomInteger(0, arr.length - 1);
            return arr[rand];
        }
    },
]);

export default psychics;