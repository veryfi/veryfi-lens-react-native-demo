# Call syntax

Settings values live in [recipes.md](recipes.md). This file is only the call shape verified in the pinned sources. Absent methods are in [parity.md](parity.md).

Credential JSON keys for Cordova, React Native, Flutter, and Capacitor:

```json
{ "url": "https://api.veryfi.com/", "clientId": "...", "userName": "...", "apiKey": "..." }
```

`userName` is the key the native dictionaries read (`Keys.userName` on iOS, `rawCredentials["userName"]` on Flutter/Capacitor Android). MAUI uses C# `Username`, which the bridge passes as the native username argument.

## Cordova

Package in source: `@veryfi/cordova-plugin-veryfi-lens` `2.6.60`. Plugin id: `cordova-plugin-veryfi-lens`. JS clobber: `cordova.plugins.Veryfi`.

Install command printed in the plugin README (private git, not an npm install line):

```sh
cordova plugin add ssh://bitbucket.org/veryfi/cordova-plugin-veryfi-lens.git#[VERSION] --save
```

Configure stores credentials. It does not open the camera. `showCamera` sends them to native, configures, and presents. Events return as **JSON strings** on that success callback. Parse, then switch on `event`.

```javascript
cordova.plugins.Veryfi.Lens.init(false, url, clientId, username, apiKey, settings);
cordova.plugins.Veryfi.Lens.showCamera(function (response) {
  var json = JSON.parse(response);
  // json.event: veryfi_lens_close | veryfi_lens_update | veryfi_lens_error | veryfi_lens_success
}, function (error) {});
```

`getFileBase64` expects an object whose `data` field is a file path (the update payload already has that field):

```javascript
cordova.plugins.Veryfi.Lens.getFileBase64(jsonObject, function (b64) {}, function (error) {});
```

Other exported functions: `retryPackage(packageID, success, error)`, `retryAllPackages(success, error)`, `discardPackage(packageID, success, error)`, `discardAllPackages(success, error)`, `shareOCRFeedback(success, error)`, `observeAnalyticsEvents(success, error)`, `getAuth()`, `getSettings()`.

Analytics is a **second** success callback, not the camera callback. Native adds no `event` wrapper on iOS beyond the notification JSON; Android builds `{ event, params }`.

No `showGallery`, `showDocumentBrowser`, `closeCamera`, or `uploadImages` in `www/veryfi.js`.

## React Native

Package: `@veryfi/react-native-veryfi-lens` `2.0.62`.

README install:

```sh
yarn add ssh://bitbucket.org/veryfi/react-native-veryfi-lens.git#[VERSION]
```

Import the default export from `src/index.tsx`. Register listeners on `VeryfiLens.NativeModule` **before** `showCamera`. iOS `sendEvent` runs only when `hasListeners` is true, so a late listener misses events.

```javascript
import { NativeEventEmitter } from 'react-native';
import VeryfiLens from '@veryfi/react-native-veryfi-lens';

const emitter = new NativeEventEmitter(VeryfiLens.NativeModule);
emitter.addListener(VeryfiLens.Events.onVeryfiLensClose, (e) => {});
emitter.addListener(VeryfiLens.Events.onVeryfiLensUpdate, (e) => {});
emitter.addListener(VeryfiLens.Events.onVeryfiLensError, (e) => {});
emitter.addListener(VeryfiLens.Events.onVeryfiLensSuccess, (e) => {});
emitter.addListener(VeryfiLens.Events.onVeryfiLensAnalytics, (e) => {});
emitter.addListener(VeryfiLens.Events.onHelpButtonClicked, () => {});

VeryfiLens.configureWithCredentials(credentials, settings, (ok) => {
  if (ok) VeryfiLens.showCamera();
});
```

Event names: `onVeryfiLensClose`, `onVeryfiLensError`, `onVeryfiLensSuccess`, `onVeryfiLensUpdate`, `onVeryfiLensAnalytics`, `onHelpButtonClicked`.

The README's `new NativeEventEmitter(VeryfiLens)` and `VeryfiLens.getConstants()` do not match `src/index.tsx`. Use `Events` and `NativeModule`.

`getFileBase64(filePath, errorCallback, successCallback)` takes the path string (`event.data`), not the whole event.

Also exported: `closeCamera`, `showGallery`, `showDocumentBrowser`, `retryPackage(packageID, metadata, imageSourceTag)`, `retryAllPackages`, `shareOCRFeedback`, `discardPackage(packageID)`, `discardAllPackages`, `observeAnalyticsEvents`, `showHelpScreen(componentName)`, `closeHelpScreen`, `startObserving`, `stopObserving`.

Android `retryPackage` is declared as `packageID` only. The JS wrapper still passes metadata and `imageSourceTag`. iOS uses all three.

## Flutter

Package name `veryfi`, version `2.0.59`. Import `package:veryfi/lens.dart`. `pubspec.yaml` environment: Dart `sdk: ^3.11.0`, Flutter `>=3.41.0`.

README git dependency:

```yaml
dependencies:
  veryfi:
    git:
      url: git@bitbucket.org:veryfi/flutter-plugin-veryfi-lens.git
      ref: [VERSION]
```

