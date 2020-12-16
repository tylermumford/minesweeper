import {Game, Player, Field, Square} from './game-class.js';

test('can make a Game', () => {
    const g = new Game();

    expect(g).toBeDefined();
})