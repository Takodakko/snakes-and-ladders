import { describe, expect, test } from 'vitest';
import { render } from '@testing-library/react';
import ShipStatView from '../../components/ShipStatView';

describe('ShipStatView component', () => {
    test('it shows the ship statistics', () => {
        const { queryByTestId, queryByText } = render(<ShipStatView name="Bob" attack={10} stamina={20} speed={10} hit={10} activeRow='attack-row'/>);
        const attackDisplay = queryByTestId('attack-row');
        const nameDisplay = queryByText('Bob');
        const speedDisplay = queryByTestId('speed-row');
        const staminaDisplay = queryByTestId('stamina-row');
        const hitDisplay = queryByTestId('hit-row');
        
        expect(attackDisplay).toBeTruthy();
        expect(nameDisplay).toBeTruthy();
        expect(speedDisplay).toBeTruthy();
        expect(staminaDisplay).toBeTruthy();
        expect(hitDisplay).toBeTruthy();
    });
});