import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

type NativeTimeoutsModule = {
  setTimeout(delayMs: number, id: string): void;
  clearTimeout(id: string): void;
  clearAll?: () => void;
};

const NativeTimeouts: NativeTimeoutsModule | undefined =
  NativeModules.NativeTimeouts;

if (!NativeTimeouts) {
  throw new Error(
    Platform.select({
      ios: 'Native module "NativeTimeouts" is not linked. Did you run pod install?',
      android:
        'Native module "NativeTimeouts" is not linked. Have you rebuilt the app after installing the package?',
      default: 'Native module "NativeTimeouts" is not available on this platform.',
    }) ?? 'Native module "NativeTimeouts" is not available.',
  );
}

type NativeTimeoutEvent = {
  id: string;
};

export type TimeoutId = string;

const emitter = new NativeEventEmitter(NativeTimeouts as unknown as object);
const callbacks = new Map<TimeoutId, () => void>();

const handleTimeout = ({ id }: NativeTimeoutEvent) => {
  const callback = callbacks.get(id);
  if (!callback) {
    return;
  }

  callbacks.delete(id);
  try {
    callback();
  } catch (error) {
    setTimeout(() => {
      throw error;
    }, 0);
  }
};

emitter.addListener('NativeTimeout', handleTimeout);

export function nativeSetTimeout(
  callback: () => void,
  delayMs: number,
): TimeoutId {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  callbacks.set(id, callback);
  NativeTimeouts.setTimeout(Math.max(0, Math.trunc(delayMs)), id);
  return id;
}

export function nativeClearTimeout(id: TimeoutId): void {
  callbacks.delete(id);
  NativeTimeouts.clearTimeout(id);
}

export function nativeClearAll(): void {
  callbacks.clear();
  NativeTimeouts.clearAll?.();
}
