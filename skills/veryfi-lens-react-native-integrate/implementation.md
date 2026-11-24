# Configure, events, callbacks, files, entry points

Public object: default export of `@veryfi/react-native-veryfi-lens` (`src/index.tsx`). Credential and settings values are plain objects. Event names are `VeryfiLens.Events`.

## Credentials

```javascript
const credentials = {
  url: 'https://api.veryfi.com/',
  clientId: clientId,
  userName: username,
  apiKey: apiKey,
};
```

`userName` is the key both bridges read. Android uses `credentials.getString("userName")` and force-unwraps it. A missing key crashes that path. iOS builds `VeryfiLensCredentials(with:)`. Store secrets in the host's secure config, not in git.

Empty credentials on iOS surface as `veryfiLensError` with `msg` `invalid_credentials` when the native SDK validates them. Android has no `invalid_credentials` delegate error; an unusable configuration yields the configure callback `false` and/or a Toast. The plugin forwards that callback. Present only when it is `true`.

## Listen first

iOS `veryfiLensClose`, `veryfiLensError`, `veryfiLensSuccess`, `veryfiLensUpdate`, analytics, and `onHelpButtonClicked` call `sendEvent` only when `hasListeners` is true. `hasListeners` becomes true in the iOS `startObserving` override, which React Native's emitter invokes when a listener is added. Subscribe before `configureWithCredentials` returns and before the camera opens.

```javascript
import { NativeEventEmitter } from 'react-native';
import VeryfiLens from '@veryfi/react-native-veryfi-lens';

const emitter = new NativeEventEmitter(VeryfiLens.NativeModule);

const subscriptions = [
  emitter.addListener(VeryfiLens.Events.onVeryfiLensClose, (event) => {}),
  emitter.addListener(VeryfiLens.Events.onVeryfiLensUpdate, (event) => {}),
  emitter.addListener(VeryfiLens.Events.onVeryfiLensError, (event) => {}),
  emitter.addListener(VeryfiLens.Events.onVeryfiLensSuccess, (event) => {}),
];

VeryfiLens.configureWithCredentials(credentials, settings, (ok) => {
  if (ok) VeryfiLens.showCamera();
});
```

Do not construct `new NativeEventEmitter(VeryfiLens)`. Do not call `VeryfiLens.getConstants()`. The README does both. `Events` already holds the strings. `constantsToExport` on iOS and `getConstants` on Android exist for the native module; the JavaScript wrapper does not expose `getConstants` on the default export.

Remove subscriptions with `subscription.remove()` when the screen unmounts. That is how React Native drives the emitter. `VeryfiLens.stopObserving` is exported and calls `NativeModule.stopObserving()`. The iOS override sets `hasListeners = false`, which drops later events. `VeryfiLens.m` does not declare `startObserving` or `stopObserving` as `RCT_EXTERN_METHOD`, so whether the JavaScript call reaches that override is **Unconfirmed**. Do not call them from host code.

Android `addListener` / `removeListeners` only log. Android `sendEvent` does not check a listener flag. iOS is the platform that drops events when nobody is listening.

## Configure

```javascript
VeryfiLens.configureWithCredentials(credentials, settings, (ok) => {
  if (ok) {
    VeryfiLens.showCamera();
  }
});
```

The third argument is optional in `src/index.tsx`. If omitted, the wrapper passes an empty callback and the host cannot see success. Always pass a callback and branch on it.

| | iOS `VeryfiLens.swift` | Android `VeryfiLensModule.kt` |
|--|------------------------|-------------------------------|
| Delegate | Set **before** `configure` | `setDelegate` runs **after** `VeryfiLens.configure` is invoked, and only when `currentActivity` and its `application` are non-null |
| Completion | `completion([success])` — one boolean argument | `completion?.invoke(result)` — the native boolean |
| No activity | `showCamera` returns if there is no key-window root view controller | Configure emits `onVeryfiLensError` with `status` `error` and does **not** invoke the completion callback |
| Settings parse | `VeryfiLensSettings(with:)` | `initWithJsonObject`. `JSONException` emits `onVeryfiLensError`, then configure still runs with whatever settings object exists |
| `showInfoButton` | If the value is an `NSNumber` (JavaScript bool or number), replace with `VeryfiInfoView()` — an empty view | If the key is present, any type, set `showInfoButton = Fragment()` |

