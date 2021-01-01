import Game, * as gameFuncs from './game.js';
import * as playerFuncs from './player.js';
import { List } from "immutable";

test('should export a game structure/class', () => {
    expect(Game).toBeDefined();
})

describe('game creation', () => {
    let g;

    beforeEach(() => {
        g = gameFuncs.createGame();
    })

    test('should be created', () => {
        expect(g).toBeDefined();
        expect(g.players).toBeDefined();
        expect(g.fields).toBeDefined();
    })

    test('should be created with a game ID', () => {
        expect(g.gameID).toBeDefined();
        expect(g.gameID.length).toBeGreaterThan(0);
    })

    test('should be created with 0 players', () => {
        expect(g.players).toBeDefined();
        expect(g.players.count()).toBe(0);
        // expect(g.players.length).toBe(0); // used to be an array
    })

    test('should be able to add a player', () => {
        const p = playerFuncs.createNewPlayer();
        const updated = gameFuncs.addPlayerAndCreateField(g, p);

        expect(updated.players.count()).toBe(1);
    })

    test('should throw when adding two players with the same ID', () => {
        const p1 = playerFuncs.createNewPlayer('P1').set('playerID', 'conflict');
        const p2 = playerFuncs.createNewPlayer('P2').set('playerID', 'conflict');
        const updatedGame = gameFuncs.addPlayerAndCreateField(g, p1);

        const action = () => {
            gameFuncs.addPlayerAndCreateField(updatedGame, p2);
        }

        expect(action).toThrowError('already exists');
    })

    test('should add a field for a new player', () => {
        const p = playerFuncs.createNewPlayer();
        const updated = gameFuncs.addPlayerAndCreateField(g, p);

        expect(updated.fields.get(p.playerID)).toBeDefined();
    })
})

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
