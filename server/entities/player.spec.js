import Player from "./player.js";

describe('Player class', () => {
    let p;

    beforeEach(() => {
        p = new Player()
    })

    test('should be created', () => {
        expect(p).toBeDefined();
    })

    test('should be named Anonymous', () => {
        expect(p.name).toBe('Anonymous');
    })

    test('should accept a name on construction', () => {
        p = new Player('Steve');

        expect(p.name).toBe('Steve');
    })

    test('should serialize to JSON', () => {
        const str = JSON.stringify(p);

        expect(str).toContain('name');
        expect(str).toContain('Anonymous');
        expect(str).toMatchSnapshot();
    })
})
