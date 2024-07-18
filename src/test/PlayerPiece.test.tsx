import { describe, expect, test } from '@jest/globals';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlayerPiece from '../components/PlayerPiece';


describe('PlayerPiece Component', () => {
    
    test('Contains an image if pieceIsHere is true', () => {
        const { getByRole, queryByAltText } = render(<PlayerPiece pieceType='sail' pieceIsHere={true}/>);
        expect(getByRole('img')).toBeDefined();
        expect(queryByAltText('sail')).toBeTruthy();
    });
    
    test('Contains no image if pieceIsHere is false', () => {
        const { queryByRole, queryByAltText } = render(<PlayerPiece pieceType='sail' pieceIsHere={false}/>);
        expect(queryByRole('img', {hidden: true})).toBeTruthy();
        expect(queryByRole('img', {hidden: false})).toBeNull();
        expect(queryByAltText('sail')).toBeTruthy();
    });
});