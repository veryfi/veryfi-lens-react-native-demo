# API and settings parity

Pinned commits are in [sources.md](sources.md). "Yes" means the method is on the public plugin surface (JS, Dart, TS, or `VeryfiLensBinding`), not merely on the native SDK inside the plugin.

## Presentation and lifecycle

| Call | Cordova | React Native | Flutter | Capacitor | MAUI |
|------|---------|--------------|---------|-----------|------|
| Configure / init | `Lens.init` then native configure inside `showCamera` | `configureWithCredentials` | `Veryfi.initLens` | `veryfiInitLens` | `Configure` |
| Camera | `showCamera` | `showCamera` | `showCamera` | `showCamera` | `ShowCamera` |
| Gallery | No | `showGallery` | No | No | `ShowGallery` |
| Document browser | No | `showDocumentBrowser` | No | No | `ShowDocumentBrowser` |
| Close camera | No | `closeCamera` | No | No | `CloseCamera` |
| UI SDK `uploadImages` | No | No | No | No | `UploadImages` |
| iOS `headlessUpload` | No | No | No | No | No |
| Headless `process` | No | No | No | No | No |
| Delegate / listeners | One `showCamera` success callback | `NativeEventEmitter` + `Events` | `setDelegate` + `LensEvent` | `setLensEventDelegate` + `addListener` | `SetDelegate` |
| Analytics | `observeAnalyticsEvents` | `observeAnalyticsEvents` + `onVeryfiLensAnalytics` | `observeAnalyticsEvents` + `analyticsStream` | `observeAnalyticsEvents` + `veryfiLensAnalytics` | `ObserveAnalyticsEvents` / `StopObservingAnalyticsEvents` |
| Retry one | `retryPackage(id)` | `retryPackage(id, metadata, tag)` | `retryPackage(id, metadata, tag)` | `retryPackage({packageID, metadata, imageSourceTag})` | `Retry(id, metadataJson, tag)` |
| Retry all | Yes | Yes | Yes | Yes | `RetryAll` |
| Discard one / all | Yes | Yes | Yes | Yes | No |
| Share OCR feedback | Yes | Yes | Yes | Yes | No |
| File base64 | `getFileBase64(objectWithData)` | `getFileBase64(path, err, ok)` | No | No | No |
| Help button event | No | `onHelpButtonClicked` | No | No | No |
| Show host help UI | No | `showHelpScreen` / `closeHelpScreen` | No | No | No |

Retry metadata is not equal across platforms:

| Plugin | iOS bridge | Android bridge |
|--------|------------|----------------|
| Cordova | Native reads package id, metadata, and image source tag. JS passes only the id string into `exec` | `retryUpload(id)` |
| React Native | Uses all three JS arguments | Kotlin method is `retryPackage(packageID)` only |
| Flutter | Reads `imageSourceTag`. Dart sends `imageSourceData`, so iOS returns `retryPackageError` | `retryUpload(packageID)` only |
| Capacitor | Requires all three or rejects | `getString("packageID")` only |
| MAUI | Parses `metadataJson` and passes `imageSourceTag` | `Retry(packageId)` only |

`UploadImages` second argument `isSameTransaction` is passed on MAUI Android and ignored on MAUI iOS.

## Events

Native Lens delegate JSON is forwarded. Cordova adds an `event` string on the camera callback. The others use the channel name instead of that field.

| Native delegate | Cordova `event` | React Native | Flutter | Capacitor | MAUI |
|-----------------|-----------------|--------------|---------|-----------|------|
| `veryfiLensClose` | `veryfi_lens_close` | `onVeryfiLensClose` | `LensEvent.close` | `veryfiLensClose` | `OnClose` |
| `veryfiLensUpdate` | `veryfi_lens_update` | `onVeryfiLensUpdate` | `LensEvent.update` | `veryfiLensUpdate` | `OnUpdate` |
| `veryfiLensSuccess` | `veryfi_lens_success` | `onVeryfiLensSuccess` | `LensEvent.success` | `veryfiLensSuccess` | `OnSuccess` |
| `veryfiLensError` | `veryfi_lens_error` | `onVeryfiLensError` | `LensEvent.error` | `veryfiLensError` | `OnError` |
| Analytics notification | `observeAnalyticsEvents` callback | `onVeryfiLensAnalytics` | `analyticsStream` | `veryfiLensAnalytics` | `OnAnalyticsEvent` |
| `onHelpButtonClicked` | No | `onHelpButtonClicked` | No | No | No |

Fields the Cordova, React Native, and Flutter READMEs document (the bridge does not rename them):

