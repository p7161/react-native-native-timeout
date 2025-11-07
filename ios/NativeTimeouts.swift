import Foundation
import React

@objc(NativeTimeouts)
class NativeTimeouts: RCTEventEmitter {
  private var timers = [String: DispatchSourceTimer]()

  override static func requiresMainQueueSetup() -> Bool {
    true
  }

  override func supportedEvents() -> [String]! {
    ["NativeTimeout"]
  }

  @objc(setTimeout:id:)
  func setTimeout(_ delayMs: NSNumber, id: NSString) {
    executeOnMain { [weak self] in
      guard let self = self else { return }

      let identifier = id as String
      if let existing = self.timers.removeValue(forKey: identifier) {
        existing.cancel()
      }

      let timer = DispatchSource.makeTimerSource(flags: [], queue: DispatchQueue.main)
      let delaySeconds = max(0, delayMs.doubleValue) / 1000.0
      let deadline = DispatchTime.now() + delaySeconds

      timer.schedule(deadline: deadline, leeway: .milliseconds(1))
      timer.setEventHandler { [weak self, weak timer] in
        guard let self = self else { return }
        self.timers.removeValue(forKey: identifier)
        self.sendEvent(withName: "NativeTimeout", body: ["id": identifier])
        timer?.cancel()
      }

      self.timers[identifier] = timer
      timer.resume()
    }
  }

  @objc(clearTimeout:)
  func clearTimeout(_ id: NSString) {
    executeOnMain { [weak self] in
      guard let self = self else { return }
      let identifier = id as String
      if let timer = self.timers.removeValue(forKey: identifier) {
        timer.cancel()
      }
    }
  }

  @objc(clearAll)
  func clearAll() {
    executeOnMain { [weak self] in
      guard let self = self else { return }
      for (_, timer) in self.timers {
        timer.cancel()
      }
      self.timers.removeAll()
    }
  }

  override func stopObserving() {
    // no-op
  }

  deinit {
    if Thread.isMainThread {
      for (_, timer) in timers {
        timer.cancel()
      }
      timers.removeAll()
    } else {
      clearAll()
    }
  }

  private func executeOnMain(_ block: @escaping () -> Void) {
    if Thread.isMainThread {
      block()
    } else {
      DispatchQueue.main.async(execute: block)
    }
  }
}
