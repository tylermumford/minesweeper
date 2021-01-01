import * as funcs from './field.js';
import { List, Record } from 'immutable';

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

    describe('creating the squares of the field', () => {
        const halfMines = funcs.createNewField(10, 10, 0.5);
        const noMines = funcs.createNewField(10, 10, 0);
        const allMines = funcs.createNewField(10, 10, 1);
        
        test('should set coordinates of each square', () => {
            const s = halfMines.squares;
            expect(s.getIn([0, 0]).coordinates).toBeDefined()
            expect(s.getIn([0, 0]).coordinates).toEqual(List.of(0, 0))
            expect(s.getIn([0, 1]).coordinates).toEqual(List.of(0, 1))
            expect(s.getIn([1, 0]).coordinates).toEqual(List.of(1, 0))
            expect(s.getIn([1, 1]).coordinates).toEqual(List.of(1, 1))
        })

        test('should set no sqares to be mines with difficulty 0', () => {
            const hasNoMines = noMines.squares.flatten().every(s => s.isMine === false);
            expect(hasNoMines).toBe(true);
        })

        test('should set all squares to be mines with difficulty 1', () => {
            const hasAllMines = allMines.squares.flatten().every(s => s.isMine === true);
            expect(hasAllMines).toBe(true)
        })

        test('should set half of all squares to be mines with difficulty 0.5', () => {
            const mineCount = halfMines.squares.flatten().count(s => s.isMine === true);
            expect(mineCount).toEqual(50);
        })

        describe('setting numberOfMinesSurrounding', () => {
            test('should include all zeroes', () => {
                const isAllZero = noMines.squares.flatten().every(square => square.numberOfMinesSurrounding === 0);
                expect(isAllZero).toBe(true);
            })
            
            test('should include corners', () => {
                const countAtCorner = allMines.squares.getIn([0, 0]).numberOfMinesSurrounding;
                expect(countAtCorner).toBe(3);
            })
            
            test('should include edges', () => {
                const countAtEdge = allMines.squares.getIn([0, 2]).numberOfMinesSurrounding;
                expect(countAtEdge).toBe(5);
            })
            
            test('should include the middle', () => {
                const countInTheMiddle = allMines.squares.getIn([2, 2]).numberOfMinesSurrounding;
                expect(countInTheMiddle).toBe(8);
            })
        })
    })
})
