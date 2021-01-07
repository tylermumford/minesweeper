import Game, * as gameFuncs from './game.js';
import * as playerFuncs from './player.js';

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
