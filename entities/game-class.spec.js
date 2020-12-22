import Game from './game-class.js';
import Player from './player.js';

describe('Game class', () => {
    let g;

    beforeEach(() => {
        g = new Game();
    })

    test('should be created', () => {
        expect(g).toBeDefined();
    })

    test('should have a gameID property', () => {
        expect(g.gameID).toBeDefined();
    })

    test('should have a players array property', () => {
        expect(g.players.length).toBeDefined();
    })

    test('should use a provided ID generator', () => {
        g = new Game({gameIDGenerator: () => '9000'});

        expect(g.gameID).toEqual('9000');
    })
    
    test('should have a default ID generator', () => {
        expect(g.gameID).toBeTruthy();
    })

    test('should add a player', () => {
        const p = new Player;
        g.addPlayer(p);

        expect(g.players[0]).toBe(p);
    })

    test('should export provided row and column counts', () => {
        const options = {
            rowCount: 196,
            columnCount: 123
        };

        g = new Game(options);
        
        const state = JSON.stringify(g);
        
        expect(state).toContain('196');
        expect(state).toContain('123');
    })

    describe('state exporting', () => {
        test('should export the initial game state', () => {
            g = new Game({gameIDGenerator: () => '4567'})

            const state = JSON.stringify(g);

            expect(state).toMatchSnapshot();
        })

        test('should export player names', () => {
            const p = new Player('Pearl');
            g.addPlayer(p);

            const state = JSON.stringify(g);

            expect(state).toContain('Pearl');
        })
    })
})
