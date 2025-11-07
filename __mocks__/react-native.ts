const listeners = new Map<string, (data: unknown) => void>();

class MockNativeEventEmitter {
  constructor(_nativeModule: unknown) {}

  addListener(event: string, callback: (data: unknown) => void) {
    listeners.set(event, callback);
    return {
      remove: () => listeners.delete(event),
    };
  }

  static __emit(event: string, data: unknown) {
    listeners.get(event)?.(data);
  }
}

const NativeTimeouts = {
  setTimeout: jest.fn(),
  clearTimeout: jest.fn(),
  clearAll: jest.fn(),
};

const Platform = {
  select: jest.fn((options: Record<string, string>) => options.default ?? ''),
};

export { MockNativeEventEmitter };

module.exports = {
  NativeModules: {
    NativeTimeouts,
  },
  NativeEventEmitter: MockNativeEventEmitter,
  Platform,
};
