vi.mock(import('../../api.ts'), async (importOriginal) => {
    const mod = await importOriginal();
    return {
        ...mod,
        loginConfirmWithDB: vi.fn((name: string, pword: string) => {
            if (name === 'true' && pword === 'password') {
                return 'success';
            } else {
                return 'not a user'
            }
        }),
        createNewUserInDB: vi.fn((name: string, pword: string) => {
            if (name === 'true' && pword === 'password') {
                return 'saved';
            } else {
                return 'not saved';
            }
        }),
    };
});

import { describe, expect, test, afterEach, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginView from '../../components/LoginView';
import mockFunctions from '../mocks/mockFunctions';
const { mockDisplayUserName, mockUserIsRegistered, mockRestoreGameFromLocalOrDB } = mockFunctions;

describe('LoginView component', () => {

    beforeEach(() => {
        vi.useFakeTimers({ shouldClearNativeTimers: true, shouldAdvanceTime: true });
        window.alert = vi.fn();
    });

    afterEach(() => {
        vi.useRealTimers();
        mockDisplayUserName.mockClear();
        mockUserIsRegistered.mockClear();
        mockRestoreGameFromLocalOrDB.mockClear();
    });

    test('has 3 buttons', () => {
      const { queryAllByRole, queryByText } = render(<LoginView displayUserName={mockDisplayUserName} userIsRegistered={mockUserIsRegistered} restoreGameFromLocalOrDB={mockRestoreGameFromLocalOrDB}/>);
      const buttons = queryAllByRole('button');
      expect(buttons.length).toBe(3);
      expect(queryByText('Create New User')).toBeTruthy();
      expect(queryByText('Sign In')).toBeTruthy();
      expect(queryByText('Sign in as guest')).toBeTruthy();
    });

    test('user can enter a name and password', async () => {
        const user = userEvent.setup();
        const { getByText, getByLabelText } = render(<LoginView displayUserName={mockDisplayUserName} userIsRegistered={mockUserIsRegistered} restoreGameFromLocalOrDB={mockRestoreGameFromLocalOrDB}/>);
        const nameInput = getByLabelText('name');
        const passwordInput = getByLabelText('password')
        
        expect(nameInput).toBeTruthy();
        expect(passwordInput).toBeTruthy();

        await user.click(nameInput);
        await user.keyboard('true');
        await user.click(passwordInput);
        await user.keyboard('password');
        await user.click(getByText('Sign In'));
        await vi.runAllTimersAsync();
        
        expect(mockRestoreGameFromLocalOrDB).toHaveBeenCalled();
        expect(mockRestoreGameFromLocalOrDB).toHaveBeenCalledWith('true');
        expect(mockDisplayUserName).toHaveBeenCalledWith('true', false);
        expect(mockUserIsRegistered).toHaveBeenCalledWith(true);
    });

    test('user cannot enter a name shorter than 2 characters or that is "Guest"', async () => {
        const user = userEvent.setup();
        const { getByText, getByLabelText, rerender } = render(<LoginView displayUserName={mockDisplayUserName} userIsRegistered={mockUserIsRegistered} restoreGameFromLocalOrDB={mockRestoreGameFromLocalOrDB}/>);
        const nameInput = getByLabelText('name');
        const passwordInput = getByLabelText('password')
        
        expect(nameInput).toBeTruthy();
        expect(passwordInput).toBeTruthy();

        await user.click(nameInput);
        await user.keyboard('t');
        await user.click(passwordInput);
        await user.keyboard('password');
        await user.click(getByText('Sign In'));
        await vi.runAllTimersAsync();
        
        expect(mockRestoreGameFromLocalOrDB).not.toHaveBeenCalled();
        expect(mockDisplayUserName).not.toHaveBeenCalled();
        expect(mockUserIsRegistered).not.toHaveBeenCalled();

        rerender(<LoginView displayUserName={mockDisplayUserName} userIsRegistered={mockUserIsRegistered} restoreGameFromLocalOrDB={mockRestoreGameFromLocalOrDB}/>);

        await user.click(nameInput);
        await user.keyboard('Guest');
        await user.click(passwordInput);
        await user.keyboard('password');
        await user.click(getByText('Sign In'));
        await vi.runAllTimersAsync();
        
        expect(mockRestoreGameFromLocalOrDB).not.toHaveBeenCalled();
        expect(mockDisplayUserName).not.toHaveBeenCalled();
        expect(mockUserIsRegistered).not.toHaveBeenCalled();
    });

    test('user cannot enter a password shorter than 8 characters', async () => {
        const user = userEvent.setup();
        const { getByText, getByLabelText } = render(<LoginView displayUserName={mockDisplayUserName} userIsRegistered={mockUserIsRegistered} restoreGameFromLocalOrDB={mockRestoreGameFromLocalOrDB}/>);
        const nameInput = getByLabelText('name');
        const passwordInput = getByLabelText('password');

        await user.click(nameInput);
        await user.keyboard('true');
        await user.click(passwordInput);
        await user.keyboard('pass');
        await user.click(getByText('Sign In'));
        await vi.runAllTimersAsync();
        
        expect(mockRestoreGameFromLocalOrDB).not.toHaveBeenCalled();
        expect(mockDisplayUserName).not.toHaveBeenCalled();
        expect(mockUserIsRegistered).not.toHaveBeenCalled();  
    });
});