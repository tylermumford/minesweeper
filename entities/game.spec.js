import Game, * as game from './game.js';

test('should export a game structure/class', () => {
    expect(Game).toBeDefined();
})

describe('game creation', () => {
    let g;

    beforeEach(() => {
        g = game.createGame();
    })

    test('should be created', () => {
        expect(g).toBeDefined();
    })

    test('should be created with a game ID', () => {
        expect(g.gameID).toBeDefined();
        expect(g.gameID.length).toBeGreaterThan(0);
    })

    test('should be created with 0 players', () => {
        expect(g.players).toBeDefined();
        expect(g.players.length).toBe(0);
    })
})
