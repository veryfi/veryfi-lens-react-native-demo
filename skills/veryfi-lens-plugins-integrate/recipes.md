# Recipes

One settings dictionary for every plugin. Pass it with the configure call in [syntax.md](syntax.md). Do not construct `VeryfiLens*Settings` subclasses.

These recipes run on the **Full** UI SDK the plugin links. They are not separate plugin packages. Receipts, long receipts, checks, cards, barcodes, OCR, W-2, and W-9 are `documentTypes` (and `ocrType` for caps versus strips) on that binary.

**Lite / App Clip:** unsupported. No recipe.

**Headless receipts and Headless credit cards:** unsupported. No recipe.

**Remote Models:** not in these commits. Future/planned. Do not set `retrieveCheckTiffIsOn` and promise a TIFF model download.

Start from **base**, then replace or add the keys in **one** focused recipe. Skip flags the host did not ask for.

Android `initWithJsonObject` acceptance of a key that is absent from the plugin README was not verified against the Android SDK source. Keys below are iOS `VeryfiLensSettings` dictionary names (camelCase) that the plugins forward. A key the iOS initializer does not read will not apply. Plugin READMEs also mention `dataExtractionEngine: "custom"` and `dataExtractionUrl`; the iOS decoder accepts only `api`, `mobile`, and `none`. Do not emit `"custom"`.

## Base

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
  "enableScreenshots": true
}
```

If the host must read files after the callback, or keep more than one package:

```json
{ "autoDeleteLocalResourcesAfterProcessing": false }
```

Who deletes those files: native `clearLensStorage()` is not bridged. See [unbridged.md](unbridged.md).

## Full (`full`)

Widest UI template on the linked Full binary: receipts, invoices, other, and long receipt. Use a narrower recipe when the host only needs one type.

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

`galleryIsOn` and `browseIsOn` only open those pickers inside the Lens camera. A host call to gallery or the document browser exists only where [parity.md](parity.md) says so. Cordova, Flutter, and Capacitor present with `showCamera` only.

`showDocumentTypes` must be true when more than one type is set, or the user cannot switch.

## Receipts (`receipts`)

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

`long_receipt` is a vertical multi-frame stitch. It is not the same switch as `stitchIsOn` on ordinary receipts. Keep both for this recipe.

## Checks (`checks`)

Capture and cloud extract. Check TIFF is a Remote Models feature and is not a current plugin binary.

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

Set `checksBackIsRequired` true only when both sides are mandatory. Leave `validateCheckCorners` false unless the host asked for that gate.

## Credit cards (`credit-cards`)

On-device only. Card data is not sent to the backend. `"mobile"` is required.

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

The Flutter README credit-card sample uses Dart assignment colons (`settings.galleryIsOn: false`), which is not valid Dart, and it refers to classes that `lens.dart` does not declare. Use the map above.

## Business cards (`business-cards`)

Plugin READMEs list `business_card` as a camera document type and do not say to use `"mobile"`. Use `"api"`.

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

`"mobile"` is the on-device engine for `barcode`.

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

`continuousAutoFocus` is the iOS close-up focus flag for small codes. It is not listed in the plugin READMEs. The plugins forward the dictionary; Android acceptance is **Unconfirmed**.

## OCR strips (`ocr-strips`)

`code` extracts on device. `ocrType` `"strips"` is the iOS default mode.

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

Same binary and document type as strips. Only `ocrType` changes. iOS `OCRType.caps` serializes as `"caps"`.

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

Plugin READMEs do not document `ocrType`. iOS reads `strips` and `caps`. Android acceptance is **Unconfirmed**.

## W-2 (`w2`)

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

## Do not combine

- `"mobile"` with `receipt`, `invoice`, `other`, `long_receipt`, `check`, `business_card`, `w2`, or `w9`
- `"api"` or `"none"` with `credit_card` when the host expects card data back from Lens (card extraction is the `"mobile"` path; card data stays on device)
- `showHelpButton` and `showInfoButton` as two camera buttons. Help wins the shared control, and `showInfoButton` is not a JSON view. See [unbridged.md](unbridged.md)
- `multiplePagesCaptureIsOn` and `multipleDocumentsIsOn` as one switch. The first keeps side-by-side crops. The second asks, on submit, whether images are separate packages
- `backupDocsToGallery` true unless the host wants every scan copied into Photos
- `moreMenuIsOn` true unless end users should override capture behavior
- `dictateIsOn` true
- A Headless or Lite recipe. There isn't one
