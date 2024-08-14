vi.mock(import('../api.ts'), async (importOriginal) => {
    const mod = await importOriginal();
    const fakeIslandData = new Map();
    fakeIslandData.set(1, [20, 20, 'red', 'blue', 30, 'chest']);
    const fakeSaveData = {
            chosenPieceType: 'sail',
            currentPlayerPosition: 3,
            numberOfSquares: 25,
            userName: 'test',
            chosenIslandData: fakeIslandData,
            currentScore: 1,
            currentStamina: 1,
    }
    return {
        ...mod,
        loginConfirmWithDB: vi.fn(() => 'success'),
        createNewUserInDB: vi.fn(() => 'saved'),
        getAllHighScoresFromDB: vi.fn(() => [{id: 1, name: 'test', score: 10}]),
        addNewHighScoreToDB: vi.fn(() => ({entry: ['test', 10]})),
        saveGame: vi.fn(() => true),
        restoreGame: vi.fn(() => fakeSaveData),
        deleteGame: vi.fn(() => true),
    }
});
import App from '../App';
import { render, within } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import mockData from './mocks/mockData';
import { query } from 'express';
const { mockHighScoreList } = mockData;

describe('App component', () => {

    beforeEach(() => {
        vi.useFakeTimers({ shouldClearNativeTimers: true, shouldAdvanceTime: true });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    test('renders a the login view first', () => {
        const { queryByText, queryAllByRole } = render(<App />);
        const loginUserName = queryByText('User Name:');
        const buttons = queryAllByRole('button');
        const button1 = within(buttons[0]).queryByText('Create New User');
        const button2 = within(buttons[1]).queryByText('Sign In');
        const button3 = within(buttons[2]).queryByText('Sign in as guest');
        expect(loginUserName).toBeTruthy();
        expect(buttons.length).toBe(3);
        expect(button1).toBeTruthy();
        expect(button2).toBeTruthy();
        expect(button3).toBeTruthy();
    });

    test('moves to the new game view after the login view', async () => {
        const user = userEvent.setup();
        const { getByTestId, getByText, getByLabelText, queryByDisplayValue } = render(<App />);
        const guestLogin = getByText('Sign in as guest');
        const notYet = getByTestId('new-game-view');
        expect(notYet?.style.display).toBe('none');

        await user.click(guestLogin);

        const nowItsHere = getByTestId('new-game-view');
        expect(nowItsHere?.style.display).toBe('block');
        const tileNumberSelector = getByLabelText('number-of-tiles');
        expect(tileNumberSelector).toBeTruthy();
        expect(queryByDisplayValue('25')).toBeTruthy();
        expect(queryByDisplayValue('30')).toBe(null);
        
        await user.selectOptions(tileNumberSelector, '30');

        expect(queryByDisplayValue('25')).toBe(null);
        expect(queryByDisplayValue('30')).toBeTruthy();
    });

    test('moves to game board view after login and then game setup', async () => {
        const user = userEvent.setup();
        const { getByTestId, getByText, getByRole, getByLabelText, queryByDisplayValue, getAllByAltText } = render(<App />);
        const guestLogin = getByText('Sign in as guest');
        const gameBoardNotYet = getByTestId('game-board');

        expect(gameBoardNotYet.style.display).toBe('none');

        await user.click(guestLogin);

        const startGame = getByText('Start Game');

        await user.click(startGame);

        const gameBoard = getByTestId('game-board');

        expect(gameBoard.style.display).toBe('block');

        const playerPieceImages = getAllByAltText('sail');

        expect(playerPieceImages.length).toBe(25);
        expect(playerPieceImages[24]?.parentElement?.style.display).toBe('block');
        for (let i = 0; i < 24; i++) {
            expect(playerPieceImages[i]?.parentElement?.style.display).toBe('none');
        }
    });
});