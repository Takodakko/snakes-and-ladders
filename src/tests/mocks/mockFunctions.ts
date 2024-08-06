import { vi } from 'vitest';
import { islandAttributes } from '../../appTypes';

const mockRollDie = vi.fn((num: number) => num);

const mockHandleHover = vi.fn((string: string) => string);

const mockMessageWindowClose = vi.fn((onlyClose: boolean) => onlyClose);

const mockDisplayUserName = vi.fn((name: string, hasSetup: boolean) => {
    return {name, hasSetup};
  });

const mockUserIsRegistered = vi.fn((yes: boolean) => yes);

const mockRestoreGameFromLocalOrDB = vi.fn((name: string) => {
    const bool = 'true';
    return Promise.resolve(name === bool);
});

const mockLoginFetch = vi.fn((name: string, pword: string) => {
    if (name === 'true' && pword === 'password') {
        return 'success';
    } else {
        return 'not a user'
    }
});

const mockCreateNewUser = vi.fn((name: string, pword: string) => {
    if (name === 'true' && pword === 'password') {
        return 'saved';
    } else {
        return 'not saved';
    }
});

const mockMakeSquares = vi.fn((num: number, data: islandAttributes | null, score: number, stamina: number, position: number): void => {
    console.log(num, data, stamina, score, position);
});

const mockChangePieceType = vi.fn((type: string) => {
    console.log(type);
});

const mockChangeNumberOfSquares = vi.fn((num: number, stamina: number, points: number) => {
    console.log(num, stamina, points);
});

const mockChangeStaminaFromAttack = vi.fn();

const mockEndBattle = vi.fn();

const mockFunctions = {
    mockRollDie,
    mockMessageWindowClose,
    mockHandleHover,
    mockDisplayUserName,
    mockUserIsRegistered,
    mockRestoreGameFromLocalOrDB,
    mockLoginFetch,
    mockCreateNewUser,
    mockMakeSquares,
    mockChangePieceType,
    mockChangeNumberOfSquares,
    mockChangeStaminaFromAttack,
    mockEndBattle,
};

export default mockFunctions;