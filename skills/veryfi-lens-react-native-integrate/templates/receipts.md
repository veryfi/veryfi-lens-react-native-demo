# Receipts

Receipts, invoices, and other documents on the Full binary. Long receipts are [long-receipts.md](long-receipts.md). Install and listeners: [install.md](../install.md), [implementation.md](../implementation.md).

## Permissions

Camera usage string. Photo library usage because gallery is on. No photo-add key (backups off). No location key.

## Settings

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
  documentTypes: ['receipt', 'invoice', 'other'],
  showDocumentTypes: true, // required so the user can switch
  defaultSelectedDocumentType: 'receipt',
  autoSubmitDocumentOnCapture: false,
  imagePreviewIsOn: true,
  galleryIsOn: true,
  browseIsOn: true,
  autoCaptureIsOn: false,
  autoDocDetectionAndCropIsOn: true,
  autoRotateIsOn: true,
  autoSkewCorrectionIsOn: true,
  cleanBorderIsOn: true,
  stitchIsOn: true,
  multiplePagesCaptureIsOn: true,
  multipleDocumentsIsOn: true,
  returnStitchedPDF: true,
  packageMaxScans: 10,
  closeCameraOnSubmit: true,
};
```

Keep local files across callbacks with `autoDeleteLocalResourcesAfterProcessing: false`.

## Present

```javascript
VeryfiLens.configureWithCredentials(credentials, settings, (ok) => {
  if (ok) VeryfiLens.showCamera();
});
```

Success `status` `"done"` carries extraction `data` when the engine is `"api"`. Image paths arrive earlier on `onVeryfiLensUpdate` (`img_original_path`, `img_thumbnail_path`, and `img_stitched_pdf_path` when a PDF was produced). Read them with `getFileBase64(event.data, onError, onSuccess)` before Lens deletes them.

## Do not

Set `"mobile"` for these types. Do not treat `multiplePagesCaptureIsOn` and `multipleDocumentsIsOn` as one switch.
