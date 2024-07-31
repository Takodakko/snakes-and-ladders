import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
    console.log('cleaning up');
    cleanup();
});