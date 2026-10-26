# Settings catalog

Meanings are Lens settings semantics for the keys this plugin forwards as JSON. Client code uses a dictionary. **Unconfirmed** items are listed in [clarifications.md](clarifications.md).

**Critical** = a wrong value often breaks the integration or fills a support queue.

CamelCase is the key to send. iOS also accepts the snake_case alias. Android maps JSON through `initWithJsonObject`. Where Android's default or behavior differs, it is called out. Where this pack did not re-read the Android property, the Android result of a key that is missing from the plugin README is **Unconfirmed**.

## Document type

| Key | iOS default | Meaning |
|-----|-------------|---------|
| `documentTypes` | `receipt`, `long_receipt`, `invoice`, `other` | **Critical.** Snake_case type strings. One type works with the picker hidden. More than one needs `showDocumentTypes` true. Must be allowed by the linked binary. Android Full rejects `credit_card` and `code` |
| `showDocumentTypes` | false | Camera type picker. Does not enable types by itself |
| `defaultSelectedDocumentType` | empty | Initial picker selection |
| `anyDocumentTemplate` | empty | Any-Documents template name. Not a closed list. Contact support before shipping one. Shortcut flavors: nutrition facts, US passport, driver license, prescription labels |
| `anyDocumentType` | empty | **Deprecated.** Local regex OCR. Do not set. Use `anyDocumentTemplate` |
| `cameraProcessingMode` | document | `document`, `card`, or `check`. Header: only with `any_document`. Ignored otherwise is **Unconfirmed** for card types that already use card detectors |
| `useLegacyModels` | true | Debug only. The SDK currently forces true. Do not set |

Strings the iOS settings model names: `long_receipt`, `receipt`, `invoice`, `check`, `credit_card`, `business_card`, `other`, `dictation`, `code`, `w2`, `w9`, `barcode`, `bank_statement`, `insurance_card`, `passport`, `driver_license`, `nutrition_fact`, `shipping_label`, `any_document`, `bank_letter_and_check`, `prescription_label`. Unknown becomes `other` on iOS. Android has no `dictation` or `bank_letter_and_check` document type. Do not send those on Android.

The README also lists `bill`. That string is not in the iOS list above. Do not emit `bill`. Use `invoice`.

## Extraction and upload

| Key | iOS default | Meaning |
|-----|-------------|---------|
| `dataExtractionEngine` | `api` | **Critical.** `api` cloud, `mobile` on-device, `none` no extract. `mobile` only for `credit_card`, `code`, `barcode`. README `custom` is not accepted; the decoder leaves the default. Do not set `dataExtractionUrl` for `custom` |
| `uploadWithoutProcessingIsOn` | false | Only with `none`. True: Lens uploads, no Process a Document, success has `bucket` and `package_path`. False with `none`: local package |
| `autoDeleteLocalResourcesAfterProcessing` | true | **Critical.** After each package, Lens deletes that package's local files. Set false to keep paths. Host owns deletion. Not the server flag below. Not bridged as a cleanup method |
| `autoDeleteAfterProcessing` | false | Delete the **server** document after process. Product decision |
| `returnStitchedPDF` | false | Include the stitched PDF path (`img_stitched_pdf_path`) |
| `retrieveCheckTiffIsOn` | false | Local check TIFF. Remote Models only. Not this plugin |
| `rejectInvalidCheckTIFF` | false | Hard-fail if TIFF cannot be built. Same flavor limit |
| `webhookIsOn` | false | Async processing. Host must not expect only an immediate success |
| `externalId` | empty | Pass-through id |
| `ignoreRemoteSettings` | false | **Critical.** False lets dashboard `lens_settings` overwrite this dictionary during configure. Clients set true unless remote control is the product |
| `sameFileUploadPreventionPolicy` | `none` | `session` or `always`. `always` needs `api` |
| `ocrType` | `strips` | `strips` or `caps` for `documentTypes` `code`. Android acceptance **Unconfirmed** |
| `ocrRegex` | empty | Host pattern for code capture. Not a universal example |
| `boundingBoxesIsOn`, `confidenceDetailsIsOn`, `parseAddressIsOn`, `detectBlurResponseIsOn`, `boostModeIsOn`, `computeIsOn` | mixed | Cloud response/processing flags. They do not apply to a customer's later Process a Document call when the engine is `none`. Leave `computeIsOn` / `boostModeIsOn` / `gpuIsOn` at defaults unless an account manager says otherwise (**Unconfirmed** who should change them) |

