import * as funcs from './field.js';
import { Record } from 'immutable';

test('should create a field', () => {
    const f = funcs.createNewField();
    expect(f).toBeDefined();
    expect(Record.isRecord(f)).toBe(true);
    expect(f.squares).toBeTruthy();
})

describe('field creation', () => {
    let f;
    
    test('should have 0 rows and 0 columns by default', () => {
        f = funcs.createNewField();

        expect(f.rowCount).toBe(0);
        expect(f.columnCount).toBe(0);
    })

    test('should support setting row count at creation', () => {
        f = funcs.createNewField(10);

        expect(f.rowCount).toBe(10);
        expect(f.squares.count()).toBe(10);
    })
    
    test('should support setting column count at creation', () => {
        f = funcs.createNewField(1, 25);
        
        expect(f.columnCount).toBe(25);
        expect(f.squares.get(0).count()).toBe(25);
    })

    test('should create Square records', () => {
        f = funcs.createNewField(4, 4);

        const singleSquare = f.getIn(['squares', 1, 1]);
        expect(singleSquare).toBeDefined();
        expect(Record.isRecord(singleSquare)).toBe(true);
    })
})
