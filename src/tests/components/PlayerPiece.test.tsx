import { describe, expect, test } from 'vitest';
import { render } from '@testing-library/react';
import PlayerPiece from '../../components/PlayerPiece';

describe('Player Piece component', () => {
    test('it has an image', () => {
        const { queryByRole } = render(<PlayerPiece pieceType="sail" pieceIsHere={true} />);
        const image = queryByRole('img');
        expect(image).toBeTruthy();
    });

    test("the image doesn't show if pieceIsHere is false", () => {
        const { queryByRole } = render(<PlayerPiece pieceType="sail" pieceIsHere={false} />);
        const image = queryByRole('img');
        expect(image).toBeNull();
    });

    test('alt text for image is based on pieceType prop', () => {
        const { queryByAltText, rerender } = render(<PlayerPiece pieceType="sail" pieceIsHere={true} />);
        const image1 = queryByAltText('sail');
        expect(image1).toBeTruthy();
        rerender(<PlayerPiece pieceType="cargo" pieceIsHere={true} />)
        const image2 = queryByAltText('cargo');
        expect(image2).toBeTruthy();
        expect(queryByAltText('sail')).toBeNull();
    })
});