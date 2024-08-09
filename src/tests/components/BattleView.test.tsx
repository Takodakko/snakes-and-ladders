vi.mock(import('../../calculations/battle-calculations'), async (importOriginal) => {
    const mod = await importOriginal();
    return {
        ...mod,
        calculateDamage: vi.fn(() => [0, 'Miss!'])
    }
});
import { render, within } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import BattleView from '../../components/BattleView';
import mockFunctions from '../mocks/mockFunctions';
const { mockChangeStaminaFromAttack, mockEndBattle } = mockFunctions;


describe('BattleView component', () => {

    beforeEach(() => {
        vi.useFakeTimers({ shouldClearNativeTimers: true, shouldAdvanceTime: true });
    });

    afterEach(() => {
        vi.useRealTimers();
        mockChangeStaminaFromAttack.mockClear();
        mockEndBattle.mockClear();
    });

    test('Displays stats for player ship and randomly generated enemy', () => {
        const { queryByText, queryAllByTestId } = render(<BattleView stamina={11} playerShip={'sail'} changeStaminaFromAttack={mockChangeStaminaFromAttack} endBattle={mockEndBattle} pointStaminaTextColor={'black'}/>);
        const playerShip = queryByText('Your Ship');
        expect(playerShip).toBeTruthy();
        const ships = queryAllByTestId('ship-stats');
        expect(ships.length).toBe(2);
        expect(ships[0].className).toBe('stat-board');
        expect(ships[1].className).toBe('stat-board');
        const player = within(ships[0]).getByText('Attack:');
        expect(player).toBeTruthy();
        const enemy = within(ships[1]).getByText('Attack:');
        expect(enemy).toBeTruthy();
    });

    test('Button starts with "Attack" and changes to "Defend" after click', async () => {
        const user = userEvent.setup();
        const { getByRole } = render(<BattleView stamina={11} playerShip={'sail'} changeStaminaFromAttack={mockChangeStaminaFromAttack} endBattle={mockEndBattle} pointStaminaTextColor={'black'}/>);
        const button = getByRole('button');
        const buttonText = within(button).getByText('Attack!');
        expect(buttonText).toBeTruthy();

        await user.click(button);
        vi.runAllTicks();
        vi.runAllTimers();

        const newButtonText = within(button).getByText('Defend!');
        expect(newButtonText).toBeTruthy();
        expect(mockChangeStaminaFromAttack).not.toHaveBeenCalled();

        await user.click(button);
        vi.runAllTicks();
        vi.runAllTimers();

        expect(mockChangeStaminaFromAttack).toHaveBeenCalled();
    });

    test('Displays Results Window after cycle of battle with button to close window and continue', async () => {
        const user = userEvent.setup();
        const { getByRole, queryByTestId, getByText } = render(<BattleView stamina={11} playerShip={'sail'} changeStaminaFromAttack={mockChangeStaminaFromAttack} endBattle={mockEndBattle} pointStaminaTextColor={'black'}/>);
        const button = getByRole('button');
        const resultsWindowPre = queryByTestId('battle-results-window');
        expect(resultsWindowPre).toBeNull();

        await user.click(button);
        
        vi.runAllTicks();
        await vi.runAllTimersAsync();
        
        const newButtonText = within(button).getByText('Defend!');
        expect(newButtonText).toBeTruthy();

        await user.click(button);
        
        vi.runAllTicks();
        await vi.runAllTimersAsync();

        const resultsWindowPost = queryByTestId('battle-results-window');
        expect(resultsWindowPost).toBeTruthy();
        const endButton = getByText('Ok');
        expect(endButton).toBeTruthy();
        expect(mockEndBattle).not.toHaveBeenCalled();

        await user.click(endButton);
        vi.runAllTimers();

        expect(mockEndBattle).toHaveBeenCalled();
    });
});