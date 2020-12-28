import { List, Record } from "immutable";

const Square = Record({
    // Determined by player's own field

    coordinates: List(null, null),
    isMine: false,
    isFlagged: false,
    isOpened: false,
    numberOfMinesSurrounding: 0,

    // Determined by other players' fields

    isRevealed: false

}, 'Square')

export default Square;
