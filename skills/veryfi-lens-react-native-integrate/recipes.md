# Recipes

One settings dictionary. Pass it as the second argument of `configureWithCredentials`. Do not construct `VeryfiLens*Settings` subclasses.

These recipes run on the **Full** UI SDK the plugin links. They are not separate packages. Receipts, long receipts, checks, cards, barcodes, OCR, W-2, and W-9 are `documentTypes` (and `ocrType` for caps versus strips) on that binary.

**Lite / App Clip:** unsupported. No recipe.

**Headless receipts and Headless credit cards:** unsupported. No recipe.

**Remote Models:** not in this commit. Planned. Do not set `retrieveCheckTiffIsOn` and promise a TIFF model download.

Start from **base**, then add the keys in **one** focused recipe. Skip flags the host did not ask for.

Android `initWithJsonObject` acceptance of a key that is absent from the plugin README was not re-verified by opening the Android SDK in this pack. Keys below are iOS `VeryfiLensSettings` dictionary names (camelCase) that the plugin forwards. iOS also reads snake_case aliases. Prefer camelCase so one dictionary matches the samples. A key the iOS initializer does not read will not apply on iOS. Unknown `dataExtractionEngine` strings, including README `"custom"`, do not map; the iOS decoder accepts only `api`, `mobile`, and `none` and otherwise leaves the default.

Android Full (`veryfi-lens-sdk`) rejects `CREDIT_CARD` and `CODE` at `showCamera`. The credit-card and OCR recipes are still the correct dictionaries, and they may not open the camera on Android. See [parity.md](parity.md).

## Base

Apply on every recipe unless the host wants the opposite.

```json
{
  "ignoreRemoteSettings": true,
  "backupDocsToGallery": false,
  "backupDocsToiCloud": false,
  "moreSettingsMenuIsOn": false,
  "moreMenuIsOn": false,
  "autoCaptureOtherIsOn": false,
  "showNoDocumentDetectedWarning": false,
  "dictateIsOn": false,
  "locationServicesIsOn": false,
  "glareDetectionIsOn": false,
  "enableScreenshots": true
}
```

`backupDocsToGallery` defaults true: every scan is copied into Photos. `dictateIsOn` defaults true and is obsolete. `autoCaptureOtherIsOn` defaults true, so `other` still auto-captures when `autoCaptureIsOn` is false. `glareDetectionIsOn` defaults true on Android and false on iOS; the detector is a suboptimal algorithmic gate, so leave it false. `enableScreenshots` is device screenshots of the Lens UI. Imported screenshot files are `allowSubmittingScreenshots`.

`moreMenuIsOn` false hides the menu and drops stored user overrides. On Android, `moreMenuIsOn` true **replaces** host values of auto-detect/crop, blur, glare, auto light, auto capture, gallery backup, close-on-submit, and batch-on-camera from stored preferences on every later `configure`.

`backupDocsToiCloud` is iOS. Android has no iCloud backup setting. Forwarding the key is harmless if Android ignores it (**Unconfirmed** if a host build warns).

If the host must read files after the callback, or keep more than one package:

```json
{ "autoDeleteLocalResourcesAfterProcessing": false }
```

Who deletes those files: native `clearLensStorage()` is not bridged. See [parity.md](parity.md).

Group names in [settings-groups.md](settings-groups.md) are conceptual. They are not JSON keys.

## Full (`full`)

Widest UI recipe on the linked Full binary: receipts, invoices, other, and long receipt. Android Full allows those types. Use a narrower recipe when the host only needs one type. iOS models inside the vendored xcframework were not unpacked.

**Groups:** CloudProcess, ReviewThenSubmit, CameraPlusGallery, Balanced, StitchToPdf, Minimal.

```json
{
  "dataExtractionEngine": "api",
  "documentTypes": ["receipt", "invoice", "other", "long_receipt"],
  "showDocumentTypes": true,
  "defaultSelectedDocumentType": "receipt",
  "autoSubmitDocumentOnCapture": false,
  "batchUploadOnCamera": false,
  "imagePreviewIsOn": true,
  "galleryIsOn": true,
  "browseIsOn": true,
  "showBrowserButton": false,
  "autoCaptureIsOn": false,
  "autoDocDetectionAndCropIsOn": true,
  "autoRotateIsOn": true,
  "autoSkewCorrectionIsOn": true,
  "cleanBorderIsOn": true,
  "dewarpingIsOn": false,
  "stitchIsOn": true,
  "stitchOtherIsOn": false,
  "multipleDocumentsIsOn": true,
  "multiplePagesCaptureIsOn": true,
  "singleScanPackages": false,
  "returnStitchedPDF": true,
  "packageMaxScans": 10,
  "closeCameraOnSubmit": true,
  "sameFileUploadPreventionPolicy": "session",
  "allowSubmittingScreenshots": true,
  "webhookIsOn": false,
  "autoDeleteAfterProcessing": false
}
```

