# Conflicts and warnings

Run after the recipe. Prefer removing an extra key over adding another flag.

## Hard failures

| Combination | What happens | Fix |
|-------------|----------------|-----|
| Android Full + `credit_card` or `code` | Toast, log, camera does not open, no success callback | Say the linked artifact does not allow those types. Do not add a second SDK artifact in the host. Credit-card and OCR need a future plugin flavor. iOS model presence is **Unconfirmed** |
| `"mobile"` on receipts, checks, business cards, W-2, W-9 | No on-device extract for those types | `"api"`, or `"none"` for capture only |
| `credit_card` with `"api"` or `"none"` when the host wants card data | Card data must stay on device | `"mobile"`. Android configure also forces in-app when the first type is a credit card, and Full still refuses the type |
| Listeners added after the camera opens | iOS drops events (`hasListeners` is false) | Subscribe on `VeryfiLens.NativeModule` first |
| Present when the configure callback is not `true` | Camera with a bad session, or a silent return | Branch on the callback. If Android never calls it, there was no activity |
| `showInfoButton` set | Empty `VeryfiInfoView` (iOS, bool/number) or empty `Fragment` (Android, any value) | Omit the key. Use `showHelpScreen` |
| `autoDeleteLocalResourcesAfterProcessing` true and the host reads paths later | Empty or overwritten files | Set false, or copy inside the update listener immediately |
| `backupDocsToGallery` true without the photo-add usage string | Permission failure | Plist, or leave the backup false |
| `locationServicesIsOn` true without a location usage string | Permission failure | Plist, or leave false |
| `retrieveCheckTiffIsOn` on this plugin | No TIFF model in the current link | Do not set it. Remote Models is planned |
| Quoting XCFramework or AAR size | Wrong install impact | Measure the final app with and without the dependency. [SDK binary sizes](https://docs.veryfi.com/lens/mobile/settings/sdk_binary_sizes/) |
| `fraudDetectionIsOn` or `documentFieldsToDetect` without paid entitlement | Feature stays off | Account/backend must enable it. Field detection also needs a binary this plugin does not link |
| `"custom"` engine | iOS decoder ignores it and leaves `api` | Use `api`, `mobile`, or `none` |
| New architecture enabled | README: not supported yet | `RCT_NEW_ARCH_ENABLED=0` and `newArchEnabled=false` |

## Submit and detection

| Combination | Problem | Fix |
|-------------|---------|-----|
| `autoSubmitDocumentOnCapture` and `batchUploadOnCamera` both true | Two exit policies | Pick one capture flow |
| `showDocumentTypes` false with more than one `documentTypes` entry | User cannot switch | Turn the picker on, or use one type |
| `other` in the list and `autoCaptureOtherIsOn` left true | `other` auto-captures | Set false (base does) |
| `allowSubmitUndetectedDocsIsOn` false and check validators without the allow-submit flags | Users trapped | Keep `allowSubmitCheckSideNotDetected` and `allowSubmitCheckCornersNotDetected` true, or relax validation |
| `allowSubmitUndetectedDocsIsOn` true while trying to block blur | Blur is still allowed | Set both false to block both |
| `cropLayoutIsOn` true while automatic detection stays on | Fixed frame does not activate as expected | Turn detection off for a pure frame, or use hybrid mode |
| `showHelpButton` and `showInfoButton` together | iOS: one control, Help wins | Help path only |
| `multiplePagesCaptureIsOn` used as the multi-package switch | Wrong split | Pages-in-one-image versus the submit-preview package question |
| `stitchIsOn` true on checks or cards | Wrong UX | `stitchIsOn` false |
| `packageMaxScans` 1 and a required back | Cannot capture the back | Raise the max. Any-document back needs exactly 2 |
| `browseIsOn` true with `moreMenuIsOn` false, expecting a Browse row | No row | `showBrowserButton`, the gallery files menu, or `showDocumentBrowser()` |
| `ignoreRemoteSettings` false | Dashboard overwrites the recipe | Set true unless remote control is intended |
| `moreMenuIsOn` true | Users persist capture overrides. Android writes them back over the host dictionary | Set false |
| `dictateIsOn` true | Obsolete voice control | Set false |
| `closeCameraOnSubmit` and `submitWithoutClose` both true | Contradictory submit UX | Pick one. Winner **Unconfirmed** |
| `dataExtractionEngine` `none` and the host expects JSON fields | No extraction | `"api"` or `"mobile"` for the allowed types |
| `uploadWithoutProcessingIsOn` true without `none` | Flag applies only with `none` | Set both |
| `sameFileUploadPreventionPolicy` `always` without `api` | Policy cannot confirm uploads | `session`, or use `api` |
| `webhookIsOn` and the host only listens for immediate success | Missed results | Handle async, or turn the webhook off |
| `glareDetectionIsOn` left at the Android default true | Extra glare blocks | Set false unless requested |
| `enableScreenshots` used as the import policy | Imported screenshots still submit, or the UI blanks | `allowSubmittingScreenshots` is the import policy |

## Android versus iOS, same dictionary

| Topic | iOS | Android |
|-------|-----|---------|
| Failure status string | `fail` | `failed` |
| Configure proof | Callback boolean | Callback boolean, or no callback when activity is null |
| Delegate timing | Before configure | After `configure` is called |
| More menu | Hiding it drops stored overrides | Hiding it drops them. Leaving it on replaces host values at configure |
| `packageMaxScans` default | 10 | 5 |
| `glareDetectionIsOn` default | false | true |
| `autoRotateIsOn` / skew / clean border defaults | on | off |
| Hybrid crop | `cropLayoutWithAutoDetection` alone | also set `cropLayoutIsOn` |
| iCloud backup | `backupDocsToiCloud` | No such setting |
| Info view | `VeryfiInfoView` | `Fragment` |
| Retry arguments | id, metadata, image source tag | package id only |
| Events if nobody subscribed | Dropped | Still emitted |
