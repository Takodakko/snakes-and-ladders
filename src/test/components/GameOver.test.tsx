import { describe, expect, test } from '@jest/globals';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import GameOver from '../../components/GameOver';

describe('GameOver component', () => {
    test('Changes Message and appearance between win and loss based on hasArrived', () => {
        const { rerender, queryByText, container } = render(<GameOver hasArrived={true} gameState="finishedGame" />);
        const winText1 = queryByText("You've arrived!");
        const lossText1 = queryByText("Lost at sea");
        expect(winText1).toBeTruthy();
        expect(lossText1).toBeNull();
        expect(container.getElementsByClassName("win-message").length).toBe(1);
        expect(container.getElementsByClassName("loss-message").length).toBe(0);
        rerender(<GameOver hasArrived={false} gameState="finishedGame" />);
        const winText2 = queryByText("You've arrived!");
        const lossText2 = queryByText("Lost at sea");
        expect(winText2).toBeNull();
        expect(lossText2).toBeTruthy();
        expect(container.getElementsByClassName("win-message").length).toBe(0);
        expect(container.getElementsByClassName("loss-message").length).toBe(1);
    });

    test('Displays only if gameState is finishedGame', () => {
        const { rerender, queryByText } = render(<GameOver hasArrived={true} gameState="finishedGame" />);
        const element1 = queryByText("You've arrived!")?.parentElement?.parentElement?.parentElement;
        expect(element1?.style?.display).toBe('flex');
        rerender(<GameOver hasArrived={true} gameState="playingGame" />);
        const element2 = queryByText("You've arrived!")?.parentElement?.parentElement?.parentElement;
        expect(element2?.style?.display).toBe('none');
    });
});