`showDocumentTypes` must be true when more than one type is set, or the user cannot switch.

`galleryIsOn` and `browseIsOn` only affect controls inside the Lens camera. This plugin also exports `showGallery` and `showDocumentBrowser` as their own presentations. `browseIsOn` does nothing visible while `moreMenuIsOn` is false; use `showBrowserButton`, `galleryButtonWithFilesIsOn`, or `showDocumentBrowser()` for Files.

## Receipts (`receipts`)

**Groups:** CloudProcess, ReviewThenSubmit, CameraPlusGallery, Balanced, StitchToPdf, Minimal.

```json
{
  "dataExtractionEngine": "api",
  "documentTypes": ["receipt", "invoice", "other"],
  "showDocumentTypes": true,
  "defaultSelectedDocumentType": "receipt",
  "autoSubmitDocumentOnCapture": false,
  "imagePreviewIsOn": true,
  "galleryIsOn": true,
  "browseIsOn": true,
  "autoCaptureIsOn": false,
  "autoDocDetectionAndCropIsOn": true,
  "autoRotateIsOn": true,
  "autoSkewCorrectionIsOn": true,
  "cleanBorderIsOn": true,
  "stitchIsOn": true,
  "multiplePagesCaptureIsOn": true,
  "multipleDocumentsIsOn": true,
  "returnStitchedPDF": true,
  "packageMaxScans": 10,
  "closeCameraOnSubmit": true
}
```

## Long receipts (`long-receipts`)

`long_receipt` is a vertical multi-frame stitch. It is not the same switch as `stitchIsOn` on ordinary receipts. Keep both.

```json
{
  "dataExtractionEngine": "api",
  "documentTypes": ["long_receipt"],
  "showDocumentTypes": false,
  "stitchIsOn": true,
  "multiplePagesCaptureIsOn": true,
  "returnStitchedPDF": true,
  "autoCaptureIsOn": false,
  "autoDocDetectionAndCropIsOn": true,
  "galleryIsOn": true
}
```

## Checks (`checks`)

Capture and cloud extract. Check TIFF is a Remote Models feature and is not a current plugin binary. Do not set `retrieveCheckTiffIsOn`.

```json
{
  "dataExtractionEngine": "api",
  "documentTypes": ["check"],
  "showDocumentTypes": false,
  "stitchIsOn": false,
  "autoCaptureIsOn": false,
  "galleryIsOn": true,
  "browseIsOn": true,
  "checksBackIsOn": true,
  "checksBackIsRequired": false,
  "checkSequenceMode": true,
  "forceLandscapeImage": true,
  "autoSelectManualCropIsOn": true,
  "autoRotateIsOn": true,
  "autoSkewCorrectionIsOn": false,
  "captureMarginRatio": 0.08,
  "checksCropMargin": 2,
  "checksMinAspectRatio": 1.9,
  "checksMaxAspectRatio": 2.85,
  "forceCropLayoutOnRetake": true,
  "cropLayoutShowDelay": 15.0,
  "cropLayoutAspectRatio": 2.18,
  "cropLayoutCornerRadius": 5,
  "cropLayoutOverlayAlpha": 0.3,
  "validateCheckSize": true,
  "validateCheckSides": true,
  "validateCheckCorners": false,
  "allowSubmitCheckSideNotDetected": true,
  "allowSubmitCheckCornersNotDetected": true,
  "allowSubmitUndetectedDocsIsOn": false,
  "returnStitchedPDF": true
}
```

Set `checksBackIsRequired` true only when both sides are mandatory. Leave `validateCheckCorners` false unless the host asked for that gate. It is algorithmic and can be aggressive.

## Credit cards (`credit-cards`)

On-device only. Card data is not sent to the backend. `"mobile"` is required. Android `configure` also forces in-app extraction when the first document type is `CREDIT_CARD`. Android Full still refuses the type at `showCamera`. iOS binary contents are **Unconfirmed**.

```json
{
  "dataExtractionEngine": "mobile",
  "documentTypes": ["credit_card"],
  "showDocumentTypes": false,
  "autoCaptureIsOn": true,
  "galleryIsOn": false,
  "stitchIsOn": false,
  "autoLightDetectionIsOn": false,
  "autoRotateIsOn": true,
  "cropLayoutWithAutoDetection": true,
  "cropLayoutWidth": 80,
  "cropLayoutHeight": 25,
  "cropLayoutCornerRadius": 15,
  "cropLayoutStroke": 16,
  "cropLayoutBorderColor": "#FFFFFFFF"
}
```

