import { jest } from '@jest/globals';

const mockHandleHover = jest.fn((string: string) => string);

const mockMessageWindowClose = jest.fn((onlyClose: boolean) => onlyClose);

const mockFunctions = {
    mockHandleHover,
    mockMessageWindowClose,
};

export default mockFunctions;