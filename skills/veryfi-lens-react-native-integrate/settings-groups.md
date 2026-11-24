# Settings groups

Not public SDK types and not JSON keys. Use the IDs when explaining a recipe. Each group is a set of dictionary entries on the object passed to `configureWithCredentials`.

Compose: **ExtractionMode** + **CaptureFlow** + **CaptureSources** + **QualityGate** + **MultiPage** + optional extras + **Chrome**. Branding last, and only if the host asked.

JSON strings for the engine are `"api"`, `"mobile"`, and `"none"`. Those are the iOS decoder values (`.cloudAPI`, `.inApp`, `.none`). Android `initWithJsonObject` maps the same dictionary; a key Android does not read is **Unconfirmed** and will not apply.

## ExtractionMode

| ID | Keys | Use |
|----|------|-----|
| `CloudProcess` | `dataExtractionEngine` `"api"`, `uploadWithoutProcessingIsOn` false | Veryfi API processing |
| `InApp` | `dataExtractionEngine` `"mobile"` | Only `credit_card`, `code`, `barcode`. Those types extract locally. Credit card data is never sent to the backend. Android Full rejects `CREDIT_CARD` and `CODE` |
| `DecoupledLocalPackage` | `"none"`, `uploadWithoutProcessingIsOn` false, `autoDeleteLocalResourcesAfterProcessing` false | Any allowed type. No extract. Retain `local_package_path`. Customer owns upload and Process a Document. `clearLensStorage` is not bridged |
| `DecoupledRemotePackage` | `"none"`, `uploadWithoutProcessingIsOn` true | Lens uploads. Process a Document is not called. Customer uses `bucket` and `package_path` |
| `VisualOnly` | `"none"`, `uploadWithoutProcessingIsOn` false | Local package or PDF, no extract |

## CaptureFlow

| ID | Keys |
|----|------|
| `ReviewThenSubmit` | `autoSubmitDocumentOnCapture` false, `batchUploadOnCamera` false, `imagePreviewIsOn` true |
| `AutoSubmit` | `autoSubmitDocumentOnCapture` true, `batchUploadOnCamera` false |
| `BatchToMaxThenReview` | `batchUploadOnCamera` true, `autoSubmitDocumentOnCapture` false, `packageMaxScans` set |

Do not combine AutoSubmit with BatchToMaxThenReview.

## CaptureSources

| ID | Keys |
|----|------|
| `CameraOnly` | `galleryIsOn` false, `browseIsOn` false, `showBrowserButton` false, `dictateIsOn` false |
| `CameraPlusGallery` | `galleryIsOn` true. Set `galleryButtonWithFilesIsOn` false for Photos only |
| `CameraPlusFiles` | One entry: More menu (`moreMenuIsOn` true and `browseIsOn` true), top-right button (`showBrowserButton` true), or the gallery Photos/Files menu (`galleryIsOn` true and `galleryButtonWithFilesIsOn` true) |
| `FilesFirst` | Call `showDocumentBrowser()` as the primary flow. Camera source flags are not required |
| `GalleryFirst` | Call `showGallery()` as the primary flow |

`galleryIsOn` does not call `showGallery`. They are different entry points. See [implementation.md](implementation.md).

`autoCropGalleryIsOn` / `autoCropBrowserIsOn` are best-effort overlays for paper photos and scans and also require `autoDocDetectionAndCropIsOn`. Internal digital-copy checks can preserve screenshots. Original-file PDFs are not page-cropped.

## QualityGate

| ID | Keys |
|----|------|
| `Lenient` | `allowSubmitUndetectedDocsIsOn` true. That legacy umbrella also permits blur. `allowSubmitBlurredDocsIsOn` is redundant while this is true |
| `Balanced` | `blurDetectionIsOn` true, `allowSubmitUndetectedDocsIsOn` false, `allowSubmitBlurredDocsIsOn` true. Require a rectangle; let users accept blur |
| `StrictBanking` | `allowSubmitUndetectedDocsIsOn` false, check side and size validators on, crop layout on retake, `captureMarginRatio` 0.08. `validateCheckCorners` stays off unless the customer wants it |

`glareDetectionIsOn` stays false unless the host explicitly wants the current algorithmic glare gate.

## MultiPage

| ID | Keys |
|----|------|
| `SingleFrame` | `stitchIsOn` false, `multiplePagesCaptureIsOn` false. One image keeps the larger crop |
| `StitchToPdf` | `stitchIsOn` true, `multiplePagesCaptureIsOn` true, `singleScanPackages` false, `returnStitchedPDF` true |
| `SeparatePackages` | `multipleDocumentsIsOn` true, `stitchIsOn` true, `singleScanPackages` true. Skips the same-transaction alert and forces every image into its own package |

