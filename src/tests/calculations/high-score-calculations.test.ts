import { describe, expect, test } from 'vitest';
import highScoreCalculations from '../../calculations/high-score-calculations';
import { highScoreListType } from '../../appTypes';
const { addScoreToList, checkScoreAgainstList } = highScoreCalculations;
const fakeList: highScoreListType = [[100, 'Edelgard'], [90, 'Hubert'], [85, 'Linhardt'], [70, 'Ferdinand'], [60, 'Dorothea'], [55, 'Petra'], [10, 'Bernadetta'], [-10, 'Caspar']];
const notNewEntry: [number, string] = [-20, 'Jeritza'];
const newEntry: [number, string] = [60, 'Balthus'];

describe('checkScoreAgainstList', () => {
    test('it returns a positive index for the new entry only if it has a score larger than at least one in the current list', () => {
      const index = checkScoreAgainstList([...fakeList], [...newEntry]);
      expect(index).toBe(4);
    });

    test('it returns -1 as an index if the new entry has a score too low', () => {
        const index = checkScoreAgainstList([...fakeList], [...notNewEntry]);
        expect(index).toBe(-1);
    });

    test('it enters a new score into the list and returns a new list still of 8 items', () => {
        const newList = addScoreToList([...fakeList], [...newEntry], 4);
        expect(newList[4][0]).toBe(60);
        expect(newList[4][1]).toBe('Balthus');
        expect(newList.length).toBe(8);
        const newList2 = addScoreToList([...fakeList], [200, 'Byleth'], 0);
        expect(newList2[0][0]).toBe(200);
        expect(newList2[0][1]).toBe('Byleth');
        expect(newList2.length).toBe(8);
        const newList3 = addScoreToList([...fakeList], [0, 'Seteth'], 7);
        expect(newList3[7][0]).toBe(0);
        expect(newList3[7][1]).toBe('Seteth');
        expect(newList3.length).toBe(8);
    });
});