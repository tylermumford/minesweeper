/**
 * Game Options:
 * - gameIDGenerator: A function that should return the game ID to use.
 * - rowCount: The number of rows in each player's field. Default 12.
 * - columnCount: The number of columns in each player's field. Default 18.
 */
class Game {
    get gameID() {return this.#gameID}
    get players() {return this.#players}

    constructor(options = {}) {
        if (options.gameIDGenerator)
            this.#gameID = options.gameIDGenerator();
        else
            this.#gameID = defaultGameIDGenerator();

        if (options.rowCount) this.#rowCount = options.rowCount
        if (options.columnCount) this.#columnCount = options.columnCount
    }

    toJSON() {
        const packagedState = {
            gameID: this.#gameID,
            rowCount: this.#rowCount,
            columnCount: this.#columnCount,
            players: this.#players,
        };
        return packagedState;
    }

    addPlayer(player) {
        this.#players.push(player);
    }

    #gameID;
    #rowCount = 12;
    #columnCount = 18;
    #players = [];

    /*
    Remember the Open-Closed Principle.

    Features needed:
    X generate game ID
    X choose size and mine count for fields
    X serialize the game
    . respond to actions (clicks, flags, add players)
    */
}

function defaultGameIDGenerator() {
    let r = Math.random();
    const min = 10;
    const max = 1000;

    let inRange = r * (max - min) + min;
    let asInteger = Math.floor(inRange);
    return asInteger.toString();
}

export default Game;
