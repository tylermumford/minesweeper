import * as gameFuncs from './game.js';
import * as playerFuncs from './player.js';
import { List } from "immutable";

describe('game clicking', () => {
    let g;
    let p1;
    let p2;
    let resultGame;
    const validCoordinates = List.of(2, 5);

    // Helper functions
    const clickFor = player => gameFuncs.performClick(g, player, validCoordinates);
    const getSquareOf = player => resultGame.getIn(['fields', player.playerID, 'squares', 2, 5]);

    beforeEach(() => {
        g = gameFuncs.createGame();
        p1 = playerFuncs.createNewPlayer('P1');
        p2 = playerFuncs.createNewPlayer('P2');
        g = gameFuncs.addPlayerAndCreateField(g, p1);
        g = gameFuncs.addPlayerAndCreateField(g, p2);
    })

    test('should have a function', () => {
        expect(gameFuncs.performClick).toBeDefined()
    })

    test('should throw an error if the player is not in the game', () => {
        const unknown = playerFuncs.createNewPlayer();

        expect(() => gameFuncs.performClick(g, unknown, validCoordinates)).toThrow();
    })

    test('should throw an error if the coordinates are invalid', () => {
        const badCoordinates = List.of(1000, 256);

        expect(() => gameFuncs.performClick(g, p1, badCoordinates)).toThrow();
    })

    test('should not throw an error for coordinates in range', () => {
        expect(() => gameFuncs.performClick(g, p1, validCoordinates)).not.toThrow();
    })

    test('should return a game', () => {
        resultGame = clickFor(p1)

        expect(resultGame).toBeDefined();
        expect(resultGame.gameID).toBe(g.gameID);
    })

    test('should throw an error if the game is null', () => {
        g = null;

        expect(() => clickFor(p1)).toThrow();
    })

    test('should open a square for one player', () => {
        resultGame = clickFor(p1);

        expect(getSquareOf(p1).isOpened).toBe(true);
        expect(getSquareOf(p2).isOpened).toBe(false);
    })

    test('should not reveal a square if only some players have clicked it', () => {
        resultGame = clickFor(p1);

        expect(getSquareOf(p1).isRevealed).toBe(false);
        expect(getSquareOf(p2).isRevealed).toBe(false);
    })

    test('should reveal a square if all players have clicked it', () => {
        resultGame = clickFor(p1);
        resultGame = gameFuncs.performClick(resultGame, p2, validCoordinates);

        expect(getSquareOf(p1).isRevealed).toBe(true);
        expect(getSquareOf(p2).isRevealed).toBe(true);
    })

})
