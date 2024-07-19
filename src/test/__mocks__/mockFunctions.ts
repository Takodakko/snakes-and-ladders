import { jest } from '@jest/globals';

const mockHandleHover = jest.fn((string: string) => string);

const mockMessageWindowClose = jest.fn((onlyClose: boolean) => onlyClose);

const mockRollDie = jest.fn((num: number) => num);

const mockFunctions = {
    mockHandleHover,
    mockMessageWindowClose,
    mockRollDie,
};

export default mockFunctions;