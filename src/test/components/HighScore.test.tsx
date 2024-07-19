import { describe, expect, test } from '@jest/globals';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import HighScore from '../../components/HighScore';
import mockData from '../__mocks__/mockData';
const { mockHighScoreList } = mockData;

describe('HighScore component', () => {
    test('Shows only when showHighScores is true', () => {
        const {rerender, queryByText } = render(<HighScore showHighScores={true} highScores={mockHighScoreList} newScoreIndex={-1}/>);
        const list1 = queryByText('High Scores List')?.parentElement;
        expect(list1?.style.display).toBe('block');
        rerender(<HighScore showHighScores={false} highScores={mockHighScoreList} newScoreIndex={-1}/>);
        const list2 = queryByText('High Scores List')?.parentElement;
        expect(list2?.style.display).toBe('none');
    });

    test('Flashes new high score if one exists', () => {
        const {rerender, queryAllByRole } = render(<HighScore showHighScores={true} highScores={mockHighScoreList} newScoreIndex={-1}/>);
        const listItems1 = queryAllByRole('listitem');
        const noFlashing = listItems1.findIndex((el) => el.className === 'new-score-pulse');
        expect(noFlashing).toBe(-1);
        rerender(<HighScore showHighScores={true} highScores={mockHighScoreList} newScoreIndex={2}/>);
        const listItems2 = queryAllByRole('listitem');
        const flashing = listItems2.findIndex((el) => el.className === 'new-score-pulse');
        expect(flashing).toBe(2);
    });
});