Omit `showInfoButton`. It does not embed a React component.

## Events

| `VeryfiLens.Events` | Native delegate |
|---------------------|-----------------|
| `onVeryfiLensClose` | `veryfiLensClose` |
| `onVeryfiLensUpdate` | `veryfiLensUpdate` |
| `onVeryfiLensSuccess` | `veryfiLensSuccess` |
| `onVeryfiLensError` | `veryfiLensError` |
| `onVeryfiLensAnalytics` | analytics notification, after `observeAnalyticsEvents()` |
| `onHelpButtonClicked` | `onHelpButtonClicked` |

The bridge does not rename JSON keys. The README documents this subset. Extra native keys can appear because the JSON is not filtered. Do not invent keys beyond this subset.

| Moment | README fields |
|--------|----------------|
| Close | `session_scan_count`, `queue_count`, `framework-version`, `framework-build` |
| Update image | `msg` `img_thumbnail_path`, `img_original_path`, or `img_stitched_pdf_path`; `data` path; `package_id`; `status` `inprogress` |
| Update progress | `msg` `progress`; `data` percent; `status` `inprogress` |
| Update cleared | `msg` `clear_package`; `status` `removed` |
| Success | `msg` `results`; `data`; `package_id`; `status` `done` |
| Error | `status` `error` plus `error`, or `status` `exception` plus `exception`; `package_id` |

Package success uses `status` `"done"`. Barcode and OCR successes from the native SDK pass their result JSON directly, without that envelope. Do not require `status === "done"` for those types.

Native failure status differs and the plugin does not rewrite it: iOS uses `"fail"`; Android uses `"failed"`. The README's `"error"` / `"exception"` rows are the documented subset, not a filter.

Android configure-time failures that this module builds itself use `status` `"error"` and `error`.

## Analytics

```javascript
emitter.addListener(VeryfiLens.Events.onVeryfiLensAnalytics, (event) => {});
VeryfiLens.observeAnalyticsEvents();
```

| | iOS | Android |
|--|-----|---------|
| Source | `NotificationCenter` name `VeryfiLensAnalyticsEvent` | Broadcast `com.veryfi.lens.VeryfiLensSecureAnalyticsEvent` with permission `{package}.permission.ANALYTICS_EVENT` |
| Gate | Forwarded only when `hasListeners` is true | Always `sendEvent` |
| Body | The notification object when it is a dictionary | `{ event, params }` where `params` is `{ [params extra]: value extra }` |

Call `observeAnalyticsEvents` once. Both bridges remove a previous observer before adding another.

## Files

`getFileBase64` takes the path string (`event.data`), then an error callback, then a success callback. It does not take the whole event.

```javascript
if (event.msg === 'img_original_path') {
  VeryfiLens.getFileBase64(
    event.data,
    (err) => {},
    (b64) => {}
  );
}
```

Empty or unreadable path: error callback `"Empty data in filePath"`. iOS encodes with `VeryfiLens.shared().utils.base64`. Android uses `android.util.Base64`.

`autoDeleteLocalResourcesAfterProcessing` defaults true in the native SDK: after a package finishes, Lens deletes that package's local files. A single sequential scan can still copy from `update` immediately. If the host reads paths later, or keeps more than one package, set the flag false. The host then owns deletion.

`clearLensStorage()` is a native util. This plugin does not export it. Do not invent a delete method. Say the host deletes the paths it kept, or that storage cleanup is unbridged.

`msg` `clear_package` with `status` `removed` means Lens cleared that package's assets. Do not read those paths afterward.

