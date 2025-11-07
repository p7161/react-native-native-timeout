#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(NativeTimeouts, RCTEventEmitter)
RCT_EXTERN_METHOD(setTimeout:(nonnull NSNumber *)delayMs id:(nonnull NSString *)identifier)
RCT_EXTERN_METHOD(clearTimeout:(nonnull NSString *)identifier)
RCT_EXTERN_METHOD(clearAll)
@end
