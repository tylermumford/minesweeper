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

export function createNewField(rowCount = 0, columnCount = 0, difficultyLevel = 0.3) {
    const roller = new DiceRoller(rowCount, columnCount, difficultyLevel);
    
    const squares = List(Range(0, rowCount || 0))
        .map(row => List(Range(0, columnCount || 0))
            .map(column => Square({
                coordinates: List.of(row, column),
                isMine: roller.get()
            }))
        )
    return Field({rowCount, columnCount})
        .set('squares', squares);
}

/** Since successive calls to Math.random don't guarantee the right number of mines, this makes sure it happens correctly. */
class DiceRoller {
    _sequenceLength
    _numberOfTrueValuesToCreate
    _numberOfTrueValuesCreated = 0
    _sequence = []

    _indexes = []
    
    constructor(rowCount, columnCount, difficultyLevel) {
        this._sequenceLength = rowCount * columnCount;
        this._numberOfTrueValuesToCreate = Math.floor(this._sequenceLength * difficultyLevel);

        this._createFalseValues();
        this._shuffleIndexes();
        this._createSequence();
    }

    get() {
        return this._sequence.pop();
    }

    _createFalseValues() {
        this._sequence = new Array(this._sequenceLength).fill(false);
    }

    _shuffleIndexes() {
        this._indexes = this._sequence.map((_, index) => index);
        this._indexes.sort(() => Math.random() - 0.5);
    }

    _createSequence() {
        while (this._numberOfTrueValuesCreated < this._numberOfTrueValuesToCreate) {
            this._setRandomValueToTrue();
            this._numberOfTrueValuesCreated += 1;
        }
    }

    _setRandomValueToTrue() {
        const i = this._indexes.pop();
        this._sequence[i] = true;
    }
}
