import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
    console.log('cleaning up');
    // vi.useRealTimers();
    cleanup();
});