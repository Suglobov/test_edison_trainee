export default class Psychic {
    constructor(name = '', ratingInit = 0, guess = Psychic.guessesFunc) {
        this.id = Psychic.id();
        this.name = name;
        this.ratingCurent = ratingInit;
        this.guess = guess;
    }

    get rating() {
        return this.ratingCurent;
    }

    set rating(newRating) {
        this.ratingCurent = (newRating < 0) ? 0 : newRating;
    }

    ratingIncrement() {
        this.ratingCurent += 1;
    }

    ratingDecrease() {
        this.ratingCurent -= 1;
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

    valueOf() {
        return {
            'name': this.name,
            'rating': this.rating,
        };
    }
}