On Android, hybrid crop layout needs `cropLayoutIsOn` **and** `cropLayoutWithAutoDetection`. iOS turns the hybrid on with `cropLayoutWithAutoDetection` alone. Set both true when the host ships Android:

```json
{ "cropLayoutIsOn": true, "cropLayoutWithAutoDetection": true }
```

## Business cards (`business-cards`)

The README lists `business_card` as a camera document type and does not say to use `"mobile"`. Use `"api"`. Android Full allows `BUSINESS_CARD`.

```json
{
  "dataExtractionEngine": "api",
  "documentTypes": ["business_card"],
  "showDocumentTypes": false,
  "autoCaptureIsOn": false,
  "galleryIsOn": false,
  "stitchIsOn": false,
  "autoRotateIsOn": true,
  "autoDocDetectionAndCropIsOn": true,
  "cleanBorderIsOn": true
}
```

## Barcodes (`barcodes`)

`"mobile"` is the on-device engine for `barcode`. Android Full allows `BARCODE`.

```json
{
  "dataExtractionEngine": "mobile",
  "documentTypes": ["barcode"],
  "showDocumentTypes": false,
  "autoCaptureIsOn": true,
  "galleryIsOn": false,
  "stitchIsOn": false,
  "autoLightDetectionIsOn": false,
  "continuousAutoFocus": true,
  "dewarpingIsOn": true,
  "cleanBorderIsOn": true,
  "autoRotateIsOn": true
}
```

`continuousAutoFocus` is the iOS close-up focus flag for small codes. It is not in the plugin README. The plugin forwards the dictionary. Android acceptance is **Unconfirmed**.

## OCR strips (`ocr-strips`)

`code` extracts on device. `ocrType` `"strips"` is the iOS default mode. Android Full does **not** allow `CODE`. Android acceptance of `ocrType` is **Unconfirmed**.

```json
{
  "dataExtractionEngine": "mobile",
  "documentTypes": ["code"],
  "showDocumentTypes": false,
  "ocrType": "strips",
  "ocrRegex": "[A-Z0-9]{10}",
  "autoCaptureIsOn": true,
  "galleryIsOn": false,
  "stitchIsOn": false,
  "autoLightDetectionIsOn": false,
  "continuousAutoFocus": true
}
```

Replace `ocrRegex` with the host's pattern. Do not ship the example pattern as if it were universal.

## OCR caps (`ocr-caps`)

Same document type as strips. Only `ocrType` changes. iOS `OCRType.caps` serializes as `"caps"`.

```json
{
  "dataExtractionEngine": "mobile",
  "documentTypes": ["code"],
  "showDocumentTypes": false,
  "ocrType": "caps",
  "ocrRegex": "[A-Z0-9]{10}",
  "autoCaptureIsOn": true,
  "galleryIsOn": false,
  "stitchIsOn": false,
  "autoLightDetectionIsOn": false,
  "continuousAutoFocus": true
}
```

## W-2 (`w2`)

Android Full allows `W2`. iOS model presence in the vendored binary is **Unconfirmed**.

```json
{
  "dataExtractionEngine": "api",
  "documentTypes": ["w2"],
  "showDocumentTypes": false,
  "autoCaptureIsOn": false,
  "stitchIsOn": false,
  "galleryIsOn": true,
  "browseIsOn": true,
  "autoRotateIsOn": true,
  "cleanBorderIsOn": true,
  "returnStitchedPDF": true
}
```

## W-9 (`w9`)

```json
{
  "dataExtractionEngine": "api",
  "documentTypes": ["w9"],
  "showDocumentTypes": false,
  "autoCaptureIsOn": false,
  "stitchIsOn": false,
  "galleryIsOn": true,
  "browseIsOn": true,
  "autoRotateIsOn": true,
  "cleanBorderIsOn": true,
  "returnStitchedPDF": true
}
```

## Any-Documents

Do not ship a template name from this file alone. Guidance and the support escalation are in [templates/any-documents.md](templates/any-documents.md). The shape, after support confirms the template, is `documentTypes: ["any_document"]`, `anyDocumentTemplate` set to that name, `dataExtractionEngine: "api"`. Do not set `anyDocumentType` (deprecated local regex OCR).

## Do not combine

- `"mobile"` with `receipt`, `invoice`, `other`, `long_receipt`, `check`, `business_card`, `w2`, or `w9`
- `"api"` or `"none"` with `credit_card` when the host expects card data back from Lens
- `showHelpButton` and `showInfoButton` as two camera buttons
- `multiplePagesCaptureIsOn` and `multipleDocumentsIsOn` as one switch
- `backupDocsToGallery` true unless the host wants every scan copied into Photos
- `moreMenuIsOn` true unless end users should override capture behavior
- `dictateIsOn` true
- A Headless, Lite, or Remote Models recipe
