import { describe, expect, test } from '@jest/globals';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import InfoDialog from '../../components/InfoDialog';
import mockData from '../__mocks__/mockData';
import mockFunctions from '../__mocks__/mockFunctions';
const { mockHandleHover } = mockFunctions;
const { mockMessages } = mockData;

describe('InfoDialog component', () => {
    
    test('Displays if user hovers over it', () => {
      const { queryByText } = render(<InfoDialog hover="move" identifier="move" handleHover={mockHandleHover}/>);
      expect(queryByText(mockMessages.move)).toBeTruthy();
      expect(queryByText(mockMessages.move)?.style.display).toBe('block');
    });

    test('Does not display if user is not hovering', () => {
      const { queryByText } = render(<InfoDialog hover="none" identifier="move" handleHover={mockHandleHover}/>);
      expect(queryByText(mockMessages.move)).toBeTruthy();
      expect(queryByText(mockMessages.move)?.style.display).toBe('none');
    });

    test('Displays appropriate text based on identifier', () => {
        const { queryByText, rerender } = render(<InfoDialog hover="move" identifier="move" handleHover={mockHandleHover}/>);
        expect(queryByText(mockMessages.move)).toBeTruthy();
        rerender(<InfoDialog hover="rest" identifier="rest" handleHover={mockHandleHover}/>);
        expect(queryByText(mockMessages.rest)).toBeTruthy();
        expect(queryByText(mockMessages.move)).toBeNull();
    });

    test('Sets hover to "none" if user clicks the dialog', async () => {
        const user = userEvent.setup()
        const { getByRole } = render(<InfoDialog hover="move" identifier="move" handleHover={mockHandleHover}/>);
        await user.click(getByRole('dialog'));
        expect(mockHandleHover).toHaveBeenCalledWith('none');
    });
});