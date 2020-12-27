import { Record, List, Map } from "immutable";
import { createNewField } from './field.js'

const Game = Record({
    gameID: null,
    players: List(),
    
    rowCount: 12,
    columnCount: 18,

    /** A game is finished when all fields are finished or when every player has hit a mine. */
    isFinished: false,

    /** Number 0-1 that determines, at game creation, what percentage of squares are mines.
     * @type number */
    difficultyLevel: 0.3,

    /** An object keyed by player IDs mapping to their fields. */
    fields: Map()
}, 'Game');

export default Game;

export function createGame() {
    const g = Game()
    return g.set('gameID', defaultGameIDGenerator());
}

function defaultGameIDGenerator() {
    let r = Math.random();
    const min = 10;
    const max = 1000;

    let inRange = r * (max - min) + min;
    let asInteger = Math.floor(inRange);
    return asInteger.toString();
}

/** Adds a player and creates a field for them. Returns a new game. */
export function addPlayerAndCreateField(game, player) {
    const indexOfExistingPlayer = game.players.findIndex(p => p.playerID == player.playerID);
    const isPlayerAlreadyFound = indexOfExistingPlayer >= 0;
    if (isPlayerAlreadyFound) {
        const foundPlayer = game.players.get(indexOfExistingPlayer);
        throw new Error('Player already exists with that player ID:' + foundPlayer.toString());
    }
    
    const atEnd = game.players.count();
    let result = game.setIn(['players', atEnd], player);

    const field = createNewField(result.rowCount, result.columnCount, result.difficultyLevel);
    result = result.setIn(['fields', player.playerID], field);
    return result;
}
