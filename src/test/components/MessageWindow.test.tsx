import { describe, expect, test } from '@jest/globals';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
// import userEvent from '@testing-library/user-event';
import MessageWindow from '../../components/MessageWindow';
import mockData from '../__mocks__/mockData';
import mockFunctions from '../__mocks__/mockFunctions';
const { mockMessageWindowClose } = mockFunctions;
const { mockQueryMessage, mockTreasureTypeDictionary } = mockData;

describe('Message Window Component', () => {
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
});