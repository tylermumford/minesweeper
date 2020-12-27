import { Record } from "immutable";

const Field = Record({
    rowCount: 0,
    columnCount: 0,

    /** A field is finished when all unmined squares are opened, or when a mine is hit */
    isFinished: false,

    /** @type SquareStructure[][] */
    squares: null
}, 'Field')

export default Field;

export function createNewField(rowCount, columnCount, difficultyLevel) {
    return Field()
}
