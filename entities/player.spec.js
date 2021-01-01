import { createNewPlayer } from "./player.js";

test('should be created', () => {
    const p = createNewPlayer();

    expect(p).toBeDefined();
})

test('should be created with a name', () => {
    const p = createNewPlayer('Quill');

    expect(p.name).toBe('Quill');
})

test('should be created with an ID', () => {
    const p = createNewPlayer();

    expect(p.playerID).toBeDefined();
    expect(p.playerID).not.toBe(null);
    expect(p.playerID.length).toBeGreaterThan(10);
})