The README's `VeryfiLensCredentials` / `VeryfiLensSettings` classes are **not** in `lib/lens.dart`. Pass maps.

```dart
import 'package:veryfi/lens.dart';

Veryfi.setDelegate((LensEvent event, Map<String, dynamic> response) {
  // LensEvent.close | error | success | update
});
await Veryfi.initLens(
  {'url': url, 'clientId': clientId, 'userName': username, 'apiKey': apiKey},
  settings,
);
await Veryfi.showCamera();
```

Native method names: `veryfiLensClose`, `veryfiLensError`, `veryfiLensSuccess`, `veryfiLensUpdate`.

`Veryfi.observeAnalyticsEvents()` listens on `EventChannel('lens_analytics_events')` and exposes `Veryfi.analyticsStream`.

Also on `Veryfi`: `retryPackage(packageID, metadata, imageSourceTag)`, `retryAllPackages`, `discardPackage(packageID)`, `discardAllPackages`, `shareOCRFeedback`.

Dart sends the tag as channel key `imageSourceData`. iOS reads `imageSourceTag`, so this call returns `retryPackageError` on iOS in the pinned plugin. Android uses `packageID` only.

No gallery, document browser, close, upload, or base64 method in `lens.dart`.

Pinned iOS and Android `initLens` implementations do not call the method-channel success result. See [troubleshooting.md](troubleshooting.md).

## Capacitor

`package.json` name: `@veryfi/veryfi-lens-capacitor` `2.0.61`. README says `npm install veryfi-lens-capacitor`, which is not that name. Prefer the `package.json` name. Plugin id registered in `src/index.ts`: `VeryfiLensCapacitor`.

```typescript
import { VeryfiLensCapacitor } from '@veryfi/veryfi-lens-capacitor';

await VeryfiLensCapacitor.veryfiInitLens({ credentials, settings });
await VeryfiLensCapacitor.setLensEventDelegate();
await VeryfiLensCapacitor.addListener('veryfiLensClose', (data) => {});
await VeryfiLensCapacitor.addListener('veryfiLensUpdate', (data) => {});
await VeryfiLensCapacitor.addListener('veryfiLensError', (data) => {});
await VeryfiLensCapacitor.addListener('veryfiLensSuccess', (data) => {});
await VeryfiLensCapacitor.addListener('veryfiLensAnalytics', (data) => {});
await VeryfiLensCapacitor.showCamera();
```

`setLensEventDelegate` is what assigns the native Lens delegate. `addListener` only subscribes to Capacitor notifications. Call both.

Also in `definitions.ts`: `retryPackage({ packageID, metadata, imageSourceTag })`, `retryAllPackages`, `shareOCRFeedback`, `discardPackage({ packageID })`, `discardAllPackages`, `observeAnalyticsEvents`.

iOS retry requires `packageID`, `metadata`, and `imageSourceTag`. Android retry reads `packageID` only.

`src/web.ts` methods are empty. Web is not a Lens runtime.

The README docgen index omits retry, discard, share, analytics, and `observeAnalyticsEvents`. `definitions.ts` is the contract.

## MAUI

NuGet `PackageId` is `VeryfiLens.Maui`, version `2.0.60` in `VeryfiLens.Sdk.csproj`. API type is `VeryfiLens.VeryfiLensBinding`. The sample uses that type. The class comment mentions `using VeryfiLens = VeryfiLens.VeryfiLensBinding`. The README's `VeryfiLens.Sdk.VeryfiLens` was not found as a type in this commit.

```csharp
using VeryfiLens;

VeryfiLensBinding.SetDelegate(delegateInstance);
VeryfiLensBinding.SetAnalyticsDelegate(analyticsInstance);
VeryfiLensBinding.Configure(credentials, settings, success =>
{
    if (success) VeryfiLensBinding.ShowCamera(page);
});
VeryfiLensBinding.ObserveAnalyticsEvents();
```

`VeryfiLensCredentials` properties: `ClientId`, `Username`, `ApiKey`, `Url`.

Delegate: `IVeryfiLensDelegate.OnClose`, `OnError`, `OnSuccess`, `OnUpdate` with `Dictionary<string, object>`. There is no added `event` string. Analytics: `IVeryfiLensAnalyticsDelegate.OnAnalyticsEvent(eventName, paramsJson, value)`.

Also exported: `ShowGallery(page)`, `ShowDocumentBrowser(page)`, `CloseCamera(page)`, `Retry(packageId, metadataJson = "{}", imageSourceTag = "")`, `RetryAll()`, `UploadImages(paths, isSameTransaction = false)`, `StopObservingAnalyticsEvents()`.

Android `Retry` ignores `metadataJson` and `imageSourceTag`. iOS uses both. Android `UploadImages` passes `isSameTransaction`. iOS `UploadImages` does not.

Android `Configure` invokes the completion with `true` after calling the bridge. It does not forward a native success flag. iOS forwards the native completion bool.

No discard, share OCR, or `getFileBase64` on `VeryfiLensBinding`.

Legacy bindings live under `VeryfiNetBinding/` (`namespace VeryfiLensiOS` in `ApiDefinition.cs`). They are a different API. Do not mix them with `VeryfiLensBinding`.
