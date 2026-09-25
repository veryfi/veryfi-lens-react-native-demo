#import "SceneDelegate.h"

#import "AppDelegate.h"

@implementation SceneDelegate

- (void)scene:(UIScene *)scene
    willConnectToSession:(UISceneSession *)session
                 options:(UISceneConnectionOptions *)connectionOptions
{
  if (![scene isKindOfClass:[UIWindowScene class]]) {
    return;
  }

  AppDelegate *appDelegate = (AppDelegate *)UIApplication.sharedApplication.delegate;
  self.window = [[UIWindow alloc] initWithWindowScene:(UIWindowScene *)scene];

  NSMutableDictionary *launchOptions = [NSMutableDictionary new];
  NSURL *url = connectionOptions.URLContexts.anyObject.URL;
  if (url != nil) {
    launchOptions[UIApplicationLaunchOptionsURLKey] = url;
  }

  [appDelegate.reactNativeFactory startReactNativeWithModuleName:@"veryfi_lens_react_native_demo"
                                                         inWindow:self.window
                                                    launchOptions:launchOptions];
}

@end
