# Native APIs the plugins do not bridge

The plugins wrap a subset of the Full UI SDK. A missing wrapper is a plugin gap. The native method still exists on iOS or Android and **could be ported** by changing the plugin. Do not invent a JavaScript, Dart, or C# call for it, and do not tell the host to reach into the native SDK from hybrid code unless they already maintain a custom bridge.

## Hard to bridge: `VeryfiInfoView`

`showInfoButton` and `cameraInfoView` are `VeryfiInfoView` instances, not colors or booleans. iOS pins `showInfoButton` over the camera and shows `cameraInfoView` as a top banner. The view subclass calls inherited `close()` to dismiss. JSON has no way to pass that object.

What the pinned plugins do instead:

| Plugin | What happens if the host sets `showInfoButton` |
|--------|--------------------------------------------------|
| React Native | If the value is a number or bool, iOS assigns `settings.showInfoButton = VeryfiInfoView()` (an empty view, not the host's UI). Android assigns `Fragment()`. The host's widget tree is not embedded |
| Cordova, Flutter, Capacitor, MAUI | The map is passed to `VeryfiLensSettings`. iOS applies `showInfoButton` only when the value is already a `VeryfiInfoView`. A bool or string does not become a screen |

`cameraInfoView` and `VeryfiLens.utils.updateCameraInfoView` are not bridged anywhere.

React Native is the only plugin that bridges the other Help path: `onHelpButtonClicked`, then `showHelpScreen(componentName)` / `closeHelpScreen()`. That presents a React Native component. It is not a `VeryfiInfoView`. The other four plugins do not export `onHelpButtonClicked`. Setting `showHelpButton: true` may show the native control, and without a bridge the host cannot present its own screen from that tap.

`showHelpButton` and `showInfoButton` share one camera control on iOS. Help wins. Do not set both and expect two buttons.

## UI SDK methods not on every plugin

These are real native UI SDK methods. Porting them means adding a plugin method that calls the native one. Until that exists, they are unavailable on the plugins marked No in [parity.md](parity.md).

| Native UI SDK | Bridged today | Notes |
|---------------|---------------|--------|
| `showCamera` | All five | |
| `showGallery` | React Native, MAUI | |
| `showDocumentBrowser` | React Native, MAUI | |
| `closeCamera` | React Native, MAUI | |
| `uploadImages` | MAUI only | Still the UI SDK. Not Headless. MAUI iOS drops `isSameTransaction`; Android passes it |
| `headlessUpload` (iOS UI SDK, in-memory) | None | Not a Headless product either. Unsupported |
| `shareOCRFeedback` | All except MAUI | |
| `retryPackage` / retry all | All five, with the metadata split in [parity.md](parity.md) | |
| `discardPackage` / discard all | All except MAUI | |
| Base64 of a local file | Cordova, React Native | Flutter, Capacitor, and MAUI have no equivalent export |
| Analytics observe | All five | MAUI also has `StopObservingAnalyticsEvents` |
| Help click + host help screen | React Native | |

## Utils and other native surface

Not exported by any of the five public APIs. A future plugin wrapper could call them. Do not generate host calls:

- `VeryfiLens.utils` after configure: `clearLensStorage`, zip path lookup, `updateCameraInfoView`, `allowReuploadingFiles`
- SwiftUI presentation (`.veryfiLensFullScreenCover`, `.veryfiLensSheet`)
- Share Extension `shareExtensionModeIsOn` plus `uploadImages` (MAUI `UploadImages` does not set that flag)
- `onHelpButtonClicked` except the React Native event
- Any `VeryfiLens*Settings` preset subclass

If the recipe sets `autoDeleteLocalResourcesAfterProcessing` false, say the host owns deletion and that `clearLensStorage()` is **not bridged**. Do not invent a plugin delete method.

## Headless products

Headless Receipts and Headless Credit Cards are different binaries and types (`VeryfiLensHeadless`, headless settings, `process` on frames the host camera captured). None of the pinned plugins link those artifacts or export `process`.

Mark both **unsupported**. Do not approximate them with `showCamera` or with MAUI `UploadImages`.

`UploadImages` configures the UI SDK and uploads paths the host already has. The host does not own detection. That is the UI SDK no-UI path, and only MAUI exports it.

## Lite and Remote Models

Lite / App Clip (`VeryfiLensLite`, pod `VeryfiLens-Lite`) does not appear in these plugins. **Unsupported.**

Remote Models is not selected by any Gradle coordinate or SPM URL in these commits. **Future/planned.** Check TIFF (`retrieveCheckTiffIsOn`) belongs to that future binary, not to the current Full plugin link. Do not add it to the checks recipe.

## What a port would mean

A port is a change inside the plugin repo: accept the argument on the JS/Dart/C# surface, call the existing native method, and return the delegate payload the SDK already produces. This skill does not make that change. If the host needs gallery, files, upload, discard, or a custom info view on a plugin that lacks it, say the method is unbridged and can be ported, then stop.
