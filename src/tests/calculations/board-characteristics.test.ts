import { describe, expect, test } from 'vitest';
import { decideIslandAttributes } from '../../calculations/board-characteristics';

describe('decideIslandAttributes function', () => {
    test('accepts a number and returns a map of type islandAttributes arrays with number keys in number equal to the number entered', () => {
        const newMap = decideIslandAttributes(4);
        expect(newMap).toBeInstanceOf(Map);
        expect(newMap.size).toBe(4);
        newMap.forEach((val, key) => {
            expect(typeof key).toBe('number');
            expect(val).toBeInstanceOf(Array);
            expect(val.length).toBe(6);
            const [margin, padding, backgroundColor, radiusPercents, borderWidth, randomTreasureChoices] = val;
            expect(margin).toBeLessThan(30);
            expect(padding).toBeLessThan(30);
            expect(typeof backgroundColor).toBe('string');
            expect(typeof radiusPercents).toBe('string');
            expect(borderWidth).toBeLessThan(8);
            expect(typeof randomTreasureChoices).toBe('string');
        });
    });
});