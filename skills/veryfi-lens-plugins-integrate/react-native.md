# React Native

Public surface: default export of `react-native-veryfi-lens/src/index.tsx`. Package `@veryfi/react-native-veryfi-lens` `2.0.62`. Native module name `VeryfiLens` (`RCT_EXTERN_REMAP_MODULE` and Android `getName()`). Commit in [sources.md](sources.md).

Ignore `lib/typescript/index.d.ts` when it disagrees with `src/index.tsx`. That `.d.ts` lists `setInfoView` and omits `closeCamera`. `setInfoView` is not a method in `src/index.tsx` or `VeryfiLens.swift`.

Android `com.veryfi.lens:veryfi-lens-sdk:2.7.0.4`, `minSdkVersion` 24. iOS is a vendored `Frameworks/VeryfiLens.xcframework` (podspec). That file name is shared by several UI flavors; this pack did not unpack it. No Receipts/Checks/Lite/Headless pod is selected. Recipes: [recipes.md](recipes.md).

## Install

```sh
yarn add ssh://bitbucket.org/veryfi/react-native-veryfi-lens.git#[VERSION]
```

README requires `ENV['RCT_NEW_ARCH_ENABLED'] = '0'` in the Podfile and `newArchEnabled=false` in `android/settings.gradle`. It also documents an Info.plist set (photo library add, photo library, speech, location always, location when in use, contacts, calendars). Add camera usage as well if the host plist does not already have `NSCameraUsageDescription`; the README block quoted in source does not include it. Add location, speech, contacts, or calendars only when the recipe uses those features. Base recipe leaves them off.

## Configure, listen, present

iOS drops events unless `hasListeners` is already true. Subscribe first.

```javascript
import { NativeEventEmitter } from 'react-native';
import VeryfiLens from '@veryfi/react-native-veryfi-lens';

const emitter = new NativeEventEmitter(VeryfiLens.NativeModule);
const sub = emitter.addListener(VeryfiLens.Events.onVeryfiLensUpdate, (event) => {
  if (event.msg === 'img_original_path') {
    VeryfiLens.getFileBase64(event.data, (err) => {}, (b64) => {});
  }
});
emitter.addListener(VeryfiLens.Events.onVeryfiLensSuccess, (event) => {});
emitter.addListener(VeryfiLens.Events.onVeryfiLensError, (event) => {});
emitter.addListener(VeryfiLens.Events.onVeryfiLensClose, (event) => {});

const credentials = {
  url: 'https://api.veryfi.com/',
  clientId: clientId,
  userName: username,
  apiKey: apiKey,
};

VeryfiLens.configureWithCredentials(credentials, settings, (ok) => {
  if (ok) VeryfiLens.showCamera();
});
```

Event constants: `onVeryfiLensClose`, `onVeryfiLensError`, `onVeryfiLensSuccess`, `onVeryfiLensUpdate`, `onVeryfiLensAnalytics`, `onHelpButtonClicked`.

Do not use the README's `new NativeEventEmitter(VeryfiLens)` or `getConstants()`.

## Other calls

```javascript
VeryfiLens.showGallery();
VeryfiLens.showDocumentBrowser();
VeryfiLens.closeCamera();
VeryfiLens.retryPackage(packageId, metadataObject, imageSourceTag);
VeryfiLens.retryAllPackages();
VeryfiLens.discardPackage(packageId);
VeryfiLens.discardAllPackages();
VeryfiLens.shareOCRFeedback();
VeryfiLens.observeAnalyticsEvents();
VeryfiLens.showHelpScreen('HelpComponentName');
VeryfiLens.closeHelpScreen();
```

Use one of `showCamera`, `showGallery`, or `showDocumentBrowser` for a presentation. `galleryIsOn` does not call `showGallery`.

`retryPackage` on Android is `fun retryPackage(packageID: String)`. Extra JS arguments are not on that Kotlin method. iOS uses metadata and `imageSourceTag`.

`showHelpScreen` in `src/index.tsx` passes `global.nativeFabricUIManager !== undefined` as the second native argument. Call it with the component name only.

`startObserving` and `stopObserving` are exported and map to the emitter's listener flag. Prefer `addListener` / `subscription.remove()` so React Native drives that flag. Calling `stopObserving` while listeners exist will make iOS drop events (`hasListeners` becomes false).

## Help versus info view

`onHelpButtonClicked` fires when the native Help control is used and `showDefaultScanningGuide` is false (iOS behavior). Then call `showHelpScreen`. That is a React Native root view, not a `VeryfiInfoView`.

If settings contain `showInfoButton` as a bool, the bridge does **not** embed host UI. iOS replaces it with `VeryfiInfoView()`. Android replaces it with `Fragment()`. Omit the key unless that empty native view is intended. See [unbridged.md](unbridged.md).

## Not on this plugin

`uploadImages`, `headlessUpload`, Headless `process`, Lite, MAUI-style `UploadImages`. Discard and share OCR **are** exported here.
