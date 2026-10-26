# Long receipts

Vertical multi-frame stitch (`long_receipt`). It is not ordinary `stitchIsOn` on a receipt. Android Full allows `LONG_RECEIPT`. iOS presence inside the vendored xcframework was not unpacked (**Unconfirmed**).

## Permissions

Camera. Photo library if `galleryIsOn` stays true.

## Settings

One type, so the picker stays off. Keep `stitchIsOn` true together with the document type.

```javascript
const settings = {
  ignoreRemoteSettings: true,
  backupDocsToGallery: false,
  backupDocsToiCloud: false,
  moreSettingsMenuIsOn: false,
  moreMenuIsOn: false,
  autoCaptureOtherIsOn: false,
  showNoDocumentDetectedWarning: false,
  dictateIsOn: false,
  locationServicesIsOn: false,
  glareDetectionIsOn: false,
  enableScreenshots: true,

  dataExtractionEngine: 'api',
  documentTypes: ['long_receipt'],
  showDocumentTypes: false,
  stitchIsOn: true,
  multiplePagesCaptureIsOn: true,
  returnStitchedPDF: true,
  autoCaptureIsOn: false,
  autoDocDetectionAndCropIsOn: true,
  galleryIsOn: true,
};
```

`showGuideCounter` is how often the built-in long-receipt guide auto-shows. Zero disables that. `showHelpButton` plus `showDefaultScanningGuide` replays it. A custom screen uses `showDefaultScanningGuide: false` and `showHelpScreen`.

## Present

```javascript
VeryfiLens.configureWithCredentials(credentials, settings, (ok) => {
  if (ok) VeryfiLens.showCamera();
});
```

Watch `onVeryfiLensUpdate` for `img_stitched_pdf_path` when `returnStitchedPDF` is true.

## Do not

Replace this template with `documentTypes: ['receipt']` and `stitchIsOn` alone. Do not promise check TIFF or Remote Models here.
