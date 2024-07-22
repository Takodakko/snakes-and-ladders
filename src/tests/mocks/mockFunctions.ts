import { vi } from 'vitest';

const mockRollDie = vi.fn((num: number) => num);

const mockHandleHover = vi.fn((string: string) => string);

const mockMessageWindowClose = vi.fn((onlyClose: boolean) => onlyClose);

const mockFunctions = {
    mockRollDie,
    mockMessageWindowClose,
    mockHandleHover,
};

export default mockFunctions;