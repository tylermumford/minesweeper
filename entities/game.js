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
