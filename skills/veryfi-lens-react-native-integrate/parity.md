# API parity and port candidates

"Bridged" means the method is on `src/index.tsx` and a native method exists in the pinned plugin. The native SDK can still have APIs this plugin does not wrap. A missing wrapper is a plugin gap. Do not invent a JavaScript call, and do not tell the host to import `VeryfiLens` from the native SDK unless they already maintain a custom bridge.

A **port** is a change inside the plugin repo: accept the argument on the JavaScript surface, call the existing native method, and return the delegate payload the SDK already produces. This skill does not make that change.

## Bridged

| Call | JavaScript | iOS | Android |
|------|------------|-----|---------|
| Configure | `configureWithCredentials(credentials, settings, callback)` | Delegate, then `configure`, then callback | `configure`, then `setDelegate`, then callback. No callback if there is no activity |
| Camera | `showCamera()` | `showCamera(in:)` | `showCamera()` |
| Gallery | `showGallery()` | `showGallery(in:)` | `showGallery()` |
| Document browser | `showDocumentBrowser()` | `showDocumentBrowser(in:)` | `showDocumentBrowser()` |
| Close | `closeCamera()` | `closeCamera(in:)` | `closeCamera()` |
| File base64 | `getFileBase64(path, onError, onSuccess)` | `utils.base64` | `Base64.encodeToString` |
| Retry one | `retryPackage(id, metadata, imageSourceTag)` | All three arguments | `retryPackage(packageID)` only |
| Retry all | `retryAllPackages()` | `utils.retryAllPackages()` | `retryAll()` |
| Discard one / all | `discardPackage` / `discardAllPackages` | utils | `discardUpload` / `discardAll` |
| Share OCR feedback | `shareOCRFeedback()` | `shareOCRFeedback()` | `shareOCRFeedback()` |
| Analytics | `observeAnalyticsEvents()` + `onVeryfiLensAnalytics` | `VeryfiLensAnalyticsEvent` | secure analytics broadcast |
| Help | `onHelpButtonClicked`, `showHelpScreen(name)`, `closeHelpScreen()` | React root view in a page sheet | `ContainerActivity` + React root view |
| Listener flag | `startObserving` / `stopObserving` exported in JS | Overrides flip `hasListeners`. Not listed in `VeryfiLens.m`. Bridging of the JS call is **Unconfirmed** | No such `@ReactMethod` |

## Not bridged (port candidates)

These are real native UI SDK methods or utils. Until a plugin method exists, they are unavailable.

| Native API | Why it is absent | Port would |
|------------|------------------|------------|
| `uploadImages` | Not in `src/index.tsx` | Pass file paths the host already has, no camera. Still the UI SDK. Not Headless. Android also has an `isSameTransaction` argument; iOS `uploadImages` does not |
| iOS `headlessUpload` | Not exported | In-memory upload on the UI SDK. Not a Headless product |
| Headless `process` / `processFrame` / `processCreditCard` | Plugin does not link `VeryfiLensHeadless` | **Unsupported product**, not a small port. Needs another binary |
| Lite / App Clip / Play Feature Delivery | No `VeryfiLensLite` reference | **Unsupported.** A different artifact |
| Remote Models package | Gradle has no `veryfi-lens-remote-models-sdk`. XCFramework was not unpacked | **Planned** plugin variant. Not a settings flag |
| `utils.clearLensStorage` | Not exported | Host-owned deletion when auto-delete is off |
| `utils.updateCameraInfoView` | Not exported | Live banner update |
| SwiftUI presentation | Not exported | iOS-only presentation helpers |
| `shareExtensionModeIsOn` plus `uploadImages` | Upload is not exported | Share Extension path |
| `setInfoView` | Only in stale `index.d.ts` | Do not port that name. Help is already `showHelpScreen` |
| `VeryfiInfoView` / Android `Fragment` info screen | JSON cannot carry the view | Hard to bridge. See below |
| `lensVC()` embed | Not exported | iOS embeddable controller |
| `showCrop` | Not exported | Manual crop of an existing image |
| `removeDelegate()` | Android sets a new delegate object and never removes it | Optional lifecycle port |

## Hard to bridge: info views

`showInfoButton` and `cameraInfoView` are native view objects (`VeryfiInfoView` on iOS, `Fragment` on Android), not colors or booleans. JSON has no way to pass that object.

What this plugin does if the host sets `showInfoButton`:

- iOS: a JavaScript bool or number is an `NSNumber`. The bridge replaces it with `VeryfiInfoView()` — an empty view, not the host's UI.
- Android: if the key exists, the bridge assigns `Fragment()` — an empty fragment.

The host's component tree is not embedded. Omit the key.

Use `showHelpButton: true`, `showDefaultScanningGuide: false`, listen for `onHelpButtonClicked`, then `showHelpScreen`. That is the supported host UI.

On iOS, Help and `showInfoButton` share one camera control and Help wins. On Android they are separate views; putting both on screen is **Unconfirmed** for layout, and the info fragment also shows the browse icon. Pick Help.

## Android Full document types

The linked artifact is `veryfi-lens-sdk` (Full). Android Full allows receipt, long receipt, invoice, other, check, business card, barcode, W-2, W-9, and `ANY_DOCUMENT` (among others). It does **not** allow `CREDIT_CARD` or `CODE`. A port that only adds JavaScript will not fix that. A future plugin would need the Credit Cards or OCR artifact. Do not add those Gradle lines in the host app next to this plugin.

iOS: whether the vendored `VeryfiLens.xcframework` embeds credit-card, code, check, W-2, or W-9 models was **not unpacked**. **Unconfirmed.**

## Do not generate

- `VeryfiLens.setInfoView`
- `VeryfiLens.uploadImages`
- `VeryfiLens.headlessUpload`
- `VeryfiLens.clearLensStorage`
- A second Lens npm package for receipts, checks, cards, OCR, Lite, Headless, or Remote Models
