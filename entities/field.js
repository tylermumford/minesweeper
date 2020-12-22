class FieldStructure {
    rowCount
    columnCount

    /** A field is finished when all unmined squares are opened, or when a mine is hit */
    isFinished

    /** @type SquareStructure[][] */
    squares
}
