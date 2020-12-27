import { createNewPlayer } from "./player.js";

test('should be created', () => {
    const p = createNewPlayer();

    expect(p).toBeDefined();
})

test('should be created with a name', () => {
    const p = createNewPlayer('Quill');

    expect(p.name).toBe('Quill');
})
