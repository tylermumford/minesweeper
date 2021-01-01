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

    let initialSquares = List(Range(0, rowCount || 0))
        .map(row => List(Range(0, columnCount || 0))
            .map(column => Square({
                coordinates: List.of(row, column),
                isMine: roller.get()
            }))
        );

    let squares = setNumberSurrounding(initialSquares);
    return Field({ rowCount, columnCount })
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

function setNumberSurrounding(squares) {
    const relativeCoordinates = List.of(
        [-1, 0],
        [-1, 1],
        [0, 1],
        [1, 1],
        [1, 0],
        [1, -1],
        [0, -1],
        [-1, -1]
    );

    const calculateSurrounding = s => {
        const surroundingSquares = relativeCoordinates.map(relative => {
            const [initialRow, initialCol] = s.coordinates;
            let lookupRow = initialRow + relative[0];
            let lookupCol = initialCol + relative[1];
            if (lookupRow < 0) lookupRow = undefined;
            if (lookupCol < 0) lookupCol = undefined;
            // Immutable.List.get supports negative indexes, which we don't want, so we set undefined instead.
            return squares.getIn([lookupRow, lookupCol], { isMine: false });
        });
        return surroundingSquares.count(s => s.isMine);
    }

    return squares.withMutations(squares =>
        squares.map(rows => rows.map(s =>
            s.set('numberOfMinesSurrounding', calculateSurrounding(s))
        ))
    );
}
