import { render } from '@testing-library/react';
import { islandAttributes, islandStyleArray } from '../../appTypes';
import { describe, expect, test } from 'vitest';
import Board from '../../components/Board';

const islandStyling: islandStyleArray = [0, 0, 'darkgreen', '50% 50% 50% 50%', 2, 'nothing'];
const islandsMap: islandAttributes = new Map();
islandsMap.set(1, [...islandStyling]);
islandsMap.set(2, [...islandStyling]);
islandsMap.set(3, [...islandStyling]);

describe('Board Component', () => {
  test('Displays number of tiles equal to inputted numberOfSquares', () => {
    const { queryAllByRole, queryAllByAltText, rerender } = render(<Board numberOfSquares={3} pieceType="sail" playerPosition={1} chosenIslandData={islandsMap}/>);
    expect(queryAllByRole('img', {hidden: true}).length).toEqual(3);
    expect(queryAllByAltText('sail').length).toEqual(3);
    rerender(<Board numberOfSquares={2} pieceType="sail" playerPosition={1} chosenIslandData={islandsMap}/>);
    expect(queryAllByAltText('sail').length).toEqual(2);
  });

  test('Displays player piece only on inputted playerPosition', () => {
    const { queryAllByRole, queryByRole, queryByText, rerender } = render(<Board numberOfSquares={3} pieceType="sail" playerPosition={1} chosenIslandData={islandsMap}/>);
    expect(queryAllByRole('img', {hidden: false}).length).toEqual(1);
    const playerPositionFirst = queryByRole('img')?.parentElement?.parentElement?.getElementsByTagName('b')[0];
    expect(queryByText('1')).toBe(playerPositionFirst);
    rerender(<Board numberOfSquares={3} pieceType="sail" playerPosition={2} chosenIslandData={islandsMap}/>);
    const playerPositionSecond = queryByRole('img')?.parentElement?.parentElement?.getElementsByTagName('b')[0];
    expect(queryByText('2')).toBe(playerPositionSecond);
  });
});