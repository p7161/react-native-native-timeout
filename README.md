# react-native-native-timeout

Native-backed replacements for `setTimeout`/`clearTimeout` that remain completely under native control until the timer fires. The module keeps the JavaScript callbacks on the JS side and uses events to notify about completed timers, so the native runtime never stores or executes JS closures.

## Why?

JavaScript timers are paused alongside the bridge when your React Native application is backgrounded or the JS thread is busy. When you need a timeout that is scheduled by the platform and stays alive even if the JS runtime idles, `react-native-native-timeout` gives you a thin, type-safe abstraction.

- ✅ Works on iOS (Swift) and Android (Kotlin)
- ✅ No JS callbacks stored in native land
- ✅ Identical API surface across platforms
- ✅ Fully typed and tested

> **Heads up:** the module does **not** wake the process up from background/Doze/Suspended states. Platform power saving policies still apply.

## Requirements

- React Native >= 0.71
- iOS 12+ / Android 5.0+

## Installation

```bash
npm install react-native-native-timeout
# or
yarn add react-native-native-timeout

# iOS
cd ios && pod install
```

Autolinking will register both native modules. Rebuild your native apps afterwards.

## Usage

```ts
import {
  nativeSetTimeout,
  nativeClearTimeout,
  nativeClearAll,
  TimeoutId,
} from 'react-native-native-timeout';

const id: TimeoutId = nativeSetTimeout(() => {
  console.log('Fired after 1 second');
}, 1000);

// Cancel a specific timeout
nativeClearTimeout(id);

// Optionally remove every pending timeout on both native platforms
nativeClearAll();
```

### API

| Function | Description |
| -------- | ----------- |
| `nativeSetTimeout(cb, delayMs)` | Registers a callback that will be invoked when the native timer fires. Returns a unique `TimeoutId`. Negative delays are clamped to `0`. Duplicate IDs are automatically cleared before rescheduling on the native side. |
| `nativeClearTimeout(id)` | Cancels a single timeout on both the JS and native sides. |
| `nativeClearAll()` | Clears every pending timeout. Provided for convenience; `NativeTimeouts.clearAll` is optional in case a platform does not expose the method. |

The module also emits a single native event, `NativeTimeout`, whose payload is `{ id: string }`. You only need to interact with this if you are building your own bridge—`nativeSetTimeout` already wires everything up.

### Behaviour in background

- **iOS:** timers are driven by `DispatchSourceTimer` on the main queue. When the app transitions to the *suspended* state, iOS may delay or completely skip execution until the app returns to the foreground. The module does not attempt to keep the process alive.
- **Android:** timers use a `Handler` that posts to the main `Looper`. Under Doze/App Standby modes Android can defer callbacks. The module does not use foreground services or alarms.

## Example app

The repository ships with an example React Native app under [`example/`](example/). It demonstrates two buttons:

- **Start 1s timeout** – schedules a timeout and logs when it fires.
- **Cancel** – cancels the pending timeout if any.

Run it the same way as any autolinked RN sample:

```bash
cd example
npm install
npm run ios    # requires a running simulator
npm run android
```

## Development

- `npm run typecheck`
- `npm run lint`
- `npm test`

## License

MIT
