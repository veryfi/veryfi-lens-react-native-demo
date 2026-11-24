# Troubleshooting

Use the symptom. Do not add a native call [parity.md](parity.md) marks absent. Payload names are the README subset in [implementation.md](implementation.md).

## Camera never opens

| Check | What to do |
|-------|------------|
| Configure callback | Present only when the argument is `true`. Android does not call it if `currentActivity` is null; look for `onVeryfiLensError` with `error` about the application |
| Credentials | Keys `url`, `clientId`, `userName`, `apiKey`. `userName` is camelCase with a capital N |
| Android document type | `credit_card` and `code` are rejected by `veryfi-lens-sdk`. Expect a Toast and no callback |
| New architecture | Leave it off |
| iOS root view | `showCamera` returns when there is no key window root view controller |
| Camera plist | Add `NSCameraUsageDescription`. The README sample omits it |

## Events never arrive

iOS sends close, update, success, error, analytics, and help only when `hasListeners` is true. Add listeners on `new NativeEventEmitter(VeryfiLens.NativeModule)` before configure finishes.

The README's `new NativeEventEmitter(VeryfiLens)` and `VeryfiLens.getConstants()` do not match `src/index.tsx`. Use `VeryfiLens.Events`.

Calling `stopObserving` can clear `hasListeners` if that call reaches iOS. Remove listeners with `subscription.remove()` instead.

Android emits even without a prior listener. If Android is silent too, configure did not run or the delegate was not set (no activity).

## Wrong document or no extraction

The plugin does not switch binaries per document. `documentTypes` and `dataExtractionEngine` do.

- `"mobile"` only for `credit_card`, `code`, `barcode`.
- Credit card data stays on device.
- More than one type needs `showDocumentTypes: true`.
- `"custom"` is in the README and is not an iOS engine value.
- OCR caps versus strips is `ocrType` `caps` or `strips` with `documentTypes: ["code"]`. Android Full will not open `code`.
- Checks do not gain TIFF from a setting on this link.

## Gallery, files, or upload

`galleryIsOn` is in-camera. `showGallery()` is the separate call. `showDocumentBrowser()` is the separate Files call. `uploadImages` is not exported. Headless is unsupported.

Do not call two presentation methods for one session.

## Retry does nothing

iOS uses package id, metadata, and `imageSourceTag`. Android `retryPackage` takes the package id only. Passing metadata does not make Android retry with that metadata. There is no JS success callback.

## Blank page from `showInfoButton`

Expected. The setting is a native view, not a React component. Omit it. Present host UI with `showHelpScreen` after `onHelpButtonClicked`.

`showHelpScreen` before the help event does nothing useful on iOS: the presenting controller is still nil.

## Local files disappear

Default native behavior deletes package files after processing. Set `autoDeleteLocalResourcesAfterProcessing` false when the host must read `data` paths later. `getFileBase64(event.data, onError, onSuccess)` reads a path while it exists. `clearLensStorage()` is not bridged.

`msg` `clear_package` means those assets are gone.

## TypeScript cannot see `closeCamera`

`lib/typescript/index.d.ts` omits `closeCamera` and lists `setInfoView`. The runtime export is `src/index.tsx`. Do not call `setInfoView`. A local declaration can mention `closeCamera` if the compiler follows the stale `types` entry. Do not change the plugin's `.d.ts` from the host app as if this skill owned that repo.

## Install failures

Private git SSH and `MAVEN_VERYFI_USERNAME` / `MAVEN_VERYFI_PASSWORD` are required. This skill does not store those secrets.

`minSdkVersion` must be at least 24. Missing `libc++_shared.so` pickFirst rules are the README's packaging block.

## Stale README

| README | Source |
|--------|--------|
| `NativeEventEmitter(VeryfiLens)` and `getConstants()` | `VeryfiLens.NativeModule` and `VeryfiLens.Events` |
| `dataExtractionEngine` `custom` | iOS decoder: `api`, `mobile`, `none` |
| `documentTypes` includes `bill` | Use `invoice` |
| Plist block without camera | Add `NSCameraUsageDescription` |
| Import `react-native-veryfi-lens` | `package.json` name is `@veryfi/react-native-veryfi-lens` |
| `mobile` "currently only" `credit_card` | Also `code` and `barcode` |