## Entry points

Use one presentation after configure succeeds. Do not stack `showCamera` with `showGallery` or `showDocumentBrowser` for the same session.

| Need | Call | Notes |
|------|------|--------|
| Lens camera | `VeryfiLens.showCamera()` | iOS presents from the key-window root view controller and returns if that is missing. Android calls `VeryfiLens.showCamera()` with no arguments |
| Photo library | `VeryfiLens.showGallery()` | Separate from `galleryIsOn`. `galleryIsOn` is the gallery control **inside** the camera |
| Files / document browser | `VeryfiLens.showDocumentBrowser()` | Standalone. Does not require `browseIsOn` |
| Dismiss camera | `VeryfiLens.closeCamera()` | iOS `closeCamera(in:)`. Android `VeryfiLens.closeCamera()` |

In-camera files, independent of those methods:

- More menu Browse: `moreMenuIsOn` true and `browseIsOn` true. Base recipes set `moreMenuIsOn` false, so this row is hidden.
- Top-right Files button: `showBrowserButton` true. Does not require `browseIsOn`.
- Gallery control Photos/Files menu: `galleryIsOn` true and `galleryButtonWithFilesIsOn` true.

`browseIsOn` is not a global import gate.

## Retry, discard, OCR feedback

```javascript
VeryfiLens.retryPackage(packageId, metadataObject, imageSourceTag);
VeryfiLens.retryAllPackages();
VeryfiLens.discardPackage(packageId);
VeryfiLens.discardAllPackages();
VeryfiLens.shareOCRFeedback();
```

| | iOS | Android |
|--|-----|---------|
| `retryPackage` | `utils.retryPackage(with:metadata:imageSourceTag:)` uses all three JavaScript arguments | Kotlin method is `fun retryPackage(packageID: String)` and calls `VeryfiLens.retryUpload(packageID)`. Extra arguments are not on that method |
| Retry all | `utils.retryAllPackages()` | `VeryfiLens.retryAll()` |
| Discard | `utils.discardPackage` / `discardAllPackages` | `discardUpload` / `discardAll` |

Do not rely on Android retry metadata. Pass the three arguments anyway so iOS receives them. There is no success callback on these methods.

## Help screen

`onHelpButtonClicked` fires when the native Help control calls the delegate. On iOS, that path is used when `showHelpButton` is true and `showDefaultScanningGuide` is false (Help wins the shared camera control; the built-in guide is the other mode). The plugin stores the presenting controller (iOS) or parent fragment (Android) and emits the event with a null body.

Then:

```javascript
emitter.addListener(VeryfiLens.Events.onHelpButtonClicked, () => {
  VeryfiLens.showHelpScreen('HelpComponentName');
});
```

`showHelpScreen` presents a React Native root view registered under that component name. It is not a `VeryfiInfoView`. iOS presents a page sheet from the controller captured by the help callback; if that controller or the root view is missing, the method returns. The `isNewArchEnabled` argument is accepted and not used in `showHelpComponent`. Android starts `ContainerActivity` and, when the flag is true, uses the new-architecture `ReactHost`. Keep new architecture off, so that branch should not run.

`closeHelpScreen()` dismisses that UI (iOS dismiss, Android `finish` on the help activity).

`showHelpButton` and `showInfoButton` share one camera control on iOS. Help wins. Do not set both. `cameraInfoView` and `utils.updateCameraInfoView` are not bridged.

## Decoupled capture

`dataExtractionEngine: "none"` means Lens does not call Process a Document.

- Local package: `uploadWithoutProcessingIsOn: false` and `autoDeleteLocalResourcesAfterProcessing: false`. Success `data` can include `local_package_path`. The host uploads and processes.
- Remote package: `uploadWithoutProcessingIsOn: true` (still with `"none"`). Lens uploads and does not extract. Success `data` keeps `bucket` and `package_path`.

Cloud-only response flags do not shape the customer's later API request.
