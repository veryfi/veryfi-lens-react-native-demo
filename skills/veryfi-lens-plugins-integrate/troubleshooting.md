# Troubleshooting

Use the symptom to pick a check. Do not add a native call the plugin does not export. Payload field names are the ones in [parity.md](parity.md).

## Camera never opens

| Plugin | Check |
|--------|--------|
| All | Credentials keys. JSON plugins need `clientId`, `userName`, `apiKey`, `url`. MAUI needs `ClientId`, `Username`, `ApiKey`, `Url`. Empty client id fails configure |
| Cordova | `init` only stores values. `showCamera` is the call that configures and presents. Events are JSON strings; `JSON.parse` before reading `event` |
| React Native | `configureWithCredentials` callback argument is the native success bool. Present only when it is true. Listeners must be attached first |
| Flutter | `setDelegate` before `showCamera`. `initLens` on the pinned iOS and Android sources never calls the method-channel success result, so `await Veryfi.initLens` may not complete. The native `configure` call is still invoked when credentials and settings maps are present. Do not invent a timeout API |
| Capacitor | Call `setLensEventDelegate` as well as `addListener`. Init alone does not set the native delegate. `src/web.ts` is a no-op; Lens does not run in the browser |
| MAUI | Pass the `ContentPage` into `ShowCamera`. Android completion is hardcoded `true` in `VeryfiLens.android.cs` and does not prove the native configure succeeded. iOS completion is the native bool |

## Events never arrive

React Native iOS sends close, update, success, error, analytics, and help only when `hasListeners` is true. Add listeners before configure returns and the camera opens.

Capacitor notifications fire from the native delegate. If `setLensEventDelegate` was skipped, `addListener` has nothing to receive.

Cordova keeps one callback id from `showCamera`. A later `retryPackage` in `www/veryfi.js` overwrites nothing by itself, but the iOS native `retryPackage` stores `command.callbackId` into `launchCallbackID`. A retry can steal the camera event callback. That is what the iOS source does. Do not invent a second listener API.

Flutter events are method-channel calls named `veryfiLensClose`, `veryfiLensError`, `veryfiLensSuccess`, `veryfiLensUpdate`. The Dart handler ignores any other name.

## Wrong document or no extraction

The plugin does not switch binaries per document. `documentTypes` and `dataExtractionEngine` do.

- `"mobile"` only for `credit_card`, `code`, `barcode`. Other types stay `"api"` or `"none"`.
- Credit card data stays on device. Do not point the host at a backend card payload.
- More than one `documentTypes` entry needs `showDocumentTypes: true`.
- `"custom"` is in the plugin READMEs and is not accepted by the iOS engine decoder (`api`, `mobile`, `none` only).
- OCR caps versus strips is `ocrType`: `caps` or `strips`, with `documentTypes: ["code"]`. It is not a second plugin.
- Checks do not gain TIFF by a setting on this Full link. Remote Models is not current.

## Gallery, files, or upload

Cordova, Flutter, and Capacitor export camera only. `galleryIsOn` and `browseIsOn` are in-camera settings. They are not `showGallery` or `showDocumentBrowser`.

React Native and MAUI export gallery and document browser. Call those after configure. Do not also call `showCamera` for the same presentation.

Only MAUI exports `UploadImages`. That is not Headless. Headless products are unsupported on all five.

## Retry does nothing or crashes

Match the platform column in [parity.md](parity.md). Flutter's public method takes a tag, but `lens.dart` sends channel key `imageSourceData` and iOS reads `imageSourceTag`. iOS then returns `retryPackageError`. That is a plugin mismatch, not a missing host argument. Cordova's JS function accepts only the package id, while its iOS native method reads three `arguments` indexes. Do not paper over that by adding parameters `veryfi.js` does not declare.

Android retry on every plugin ignores metadata.

## `showInfoButton` shows a blank page or nothing

Expected. The setting is a native `VeryfiInfoView`, not a boolean screen. React Native substitutes an empty view or fragment when the key is a number. Other plugins cannot construct the view from JSON. Use React Native `showHelpScreen` when the host must present its own UI, and only on React Native. Details: [unbridged.md](unbridged.md).

## Local files disappear

Default native behavior can delete package files after processing. Set `autoDeleteLocalResourcesAfterProcessing` false when the host must read `data` paths later. `clearLensStorage()` is not bridged. Say so. Do not add a fictional cleanup call.

Cordova and React Native can read a path with `getFileBase64`. Flutter, Capacitor, and MAUI cannot. The path string is still in the update payload when the native SDK sends `img_thumbnail_path`, `img_original_path`, or `img_stitched_pdf_path`.

## Stale README samples

| README says | Source says |
|-------------|-------------|
| React Native `NativeEventEmitter(VeryfiLens)` and `getConstants()` | `VeryfiLens.NativeModule` and `VeryfiLens.Events` |
| Flutter `VeryfiLensCredentials` / `VeryfiLensSettings` property setters | `Veryfi.initLens(Map, Map)` |
| Flutter credit-card sample uses `:` between property and value | Not valid Dart, and those setters do not exist |
| Capacitor `npm install veryfi-lens-capacitor` | `package.json` name `@veryfi/veryfi-lens-capacitor` |
| Capacitor docgen lists only init, delegate, camera, four listeners | `definitions.ts` also has retry, discard, share OCR, analytics |
| MAUI README `VeryfiLens.Sdk.VeryfiLens` | Class is `VeryfiLens.VeryfiLensBinding` |
| Cordova README min SDK 21 | `plugin.xml` preference `android-minSdkVersion` 23 |
| Plugin READMEs `dataExtractionEngine` `custom` | iOS decoder does not map `custom` |

## Install failures

Private git and Maven credentials are required. README locations: hub SSH keys, and `MAVEN_VERYFI_USERNAME` / `MAVEN_VERYFI_PASSWORD` for Android. This skill does not store those secrets.

React Native README sets `RCT_NEW_ARCH_ENABLED=0` and `newArchEnabled=false`. The pinned README says new architecture is not supported yet. Do not flip it on from this skill.

Flutter `pubspec.yaml` in this commit requires Flutter `>=3.41.0` and Dart `^3.11.0`. Older public docs that say `3.19.3` do not match this commit.
