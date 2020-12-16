class Game {
    gameID;
    players = [];
}

class Player {
    playerID;
    name;

    field;
}

class Field {
    rows = []; // Square[][] -- rows[iRow][jColumn]

    isDestroyed() {}
}

class Square {
    #isRevealed;
    #isMine;
    #isFlagged;

    constructor(difficultyLevel) {
        this.#isRevealed = false;
        this.#isMine = this.#shouldBeAMine(difficultyLevel);
        this.#isFlagged = false;
    }

    /** @param difficultyLevel Number 0-1 that represents the chance of a square becoming a mine. */
    #shouldBeAMine(difficultyLevel) {
        let result = false;
        const r = Math.random();
    }

}

export default Game;
export {
    Game, Player, Field, Square
};