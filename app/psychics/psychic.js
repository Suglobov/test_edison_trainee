export class Psychic {
    constructor({ name = '', rating = 0, guess = Psychic.guessesFunc, photoPath = '' }) {
        this.id = Psychic.id();
        this.name = name;
        this.rating = rating;
        this.guess = guess;
        this.photoPath = photoPath;
    }

    static id() {
        if (!this.latestId) this.latestId = 1;
        else this.latestId += 1;
        return this.latestId;
    }

    static guessesFunc() {
        return Psychic.randomInteger(10, 99);
    }

    static randomInteger(min, max) {
        var rand = min + Math.random() * (max - min + 1);
        rand = Math.floor(rand);
        return rand;
    }

    ratingIncrement() {
        this.rating += 1;
    }

    ratingDecrease() {
        this.rating -= 1;
        if (this.rating < 0) {
            this.rating = 0;
        }
    }

    valueOf() {
        return {
            name: this.name,
            rating: this.rating,
            photoPath: this.photoPath,
        };
    }
}

let clentsMap = new Map();

export class Psychics {
    constructor(arrProp) {
        this.psychics = arrProp.map(el => new Psychic(el));
    }

    valueOf() {
        return this.psychics.map(el => el.valueOf());
    }

    guesses(client) {
        const guesses = this.psychics.map(el => el.guess());
        clentsMap.set(client, guesses);
        return guesses;
    }

    recalcRating(client, answer) {
        const guesses = clentsMap.get(client);
        const winIndex = guesses.indexOf(Number(answer));
        this.psychics.forEach((ps, index) => {
            if (winIndex === index) {
                ps.ratingIncrement();
            } else {
                ps.ratingDecrease();
            }
        });
    }

    deleteClientMap(client) {
        clentsMap.delete(client);
    }
}

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