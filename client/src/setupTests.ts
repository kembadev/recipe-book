import '@testing-library/jest-dom';
import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';

expect.extend(matchers);

Object.defineProperty(window, 'matchMedia', {
	value: vi.fn().mockImplementation(() => ({
		matches: true,
	})),
});

afterEach(() => {
	cleanup();
});
