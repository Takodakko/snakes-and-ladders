import { describe, expect, test, afterEach, beforeEach, vi } from 'vitest';
import { render, within, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewGameSetup from '../../components/NewGameSetup';
import mockFunctions from '../mocks/mockFunctions';
const { mockMakeSquares, mockChangePieceType, mockChangeNumberOfSquares } = mockFunctions;
import { pieceTypes } from '../../appTypes';
const pieces = ['sail', 'cargo'] as pieceTypes[];

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
        const { queryByRole } = render(<NewGameSetup changeNumberOfSquares={mockChangeNumberOfSquares} changePieceType={mockChangePieceType} makeSquares={mockMakeSquares} pieceTypeOptions={pieces}/>);
        const button = queryByRole('button');
        expect(button).toBeTruthy();
        expect(button?.textContent).toBe('Start Game');
    });

    test('sets number of points to zero by default and only has number of tile options that are multiples of 5 from 20 to 40', async () => {
        const user = userEvent.setup();
        const { getByDisplayValue } = render(<NewGameSetup changeNumberOfSquares={mockChangeNumberOfSquares} changePieceType={mockChangePieceType} makeSquares={mockMakeSquares} pieceTypeOptions={pieces}/>);
        const pointSelector = getByDisplayValue('0');
        const numberOfSquaresSelector = getByDisplayValue('25');

        expect(numberOfSquaresSelector).toBeTruthy();
        expect(pointSelector).toBeTruthy();
        const children = pointSelector.childElementCount;
        expect(children).toBe(24);

        await user.selectOptions(numberOfSquaresSelector, '20');
        vi.runAllTicks();

        const newChildren = pointSelector.childElementCount;
        expect(newChildren).toBe(19);
    });

    test('sets stamina to be inverse to points (more points -> less stamina)', async () => {
        const user = userEvent.setup();
        const { getByDisplayValue } = render(<NewGameSetup changeNumberOfSquares={mockChangeNumberOfSquares} changePieceType={mockChangePieceType} makeSquares={mockMakeSquares} pieceTypeOptions={pieces}/>);
        const pointSelector = getByDisplayValue('0');
        const staminaDisplay = getByDisplayValue('24');
        expect(staminaDisplay).toBeTruthy();

        await user.selectOptions(pointSelector, '4');

        const newStaminaDisplay = getByDisplayValue('20');
        expect(newStaminaDisplay).toBeTruthy();
    });

    test('allows user to choose ship type', async () => {
        const user = userEvent.setup();
        const { getByLabelText } = render(<NewGameSetup changeNumberOfSquares={mockChangeNumberOfSquares} changePieceType={mockChangePieceType} makeSquares={mockMakeSquares} pieceTypeOptions={pieces}/>);
        const shipSelect = getByLabelText('type-of-ship');
        const sail = within(shipSelect).getByText('sail *');
        const cargo = within(shipSelect).getByText('cargo');
        
        expect(shipSelect.textContent).toBe('sail *cargo ');
        expect(shipSelect.childElementCount).toBe(2);
        expect(sail).toBeTruthy();
        expect(cargo).toBeTruthy();

        await user.selectOptions(shipSelect, 'cargo');

        await waitFor(() => {
            expect(screen.queryByText('cargo')).toBeNull();
            expect(screen.queryByText('sail *')).toBeNull();
            expect(screen.queryByText('sail')).toBeTruthy();
            expect(screen.queryByText('cargo *')).toBeTruthy();
        });
    });

    test('allows user to submit choices', async () => {
        const user = userEvent.setup();
        const { getByRole } = render(<NewGameSetup changeNumberOfSquares={mockChangeNumberOfSquares} changePieceType={mockChangePieceType} makeSquares={mockMakeSquares} pieceTypeOptions={pieces}/>);
        const submit = getByRole('button');

        await user.click(submit);
        await waitFor(() => {
            expect(mockChangeNumberOfSquares).toHaveBeenCalled();
            expect(mockChangePieceType).toHaveBeenCalled();
            expect(mockMakeSquares).toHaveBeenCalled();
        });
    });
});