export default class Field {
    rowCount
    columnCount

    /** A field is finished when all unmined squares are opened, or when a mine is hit */
    isFinished

    /** @type SquareStructure[][] */
    squares
}
