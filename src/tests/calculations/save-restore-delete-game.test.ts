vi.mock(import('../../api.ts'), async (importOriginal) => {
    const mod = await importOriginal();
    return {
        ...mod,
        saveGameToDB: vi.fn(async (name: string, dataToSaveAsJson: Record<string, any>) => {
            if (name === 'success') {
                const obj = await {result: 'game saved'};
                return obj;
            } else {
                const obj = await {result: 'problem saving', data: dataToSaveAsJson};
                return obj;
            }
            
        }),
        restoreGameFromDB: vi.fn((name: string) => {
            console.log(name, 'name in mock');
            if (name === 'succeed') {
                const data = {
                        chosenIslandData: {'1': [30, 30, 'blue', '30%', 'nothing']},
                        currentScore: 3,
                        currentStamina: 4,
                        chosenPieceType: 'sail',
                        currentPlayerPosition: 1,
                        numberOfSquares: 1,
                        userName: 'succeed',
                }
                return {game: data};
            } else {
                return null;
            }
        }),
        deleteGameFromDB: vi.fn((name: string) => {
            if (name === 'delete') {
                return 'game deleted';
            } else {
                return 'game not deleted';
            }
        }),
    };
});
import { describe, expect, test, vi } from 'vitest';
import saveRestoreDeleteGame from '../../calculations/save-restore-delete-game';
const { saveGame, restoreGame, deleteGame } = saveRestoreDeleteGame;

describe('save restore and delete game functions', () => {
    window.alert = vi.fn();
    
    test('saves a game based on user name', async () => {
        const isSaved = await saveGame({
            chosenIslandData: new Map().set(1, [30, 30, 'blue', '30%', 'nothing']),
            currentScore: 3,
            currentStamina: 4,
            chosenPieceType: 'sail',
            currentPlayerPosition: 1,
            numberOfSquares: 1,
            userName: 'success',
    }, 1, 1, 'success', false);
    expect(isSaved).toBe(true);
    const isNotSaved = await saveGame({
        chosenIslandData: new Map().set(1, [30, 30, 'blue', '30%', 'nothing']),
        currentScore: 3,
        currentStamina: 4,
        chosenPieceType: 'sail',
        currentPlayerPosition: 1,
        numberOfSquares: 1,
        userName: 'fail',
    }, 1, 1, 'fail', false);
    expect(isNotSaved).toBe(false);
    const isOnlyAutoSaved = await saveGame({
        chosenIslandData: new Map().set(1, [30, 30, 'blue', '30%', 'nothing']),
        currentScore: 3,
        currentStamina: 4,
        chosenPieceType: 'sail',
        currentPlayerPosition: 1,
        numberOfSquares: 1,
        userName: 'fail',
    }, 1, 1, 'fail', true);
    expect(isOnlyAutoSaved).toBe(true);
    });

    test('restores a game from db based on user name', async () => {
        const saveGame = await restoreGame('succeed');
        expect(typeof saveGame).toBe('object');
        const noSaveGame = await restoreGame('failure');
        expect(noSaveGame).toBe(null);
    });

    test('deletes a game from the db', async () => {
        const didDelete = await deleteGame('delete');
        expect(didDelete).toBe(true);
    });
    
});