## Capture quality

| Key | iOS default | Meaning |
|-----|-------------|---------|
| `autoCaptureIsOn` | false | Best-frame shutter. Cards, barcodes, and codes often true |
| `autoCaptureOtherIsOn` | true | **Critical.** `other` auto-captures even when `autoCaptureIsOn` is false. Set false |
| `autoDocDetectionAndCropIsOn` | true | Live detect and crop |
| `autoRotateIsOn` | true on iOS, false on Android | Rotate the document upright. Recipes that need it set true |
| `autoSkewCorrectionIsOn` | true on iOS, false on Android | Deskew. Checks recipe sets false |
| `cleanBorderIsOn` | true on iOS, false on Android | Border cleanup. Receipt recipes set true |
| `dewarpingIsOn` | false | Useful for barcodes. Leave false on receipts |
| `blurDetectionIsOn` | true | Capture-time blur gate |
| `allowSubmitUndetectedDocsIsOn` | true | Legacy umbrella: allows no-rectangle and blur. False enables separate blur policy |
| `allowSubmitBlurredDocsIsOn` | false | Independent blur continue. True or the umbrella allows blur |
| `glareDetectionIsOn` | false on iOS, **true on Android** | Suboptimal algorithmic gate. Set false |
| `autoLightDetectionIsOn` | true | Ambient torch. Credit cards and codes set false |
| `continuousAutoFocus` | false | Close-up focus for caps and small codes. Android acceptance **Unconfirmed** |
| `showNoDocumentDetectedWarning` | true | Usual host choice is false: skip the no-document alert |
| `autoCropGalleryIsOn` / `autoCropBrowserIsOn` | false | Best-effort crop of imported paper photos. Also needs `autoDocDetectionAndCropIsOn` |
| `cropLayoutIsOn` | false | Fixed frame when automatic detection is off |
| `cropLayoutWithAutoDetection` | false | Hybrid frame plus green box. Android also needs `cropLayoutIsOn` true |
| `cropLayoutCornerRadius` | 0 | Visual shape only. Saved crop stays rectangular |
| `fraudDetectionIsOn` | false | Requests paid local fraud detection for camera captures. Entitlement required. Does not unlock by itself |
| `showLCDIsNotAllowed` | false | Blocks a camera frame the fraud detector marks as a screen. Needs `fraudDetectionIsOn` and the paid entitlement |
| `documentFieldsToDetect` | empty | Paid local field detection. Supported names: `vendor`, `date`, `time`, `total`, `tax`. Needs entitlement and a Field Detection or Remote Models binary. This plugin links neither |

## Session and submit

| Key | iOS default | Meaning |
|-----|-------------|---------|
| `autoSubmitDocumentOnCapture` | false | Skip submit preview. Do not combine with `batchUploadOnCamera` |
| `batchUploadOnCamera` | false | Stay on camera until `packageMaxScans` |
| `imagePreviewIsOn` | true | Preview for gallery and browse imports, not a promise of a camera preview |
| `packageMaxScans` | 10 on iOS, 5 on Android | Max images per package. Any-document back prompt requires exactly 2 |
| `multiplePagesCaptureIsOn` | true | Every crop in one image. False keeps the larger crop |
| `multipleDocumentsIsOn` | true | Submit-preview question when stitch is on and more than one image is ready |
| `singleScanPackages` | false | True skips that question and forces one package per image |
| `stitchIsOn` | true | Combine images into a PDF. False for checks and cards |
| `stitchOtherIsOn` | false | Stitch for `other` only. Dead if `other` is not in `documentTypes` |
| `closeCameraOnSubmit` | true | True ends the session. False returns to the camera for another capture |
| `afterScanCloseCameraIsOn` | true | Shows the More-menu row that overrides `closeCameraOnSubmit`. Not an auto-capture switch |
| `submitWithoutClose` | false | Keep the submit screen. Winner versus `closeCameraOnSubmit` if both true is **Unconfirmed** |
| `allowSubmittingScreenshots` | true | Imported files. False rejects images classified as screenshots |
| `enableScreenshots` | true | Device screenshots and screen recordings of the camera and submit screens. False blanks those screens. Not the import policy |
| `originalImageMaxSizeInMB` | 2.5 | Output image cap. README says the valid range is 0.2 to 2.5 |

## Sources and chrome

