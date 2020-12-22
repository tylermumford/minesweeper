class GameStructure {
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

class FieldStructure {
    rowCount
    columnCount

    /** A field is finished when all unmined squares are opened, or when a mine is hit */
    isFinished

    /** @type SquareStructure[][] */
    squares
}

class SquareStructure {
    // Determined by player's own field

    /** [rowNumber, columnNumber] 
     * @type number[] */
    coordinates
    isMine
    isFlagged
    isOpened
    numberOfMinesSurrounding

    // Determined by other players' fields

    isRevealed
}

class PlayerStructure {
    playerID
    name

    hasHitAMine
}
