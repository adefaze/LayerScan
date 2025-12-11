import '@testing-library/jest-dom';

// Mock Framer Plugin API
const mockFramer = {
    showUI: jest.fn(),
    closePlugin: jest.fn(),
    getCanvasRoot: jest.fn(() => Promise.resolve(null)),
    getSelection: jest.fn(() => Promise.resolve([])),
    setSelection: jest.fn(() => Promise.resolve()),
    subscribeToSelection: jest.fn(() => () => { }),
    notify: jest.fn(),
};

(global as unknown as { framer: typeof mockFramer }).framer = mockFramer;

export { mockFramer };
