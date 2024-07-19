import { describe, expect, test, afterEach } from '@jest/globals';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Die from '../../components/Die';
import mockFunctions from '../__mocks__/mockFunctions';
const { mockRollDie } = mockFunctions;
import userEvent from '@testing-library/user-event';

describe('Die component', () => {
    
    afterEach(() => {
        mockRollDie.mockReset();
    });

    test('Displays 9 dots', () => {
        const { container } = render(<Die dots={1} rollDie={mockRollDie} canRollDie={true}/>);
        const dots = container.getElementsByClassName('dot');
        expect(dots.length).toBe(9);
    });

    test('The number of dots with black background color is the number passed in as dots', () => {
        const { container, rerender } = render(<Die dots={1} rollDie={mockRollDie} canRollDie={true}/>);
        const dots1 = container.getElementsByClassName('dot');
        const blackDots1 = Array.prototype.filter.call(dots1, (el) => {
          if (el.style.backgroundColor === 'black') {
            return el;
          }
        });
        expect(blackDots1.length).toBe(1);
        rerender(<Die dots={3} rollDie={mockRollDie} canRollDie={true}/>);
        const dots2 = container.getElementsByClassName('dot');
        const blackDots2 = Array.prototype.filter.call(dots2, (el) => {
          if (el.style.backgroundColor === 'black') {
            return el;
          }
        });
        expect(blackDots2.length).toBe(3);
    });

    test('Die clicks are disabled if canRollDie is false, and when enabled, always calls with a number between 1 and 6 and updates die face and dot classes for animation and color', async () => {
        const user = userEvent.setup();
        const { getByTestId, rerender , container} = render(<Die dots={1} rollDie={mockRollDie} canRollDie={false}/>);
        await user.click(getByTestId('die'));
        setTimeout(() => {
            expect(mockRollDie).not.toHaveBeenCalled();
        }, 1);
        rerender(<Die dots={1} rollDie={mockRollDie} canRollDie={true}/>);
        await user.click(getByTestId('die'));
        expect(container.getElementsByClassName('die-face').length).toBe(1);
        expect(container.getElementsByClassName('rolling-die').length).toBe(10);
        setTimeout(() => {
            expect(mockRollDie).toHaveBeenCalled();
            expect(mockRollDie.mockReturnValue).toBeGreaterThan(0);
            expect(mockRollDie.mockReturnValue).toBeLessThan(7);
            expect(container.getElementsByClassName('rolling-die').length).toBe(0);
        }, 1);
    });

    test('Text changes opacity based on canRollDie', () => {
        const { queryAllByText, rerender } = render(<Die dots={1} rollDie={mockRollDie} canRollDie={true}/>);
        const dieText1 = queryAllByText('Roll the die!')[0].parentElement;
        expect(dieText1?.style.opacity).toBe("100");
        rerender(<Die dots={1} rollDie={mockRollDie} canRollDie={false}/>)
        const dieText2 = queryAllByText('Roll the die!')[0].parentElement;
        expect(dieText2?.style.opacity).toBe("0");
    });
});