`multiplePagesCaptureIsOn` keeps every crop in one image (false keeps the larger one). `multipleDocumentsIsOn` asks, on submit preview when stitch is on, whether several images are separate packages. They are not one switch.

## Compliance

| ID | Keys |
|----|------|
| `NoGalleryBackup` | `backupDocsToGallery` false, `backupDocsToiCloud` false |
| `KeepLocalResources` | `autoDeleteLocalResourcesAfterProcessing` false. Host owns deletion. `clearLensStorage()` is not bridged |
| `NoScreenshotSubmit` | `allowSubmittingScreenshots` false. Rejects imported images classified as screenshots. Device screenshots of Lens screens are `enableScreenshots` |
| `SameFileSession` | `sameFileUploadPreventionPolicy` `"session"` |
| `SameFileAlways` | `"always"` plus `dataExtractionEngine` `"api"` |

Local fraud detection (`fraudDetectionIsOn`) and local field detection (`documentFieldsToDetect`) are paid. The validated account/backend entitlement must enable them. Field detection also needs a Field Detection or Remote Models binary. This plugin links Full, not those artifacts. Do not turn the keys on and tell the host the feature is live.

## IdentityExtras

| ID | Keys |
|----|------|
| `BackOptional` | matching `*BackIsOn` true, `*BackIsRequired` false |
| `BackRequired` | `*BackIsOn` and `*BackIsRequired` true. For any-document backs, `packageMaxScans` must be exactly 2 |
| `FaceVerify` | `identityVerificationIsOn` true |
| `CropLayoutGuide` | Fixed frame: `cropLayoutIsOn` true and automatic detection/crop off. Hybrid frame plus green box: `cropLayoutWithAutoDetection` true. On Android also set `cropLayoutIsOn` true. Corner radius is visual; the saved crop stays rectangular |

## BankingExtras

| ID | Keys |
|----|------|
| `CheckBack` | `checkSequenceMode` true, `checksBackIsOn`, `forceLandscapeImage` |
| `CheckValidation` | `validateCheckSides`, `validateCheckSize`, and the allow-submit flags. `validateCheckCorners` only if the customer wants it |
| `CheckTiff` | `retrieveCheckTiffIsOn`. Remote Models only. **Do not use** on this plugin. The current link is not that binary |

## Chrome

| ID | Keys |
|----|------|
| `GuideAnimation` | `showGuideShortCounter` (receipt), `showGuideCounter` (long receipt), `showPrescriptionLabelGuideCounter`, `animationDisplayDuration`. Replay: `showHelpButton` true and `showDefaultScanningGuide` true |
| `CameraHelp` | `showHelpButton` true, `showDefaultScanningGuide` false, then `onHelpButtonClicked` and `showHelpScreen`. Do not set `showInfoButton` |
| `Minimal` | `moreMenuIsOn` false, `moreSettingsMenuIsOn` false, `shareLogsIsOn` false, `dictateIsOn` false |
| `FullDemo` | More menu on. Not for most clients. On Android it also lets stored overrides replace the recipe |

## Branding

Apply last: submit-button color hex strings, `docDetectFillUIColor`, `docDetectStrokeUIColor`, fonts. Colors in the README are hex strings such as `"#9653BF8A"`, not `UIColor` objects. Never required for a first scan.

`customLensStrings` is an iOS dictionary of dictionaries. Android has no `customLensStrings`; Lens strings are Android resources. Overriding them by redeclaring resource names is **Unconfirmed**. String list: https://docs.veryfi.com/lens/mobile/settings/customizable_strings/

## Recipe map

| Recipe | Groups |
|--------|--------|
| `full` / `receipts` | CloudProcess + ReviewThenSubmit + CameraPlusGallery + Balanced + StitchToPdf + Minimal |
| `long-receipts` | CloudProcess + StitchToPdf + Minimal |
| `checks` | CloudProcess + ReviewThenSubmit + CameraPlusGallery + StrictBanking + SingleFrame + CheckBack + CheckValidation + Minimal |
| `credit-cards` / `barcodes` / `ocr-strips` / `ocr-caps` | InApp + CameraOnly + Minimal |
| `business-cards` / `w2` / `w9` | CloudProcess + CameraPlusGallery or CameraOnly + Minimal |
| Any-Documents | CloudProcess + CameraOnly + Minimal, after support confirms the template |
