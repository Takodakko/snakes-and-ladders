import { jest } from '@jest/globals';

const mockHandleHover = jest.fn((string: string) => string);

const mockFunctions = {
    mockHandleHover,
};

export default mockFunctions;