| Moment | Fields the READMEs name |
|--------|-------------------------|
| Close | `session_scan_count`, `queue_count`, `framework-version`, `framework-build` |
| Update image | `msg` `img_thumbnail_path`, `img_original_path`, or `img_stitched_pdf_path`; `data` path; `package_id` |
| Update progress | Cordova README: `status` `progress`, `msg` `clear-offline-cache` / `uploading` / `extracting`, optional `data` percent. React and Flutter READMEs: `msg` `progress`, `data` percent, `status` `inprogress` |
| Update cleared | React and Flutter READMEs: `msg` `clear_package`, `status` `removed`. Not in the Cordova README |
| Success | `msg` `results`, `data`, `package_id`, `status` `done` |
| Error | `status` `error` plus `error`, or `status` `exception` plus `exception`; `package_id` |

Capacitor and MAUI forward the native dictionary and do not restate this field list in source. Treat the README field list as the documented subset. Extra native keys can appear because the JSON is not filtered. Do not invent keys beyond that subset.

Cordova delivers the payload as a JSON **string**. The others deliver a map or dictionary.

## Settings

All five pass a dictionary into native `VeryfiLensSettings` (`init(with:)` / `initWithJsonObject`). They do not expose a typed settings class in the public plugin API. Flutter's README classes are not in `lib/lens.dart`.

Use camelCase keys, as the READMEs and the MAUI sample do. iOS also reads snake_case aliases. Prefer camelCase so one dictionary matches the samples.

| Topic | Plugin behavior |
|-------|-----------------|
| Document type | `documentTypes` string array. Not a separate package |
| Engine | `"api"`, `"mobile"`, `"none"`. README value `"custom"` is not in the iOS decoder |
| In-app types | `credit_card`, `code`, `barcode` with `"mobile"` |
| Colors | Hex strings in READMEs (`docDetectFillUIColor`, submit-button colors). Not `UIColor` objects |
| `showInfoButton` | Not a host view. React, if the value is a number/bool, replaces it with an empty `VeryfiInfoView` (iOS) or empty `Fragment` (Android). Other plugins pass the value through; iOS keeps the property only when the value is a `VeryfiInfoView` |
| `cameraInfoView` | `VeryfiInfoView`. Not constructable from JSON. Unbridged |
| `ocrType` | iOS strings `strips` and `caps`. Not in plugin READMEs. Android **Unconfirmed** |
| Check / W-2 / W-9 keys | Forwarded as JSON. Not listed in the short plugin READMEs. iOS dictionary names are in [recipes.md](recipes.md) |

`ignoreRemoteSettings`, backup flags, and `dictateIsOn` are iOS settings keys included in the base recipe. They are not in the short plugin README lists. They are still the right defaults when the linked SDK reads them. If a host build shows the dashboard overriding the recipe, the native SDK ignored `ignoreRemoteSettings` — report that instead of inventing another key.

## Binary

| Plugin | Android artifact in source | iOS package |
|--------|----------------------------|-------------|
| Cordova `2.6.60` | `com.veryfi.lens:veryfi-lens-sdk:2.6.0.15` | SPM `veryfi-lens-spm.git` from `3.0.13` |
| React Native `2.0.62` | `com.veryfi.lens:veryfi-lens-sdk:2.7.0.4` | Vendored `Frameworks/VeryfiLens.xcframework` |
| Flutter `2.0.59` | `com.veryfi.lens:veryfi-lens-sdk:2.7.0.2` | SPM `veryfi-lens-spm.git` from `3.0.19` |
| Capacitor `2.0.61` | `com.veryfi.lens:veryfi-lens-sdk:2.6.0.18` | SPM `veryfi-lens-spm.git` from `3.0.16`, pod dependency `VeryfiLens` |
| MAUI `2.0.60` | `com.veryfi.lens:veryfi-lens-sdk:2.7.0.3` AAR | README / `MAUI_PLAN.md`: `veryfi-lens-spm.git` |

`veryfi-lens-spm.git` is the Full UI package in the iOS flavor matrix. No pinned plugin depends on `veryfi-lens-spm-receipts`, `veryfi-lens-spm-checks`, `veryfi-lens-spm-lite`, a Headless repo, or a Remote Models repo.

React Native's vendored `VeryfiLens.xcframework` uses a file name shared by several UI flavors. This pack did not unpack it. Its Android coordinate has no flavor suffix. Do not claim a flavor suffix that is not in the pod or Gradle file.

## Products with no plugin package

| Product | Plugin support |
|---------|----------------|
| Full UI, then a recipe | Current path |
| Receipts, long receipts, checks, credit cards, business cards, barcodes, OCR strips, OCR caps, W-2, W-9 | Settings on Full. Not a second dependency |
| Lite / App Clip | **Unsupported.** No `VeryfiLensLite` reference |
| Headless receipts, Headless credit cards | **Unsupported.** No `VeryfiLensHeadless` reference |
| Remote Models, check TIFF download | **Not current.** Future/planned |
| iOS `headlessUpload` | **Unsupported** on all five |