| Key | iOS default | Meaning |
|-----|-------------|---------|
| `galleryIsOn` | true | Gallery control inside the camera. Not `showGallery()` |
| `browseIsOn` | true | Browse under More > Import. Requires `moreMenuIsOn`. Does not gate `showBrowserButton`, `galleryButtonWithFilesIsOn`, or `showDocumentBrowser()` |
| `showBrowserButton` | false | Top-right Files button |
| `galleryButtonWithFilesIsOn` | false | Gallery control becomes a Photos-versus-Files menu |
| `moreMenuIsOn` | true | **Critical on Android.** While true, stored user choices replace host values on later configures (auto capture, torch, blur, glare, gallery backup, close-on-submit, batch). Set false unless users should own those toggles. iOS drops stored overrides when the menu is hidden |
| `moreSettingsMenuIsOn` | true | More > Settings. Does not reset More-menu overrides. Set false |
| `dictateIsOn` | true | Obsolete. Not partner available. Set false |
| `backupDocsToGallery` | true | Copies every scan into Photos. Set false unless that is wanted. Needs the photo-library add usage string |
| `backupDocsToiCloud` | false | Copies every scan into iCloud. iOS. Leave false. Android has no iCloud backup |
| `locationServicesIsOn` | false | Needs a location usage string. Leave false |
| `showHelpButton` | false | Shared Help control on iOS. With `showDefaultScanningGuide` false, the plugin emits `onHelpButtonClicked` |
| `showDefaultScanningGuide` | false | True replays the built-in guide and does not emit the host help event |
| `showInfoButton` | unset | **Do not set from JavaScript.** iOS replaces a bool/number with an empty `VeryfiInfoView`. Android replaces any present key with an empty `Fragment` |
| `cameraInfoView` | unset | Native banner. Not constructable from JSON. Unbridged |
| `shareLogsIsOn` | false | Log sharing button. Leave false |

## Checks and identity

| Key | Meaning |
|-----|---------|
| `checksBackIsOn` / `checksBackIsRequired` | Check reverse. Required forces the back |
| `checkSequenceMode` | Front-then-back check UI. Recommended when both sides are captured |
| `validateCheckSides` / `validateCheckSize` | Alerts. Pair with `allowSubmitCheckSideNotDetected` and `allowSubmitCheckCornersNotDetected` (those allow flags default true) |
| `validateCheckCorners` | Algorithmic and can be aggressive. Leave false unless requested |
| `forceLandscapeImage` | Horizontal check preview |
| `checksMinAspectRatio` / `checksMaxAspectRatio` / `checksCropMargin` | Check geometry. 0 on the ratios means internal defaults |
| `captureMarginRatio` | Edge margin. Checks use 0.08 |
| `forceCropLayoutOnRetake` / `cropLayoutShowDelay` | Show the check guide immediately after a failed detection, or after the delay while the user is still on camera |
| `anyDocumentBackIsOn` | Back prompt only when the active type is `any_document`, this is true, and `packageMaxScans` is exactly 2 |
| `anyDocumentBackIsRequired` | Forces that back. False lets the user skip |
| `driverLicenseBackIsOn` / `insuranceCardBackIsOn` | Those types' own back flags. They do not use `anyDocumentBack*` |
| `identityVerificationIsOn` | Face sequence |

## Colors

README colors are hex strings (`docDetectFillUIColor`, submit-button colors, `primaryColor`, `accentColor`). `primaryColor` and `accentColor` are described as Android-only in the README. iOS acceptance of those two names is **Unconfirmed**. Do not send `UIColor` objects.

## More menu overrides

While `moreMenuIsOn` is true, the end user can persist overrides for auto capture, auto torch, gallery backup, iCloud backup (iOS), Superman mode (`batchUploadOnCamera`), and close-camera-after-submit. On Android those stored values replace the host dictionary on the next `configure`. Hiding the menu (`moreMenuIsOn` false) discards them and the host values apply. `showiCloudBackupOption` and `showSupermanModeIsOn` hide individual rows. `afterScanCloseCameraIsOn` false hides the close-camera row and does not itself change capture flow.

## Host keys to leave alone

`isReactNative` exists on both SDKs. The Android catalog marks it wrapper-internal. This plugin does not set it. Leave it unset. `categoriesList`, `coreTags`, `customers`, and `costCodes` are structured Collect Upfront models. Relationship to the string `categories` array is **Unconfirmed**. Do not invent them for a first scan.
