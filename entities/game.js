export default class Game {
    gameID
    players

    rowCount
    columnCount

    /** A game is finished when all fields are finished or when every player has hit a mine. */
    isFinished

    /** Number 0-1 that determines, at game creation, what percentage of squares are mines.
     * @type number */
    difficultyLevel

    /** An object, keyed by player IDs mapping to their fields.
     * @type Object.<string, FieldStructure> */
    fields
}

export function createGame() {
    const g = new Game
    g.gameID = defaultGameIDGenerator()
    g.players = []
    g.rowCount = 12
    g.columnCount = 18
    g.isFinished = false
    g.difficultyLevel = 0.3
    g.fields = {}
    
    return g
}

function defaultGameIDGenerator() {
    let r = Math.random();
    const min = 10;
    const max = 1000;

    let inRange = r * (max - min) + min;
    let asInteger = Math.floor(inRange);
    return asInteger.toString();
}
