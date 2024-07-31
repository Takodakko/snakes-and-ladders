import { expect, test } from 'vitest';
import imageList from '../imageList';

test('has a sail key', () => {
    const list = {...imageList};
    expect(list.sail).toBeTruthy();
    expect(typeof list.sail).toBe('string');
});