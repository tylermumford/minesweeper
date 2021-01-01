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

export function performClick(game, player, coordinates) {
    if (game.players.includes(player) === false) {
        throw new Error('That player is not in that game.');
    }

    const [row, col] = coordinates;
    const accessPath = ['fields', player.playerID, 'squares', row, col];
    const isInvalidCoordinates = undefined === game.getIn(accessPath);

    if (isInvalidCoordinates) {
        throw new Error('Those coordinates are not in range.');
    }

    let result = game.setIn([...accessPath, 'isOpened'], true);

    const isAllOpened = result.fields.every(field => field.getIn(['squares', row, col, 'isOpened']));
    if (isAllOpened) {
        result = result.set('fields', result.fields.map(field => {
            return field.setIn(['squares', row, col, 'isRevealed'], true)
        }));
    }
    
    return result;
}
