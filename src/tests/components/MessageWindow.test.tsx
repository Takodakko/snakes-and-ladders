import { describe, expect, test, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MessageWindow from '../../components/MessageWindow';
import mockData from '../mocks/mockData';
import mockFunctions from '../mocks/mockFunctions';
const { mockMessageWindowClose } = mockFunctions;
const { mockQueryMessage, mockTreasureTypeDictionary } = mockData;

describe('Message Window Component', () => {

    afterEach(() => {
        mockMessageWindowClose.mockReset();
    });

    test('Displays current stamina with appropriate color', () => {
        const { queryByText, rerender } = render(<MessageWindow messageWindowClose={mockMessageWindowClose} currentStamina={2} pointStaminaTextColor="red" content={mockQueryMessage}/>);
        expect(queryByText('Current Stamina: 2'));
        expect(queryByText('Current Stamina: 2')?.style.color).toBe("red");
        rerender(<MessageWindow messageWindowClose={mockMessageWindowClose} currentStamina={5} pointStaminaTextColor="purple" content={mockQueryMessage}/>);
        expect(queryByText('Current Stamina: 5'));
        expect(queryByText('Current Stamina: 5')?.style.color).toBe("purple");
        rerender(<MessageWindow messageWindowClose={mockMessageWindowClose} currentStamina={10} pointStaminaTextColor="black" content={mockQueryMessage}/>);
        expect(queryByText('Current Stamina: 10'));
        expect(queryByText('Current Stamina: 10')?.style.color).toBe("black");
    });

    test('Displays text according to message type and displays points for options with points', () => {
        const { queryByText, rerender } = render(<MessageWindow messageWindowClose={mockMessageWindowClose} currentStamina={2} pointStaminaTextColor="red" content={mockQueryMessage}/>);
        expect(queryByText(mockQueryMessage[2])).toBeTruthy();
        expect(queryByText('Points: ', {exact: false})).toBeNull();
        rerender(<MessageWindow messageWindowClose={mockMessageWindowClose} currentStamina={2} pointStaminaTextColor="red" content={mockTreasureTypeDictionary.chest}/>);
        expect(queryByText(mockTreasureTypeDictionary.chest[2], {exact: false})).toBeTruthy();
        expect(queryByText(`Points: ${mockTreasureTypeDictionary.chest[1]}`, {exact: false})).toBeTruthy();
    });

    test('Shows 2 buttons for initial query window, and 1 for others', () => {
        const { queryAllByRole, rerender, queryByText } = render(<MessageWindow messageWindowClose={mockMessageWindowClose} currentStamina={2} pointStaminaTextColor="red" content={mockQueryMessage}/>);
        const buttons = queryAllByRole('button');
        expect(buttons.length).toBe(2);
        expect(queryByText("No, I'd better not...")).toBe(buttons[0]);
        expect(queryByText("Yeah, let's go for it!")).toBe(buttons[1]);
        rerender(<MessageWindow messageWindowClose={mockMessageWindowClose} currentStamina={2} pointStaminaTextColor="red" content={mockTreasureTypeDictionary.chest}/>);
        const buttons2 = queryAllByRole('button');
        expect(buttons2.length).toBe(1);
        expect(queryByText('Ok')).toBe(buttons2[0]);
    });

    test('Call MessageWindowClose when any button is clicked', async () => {
        const user = userEvent.setup();
        const { queryAllByRole, getByRole, rerender } = render(<MessageWindow messageWindowClose={mockMessageWindowClose} currentStamina={2} pointStaminaTextColor="red" content={mockQueryMessage}/>);
        const [button1, button2] = queryAllByRole('button');
        await user.click(button1);
        expect(mockMessageWindowClose).toHaveBeenCalledWith(true, false);
        await user.click(button2);
        expect(mockMessageWindowClose).toHaveBeenLastCalledWith(false, false);
        expect(mockMessageWindowClose).toHaveBeenCalledTimes(2);
        rerender(<MessageWindow messageWindowClose={mockMessageWindowClose} currentStamina={2} pointStaminaTextColor="red" content={mockTreasureTypeDictionary.chest}/>);
        const onlyButton = getByRole('button');
        await user.click(onlyButton);
        expect(mockMessageWindowClose).toHaveBeenLastCalledWith(true, false);
        expect(mockMessageWindowClose).toHaveBeenCalledTimes(3);
    });

    test('has a unique setup for the "enemy" type message', async () => {
        const user = userEvent.setup();
        const { getByRole, queryByText } = render(<MessageWindow messageWindowClose={mockMessageWindowClose} currentStamina={2} pointStaminaTextColor="red" content={mockTreasureTypeDictionary.enemy}/>);
        const button = getByRole('button');
        const buttonText = queryByText('Uh-oh!');
        const otherButtonText = queryByText('Ok');

        expect(buttonText).toBeTruthy();
        expect(otherButtonText).toBeNull();
        
        await user.click(button);

        expect(mockMessageWindowClose).toHaveBeenCalledWith(true, true);
    });
});