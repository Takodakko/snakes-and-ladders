import { describe, expect, test, afterEach, beforeEach, vi } from 'vitest';
import { render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewGameSetup from '../../components/NewGameSetup';
import mockFunctions from '../mocks/mockFunctions';
const { mockMakeSquares, mockChangePieceType, mockChangeNumberOfSquares } = mockFunctions;

describe('NewGameSetup component', () => {

    beforeEach(() => {
        vi.useFakeTimers({ shouldClearNativeTimers: true, shouldAdvanceTime: true });
    });

    afterEach(() => {
        vi.useRealTimers();
        mockMakeSquares.mockClear();
        mockChangePieceType.mockClear();
        mockChangeNumberOfSquares.mockClear();
    });

    test('it has a button', () => {
        const { queryByRole } = render(<NewGameSetup changeNumberOfSquares={mockChangeNumberOfSquares} changePieceType={mockChangePieceType} makeSquares={mockMakeSquares}/>);
        const button = queryByRole('button');
        expect(button).toBeTruthy();
        expect(button?.textContent).toBe('Start Game');
    });

    test('it starts with invisible text explaining the parameters for number of squares', () => {
        const { queryByText } = render(<NewGameSetup changeNumberOfSquares={mockChangeNumberOfSquares} changePieceType={mockChangePieceType} makeSquares={mockMakeSquares}/>);
        const text = queryByText('Enter a number between 2 and 50');
        expect(text).toBeTruthy();
        expect(text?.style.display).toBe('none');
    });

    test('shows text if number of squares filled in by user is too few', async () => {
        const user = userEvent.setup();
        const { queryByText, getByLabelText, getByRole } = render(<NewGameSetup changeNumberOfSquares={mockChangeNumberOfSquares} changePieceType={mockChangePieceType} makeSquares={mockMakeSquares}/>);
        const text = queryByText('Enter a number between 2 and 50');
        expect(text?.style.display).toBe('none');

        await user.click(getByLabelText('number-of-tiles'));
        await user.keyboard('1');
        await user.click(getByRole('button'));

        expect(text?.style.color).toBe('red');
        expect(text?.style.display).toBe('block');
    });

    test('shows text if number of squares filled in by user is too many', async () => {
        const user = userEvent.setup();
        const { queryByText, getByLabelText, getByRole } = render(<NewGameSetup changeNumberOfSquares={mockChangeNumberOfSquares} changePieceType={mockChangePieceType} makeSquares={mockMakeSquares}/>);
        const text = queryByText('Enter a number between 2 and 50');
        expect(text?.style.display).toBe('none');

        await user.click(getByLabelText('number-of-tiles'));
        await user.keyboard('1000');
        await user.click(getByRole('button'));

        expect(text?.style.color).toBe('red');
        expect(text?.style.display).toBe('block');
    });

    test('sets number of points to zero by default and only has options up to 1 less than the number of squares', async () => {
        const user = userEvent.setup();
        const { getByDisplayValue } = render(<NewGameSetup changeNumberOfSquares={mockChangeNumberOfSquares} changePieceType={mockChangePieceType} makeSquares={mockMakeSquares}/>);
        const pointSelector = getByDisplayValue('0');
        const numberOfSquaresSelector = getByDisplayValue('25');

        expect(numberOfSquaresSelector).toBeTruthy();
        expect(pointSelector).toBeTruthy();
        const children = pointSelector.childElementCount;
        expect(children).toBe(24);

        await user.clear(numberOfSquaresSelector);
        await user.keyboard('20');
        vi.runAllTicks();

        const newChildren = pointSelector.childElementCount;
        expect(newChildren).toBe(19);
    });

    test('sets stamina to be inverse to points (more points -> less stamina)', async () => {
        const user = userEvent.setup();
        const { getByDisplayValue } = render(<NewGameSetup changeNumberOfSquares={mockChangeNumberOfSquares} changePieceType={mockChangePieceType} makeSquares={mockMakeSquares}/>);
        const pointSelector = getByDisplayValue('0');
        const staminaDisplay = getByDisplayValue('24');
        expect(staminaDisplay).toBeTruthy();

        await user.selectOptions(pointSelector, '4');

        const newStaminaDisplay = getByDisplayValue('20');
        expect(newStaminaDisplay).toBeTruthy();
    });

    test('allows user to choose ship type', () => {
        const { getByLabelText } = render(<NewGameSetup changeNumberOfSquares={mockChangeNumberOfSquares} changePieceType={mockChangePieceType} makeSquares={mockMakeSquares}/>);
        const shipSelect = getByLabelText('type-of-ship');
        const sail = within(shipSelect).getByText('sail');
        const cargo = within(shipSelect).getByText('cargo');
        
        expect(shipSelect.textContent).toBe('sailcargo');
        expect(shipSelect.childElementCount).toBe(2);
        expect(sail).toBeTruthy();
        expect(cargo).toBeTruthy();
    });
});