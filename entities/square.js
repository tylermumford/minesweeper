export default class Square {
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
