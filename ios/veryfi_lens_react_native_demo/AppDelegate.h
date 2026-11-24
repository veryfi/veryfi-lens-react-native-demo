#import <RCTDefaultReactNativeFactoryDelegate.h>
#import <RCTReactNativeFactory.h>
#import <UIKit/UIKit.h>

@interface ReactNativeDelegate : RCTDefaultReactNativeFactoryDelegate
@end

@interface AppDelegate : UIResponder <UIApplicationDelegate>

@property (nonatomic, strong) ReactNativeDelegate *reactNativeDelegate;
@property (nonatomic, strong) RCTReactNativeFactory *reactNativeFactory;

@end
