import { describe, expect, test } from '@jest/globals';
import { render } from '@testing-library/react';
import { islandStyleArray } from '../appTypes';
import '@testing-library/jest-dom';

import Square from '../components/Square';

const styleAttributes: islandStyleArray = [0, 0, 'darkgreen', '50% 50% 50% 50%', 2, 'nothing'];

describe('Square Component', () => {
    const { getByText } = render(<Square tileNumber="2" pieceType="sail" hasPiece={true} styleAttributes={styleAttributes}/>)
    test('Displays Number of tile in component', async () => {
        expect(getByText('2')).toBeTruthy();
    });
});