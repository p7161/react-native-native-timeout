jest.mock('react-native');

import {
  nativeSetTimeout,
  nativeClearTimeout,
  nativeClearAll,
} from '../src';

type MockNativeEventEmitter = {
  __emit: (event: string, data: unknown) => void;
};

describe('native timeouts bridge', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('schedules and invokes callbacks when native event fires', () => {
    const cb = jest.fn();
    const id = nativeSetTimeout(cb, 25.7);

    const {
      NativeModules: { NativeTimeouts },
      NativeEventEmitter,
    } = jest.requireMock('react-native');

    expect(NativeTimeouts.setTimeout).toHaveBeenCalledWith(25, id);

    (NativeEventEmitter as unknown as MockNativeEventEmitter).__emit(
      'NativeTimeout',
      { id },
    );

    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('clears individual callbacks', () => {
    const cb = jest.fn();
    const id = nativeSetTimeout(cb, 10);

    nativeClearTimeout(id);

    const {
      NativeModules: { NativeTimeouts },
      NativeEventEmitter,
    } = jest.requireMock('react-native');

    expect(NativeTimeouts.clearTimeout).toHaveBeenCalledWith(id);

    (NativeEventEmitter as unknown as MockNativeEventEmitter).__emit(
      'NativeTimeout',
      { id },
    );

    expect(cb).not.toHaveBeenCalled();
  });

  it('clears all callbacks and delegates to native implementation', () => {
    const first = jest.fn();
    const second = jest.fn();

    const firstId = nativeSetTimeout(first, -100);
    const secondId = nativeSetTimeout(second, 0);

    nativeClearAll();

    const {
      NativeModules: { NativeTimeouts },
      NativeEventEmitter,
    } = jest.requireMock('react-native');

    expect(NativeTimeouts.setTimeout).toHaveBeenNthCalledWith(1, 0, firstId);
    expect(NativeTimeouts.setTimeout).toHaveBeenNthCalledWith(2, 0, secondId);
    expect(NativeTimeouts.clearAll).toHaveBeenCalled();

    (NativeEventEmitter as unknown as MockNativeEventEmitter).__emit(
      'NativeTimeout',
      { id: firstId },
    );
    (NativeEventEmitter as unknown as MockNativeEventEmitter).__emit(
      'NativeTimeout',
      { id: secondId },
    );

    expect(first).not.toHaveBeenCalled();
    expect(second).not.toHaveBeenCalled();
  });
});
