import { Record } from "immutable";

const Game = Record({
    gameID: null,
    players: [],
    
    rowCount: 12,
    columnCount: 18,

    /** A game is finished when all fields are finished or when every player has hit a mine. */
    isFinished: false,

    /** Number 0-1 that determines, at game creation, what percentage of squares are mines.
     * @type number */
    difficultyLevel: 0.3,

    /** An object, keyed by player IDs mapping to their fields.
     * @type Object.<string, FieldStructure> */
    fields: {}
});

export default Game;

export function createGame() {
    const g = Game()
    return g.set('gameID', defaultGameIDGenerator());
}

function defaultGameIDGenerator() {
    let r = Math.random();
    const min = 10;
    const max = 1000;

    let inRange = r * (max - min) + min;
    let asInteger = Math.floor(inRange);
    return asInteger.toString();
}
