# Clarifications

Status: **Open** where marked. Conservative default: leave the key out or use the base recipe. Do not present Unconfirmed behavior as a contract.

## Resolved for this plugin

| Topic | What to do |
|-------|------------|
| `showDocumentTypes` | One `documentTypes` entry can hide the picker. More than one entry needs the picker on |
| `multiplePagesCaptureIsOn` vs `multipleDocumentsIsOn` | First keeps every crop in one image. Second is the submit-preview same-transaction question when stitch is on |
| `.none` vs `uploadWithoutProcessingIsOn` | Both are decoupling. False keeps a local package (set auto-delete of local resources false). True uploads without Process a Document |
| Backups | Gallery default true copies every scan to Photos. iCloud default false. Set both false unless the host wants the copies |
| `autoCaptureOtherIsOn` | Independent of `autoCaptureIsOn`. Default true is a footgun |
| Help vs info | Help is `onHelpButtonClicked` + `showHelpScreen`. `showInfoButton` is not a React view |
| Stale types | `lib/typescript/index.d.ts` is not the export list |
| New architecture | README says not supported. Leave it off |
| Engine strings | `api`, `mobile`, `none` only |

## Unconfirmed

| Item | What was read | Status |
|------|----------------|--------|
| Models inside `VeryfiLens.xcframework` | File name only. Podspec vendors it. Not unpacked | Do not claim credit-card, code, check, W-2, or W-9 models are inside |
| Android `initWithJsonObject` for every recipe key | Plugin forwards the map. Android SDK was not re-opened for each key in this pack | Keys missing from the plugin README may be ignored. Say so if the host depends on one |
| `continuousAutoFocus`, `ocrType` on Android | iOS reads them. Not in the plugin README | **Unconfirmed** on Android |
| `primaryColor` / `accentColor` on iOS | README says Android only | Do not send them for an iOS-only effect |
| `startObserving` / `stopObserving` from JS | Exported in `src/index.tsx`. Not in `VeryfiLens.m` `RCT_EXTERN_METHOD`. Android has no method | Whether the JS call hits the iOS override is **Unconfirmed**. Prefer `addListener` |
| `isReactNative` | iOS decoder reads the bool. Plugin does not set it. Android catalog says wrapper-internal, do not set | Leave unset |
| `bill` document type in the README | Not in the iOS document-type list | Do not emit. Use `invoice` |
| `dataExtractionUrl` | README pairs it with `custom` | iOS engine decoder has no `custom`. Do not set |
| Close-on-submit and submit-without-close both true | Two flags | Winner **Unconfirmed** |
| `cameraProcessingMode` without `any_document` | Header says only any-document | **Unconfirmed** for card types |
| `categories` vs `categoriesList` | String hints versus structured models | **Unconfirmed** when Collect Upfront appears for partners |
| Contacts and Calendar plist keys | README lists them | **Unconfirmed** / likely stale. Omit |
| `backupDocsToiCloud` forwarded to Android | iOS key. Android has no iCloud backup | Ignored on Android is the expected reading; a warning in a specific build is **Unconfirmed** |
| Help screen when the help callback never ran | iOS returns if `presentingViewController` is nil | Do not call `showHelpScreen` before `onHelpButtonClicked` |
| Android retry with extra JS arguments | Kotlin signature is one string | Extras are not applied. No crash was executed here; do not promise they are ignored at the RN bridge layer beyond the Kotlin signature |
| Which native status strings appear besides the README subset | Plugin does not filter JSON | iOS `fail` and Android `failed` are native. Other keys can appear |

## iOS and Android bridge differences that change host code

Recorded in [implementation.md](implementation.md) and [conflicts.md](conflicts.md). The ones that surprise people:

1. Subscribe before configure, or iOS events never arrive. Android still emits.
2. Android sets the delegate after calling `configure`. Android omits the JS callback when there is no current activity and emits an error event instead.
3. `retryPackage` metadata and `imageSourceTag` apply on iOS only.
4. `showInfoButton` substitution is type-checked on iOS (`NSNumber`) and key-presence-checked on Android.
5. Android Full rejects `credit_card` and `code`. The iOS binary was not unpacked.

## Still open from Lens settings, not plugin-specific

These stay **Unconfirmed** and should not grow the recipe: which dashboard keys merge when `ignoreRemoteSettings` is false; who should toggle `computeIsOn` / `gpuIsOn` / `boostModeIsOn`; whether `packageMaxScans == 2` is required for driver-license and insurance backs (any-document backs do require exactly 2).
