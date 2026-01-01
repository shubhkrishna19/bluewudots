/**
 * Jest Test Setup and Configuration
 * Global test utilities and mocks
 */

// Mock fetch API globally
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

// Mock IndexedDB
const indexedDBMock = {
  open: jest.fn(),
  deleteDatabase: jest.fn()
};
global.indexedDB = indexedDBMock;

// Suppress console errors in tests unless needed
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Not implemented: HTMLFormElement.prototype.submit')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Reset all mocks before each test
afterEach(() => {
  jest.clearAllMocks();
});

// Test utilities
export const mockFetch = (data, ok = true) => {
  global.fetch.mockResolvedValueOnce({
    ok,
    json: async () => data,
    text: async () => JSON.stringify(data),
    status: ok ? 200 : 400
  });
};

export const mockFetchError = (error) => {
  global.fetch.mockRejectedValueOnce(error);
};

// Helper to wait for promises
export const flushPromises = () => {
  return new Promise(resolve => setImmediate(resolve));
};

// Mock Date
export const mockDate = (dateString) => {
  jest.spyOn(global, 'Date').mockImplementation(() => new Date(dateString));
};

// Reset date mock
export const resetDateMock = () => {
  jest.restoreAllMocks();
};
