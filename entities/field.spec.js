import * as funcs from './field.js';
import { Record } from 'immutable';

test('should create a field', () => {
    const f = funcs.createNewField();
    expect(f).toBeDefined();
    expect(Record.isRecord(f)).toBe(true);
})
