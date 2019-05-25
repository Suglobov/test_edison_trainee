export class Psychic {
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

    constructor({ name = '', rating = 0, guess = Psychic.guessesFunc }) {
        this.id = Psychic.id();
        this.name = name;
        this.rating = rating;
        this.guess = guess;
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
            'name': this.name,
            'rating': this.rating,
        };
    }
}

export class Psychics {
    constructor(arrProp) {
        this.psychics = arrProp.map(el => new Psychic(el));
    }

    valueOf() {
        return this.psychics.map(el => el.valueOf());
    }

    guesses(isJson = false) {
        const guesses = this.psychics.map(el => el.guess());
        if (isJson) {
            return JSON.stringify(guesses);
        } else {
            return guesses;
        }
    }

    recalcRating(answer, guesses) {
        const winIndex = guesses.indexOf(Number(answer));
        this.psychics.forEach((ps, index) => {
            if (winIndex === index) {
                ps.ratingIncrement();
            } else {
                ps.ratingDecrease();
            }
        });
    }
}