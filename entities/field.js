import { Record, List, Range } from "immutable";
import Square from './square.js';

const Field = Record({
    rowCount: 0,
    columnCount: 0,

    /** A field is finished when all unmined squares are opened, or when a mine is hit */
    isFinished: false,

    /** @type SquareStructure[][] */
    squares: List()
}, 'Field')

export default Field;

export function createNewField(rowCount, columnCount, difficultyLevel) {
    const squares = List(Range(0, rowCount || 0))
        .map(row => List(Range(0, columnCount || 0))
            .map(column => Square())
        )
    return Field({rowCount, columnCount})
        .set('squares', squares);
}
