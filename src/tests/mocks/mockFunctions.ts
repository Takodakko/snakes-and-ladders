import { vi } from 'vitest';

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

const mockFunctions = {
    mockRollDie,
    mockMessageWindowClose,
    mockHandleHover,
    mockDisplayUserName,
    mockUserIsRegistered,
    mockRestoreGameFromLocalOrDB,
    mockLoginFetch,
    mockCreateNewUser,
};

export default mockFunctions;