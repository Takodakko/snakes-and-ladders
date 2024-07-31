import { describe, expect, test } from 'vitest';
import { render } from '@testing-library/react';
import Square from '../../components/Square';
import { islandStyleArray } from '../../appTypes';

const styleAttributes: islandStyleArray = [0, 0, 'darkgreen', '50% 50% 50% 50%', 2, 'nothing'];

describe('Square Component', () => {
    
    test('Displays Number of tile in component', () => {
        const { getByText } = render(<Square tileNumber="2" pieceType="sail" hasPiece={true} styleAttributes={styleAttributes}/>);
        expect(getByText('2')).toBeTruthy();
    });

    test('Passes pieceType and hasPiece to child ', () => {
        const { container, queryByAltText, queryByRole, rerender } = render(<Square tileNumber="2" pieceType="sail" hasPiece={true} styleAttributes={styleAttributes}/>);
        expect(container.firstChild).toBeTruthy();
        expect(queryByAltText('sail')).toBeTruthy();
        expect(queryByRole('img')).toBeTruthy();
        rerender(<Square tileNumber="2" pieceType="cargo" hasPiece={false} styleAttributes={styleAttributes}/>);
        expect(queryByRole('img')).toBeNull();
        expect(queryByAltText('sail')).toBeNull();
        expect(queryByAltText('cargo')).toBeTruthy();
    });
});