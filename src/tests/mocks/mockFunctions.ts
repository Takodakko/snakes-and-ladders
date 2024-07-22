import { vi } from 'vitest';

const mockRollDie = vi.fn((num: number) => num);

const mockFunctions = {
    mockRollDie,
};

export default mockFunctions;