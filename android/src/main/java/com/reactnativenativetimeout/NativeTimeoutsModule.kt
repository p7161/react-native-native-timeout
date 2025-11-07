package com.reactnativenativetimeout

import android.os.Handler
import android.os.Looper
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.util.concurrent.ConcurrentHashMap
import kotlin.math.max

class NativeTimeoutsModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  private val handler = Handler(Looper.getMainLooper())
  private val tasks = ConcurrentHashMap<String, Runnable>()

  override fun getName(): String = "NativeTimeouts"

  private fun sendTimeoutFired(id: String) {
    val eventEmitter = reactApplicationContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
    val payload = Arguments.createMap().apply { putString("id", id) }
    eventEmitter.emit("NativeTimeout", payload)
  }

  @ReactMethod
  fun setTimeout(delayMs: Double, id: String) {
    clearTimeout(id)

    val runnable = Runnable {
      tasks.remove(id)
      sendTimeoutFired(id)
    }

    tasks[id] = runnable
    val safeDelay = if (delayMs.isNaN()) 0L else max(0L, delayMs.toLong())
    handler.postDelayed(runnable, safeDelay)
  }

  @ReactMethod
  fun clearTimeout(id: String) {
    tasks.remove(id)?.let { runnable ->
      handler.removeCallbacks(runnable)
    }
  }

  @ReactMethod
  fun clearAll() {
    tasks.values.forEach { runnable ->
      handler.removeCallbacks(runnable)
    }
    tasks.clear()
  }

  override fun invalidate() {
    clearAll()
    super.invalidate()
  }
}
