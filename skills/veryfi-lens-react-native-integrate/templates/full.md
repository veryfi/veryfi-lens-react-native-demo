# Full UI recipe

Use when the host captures receipts, invoices, other documents, and long receipts in one camera. This is a settings recipe on the Full binary the plugin already links. It is not a second package. Narrower products have their own templates.

Android Full allows these four types. Whether the vendored iOS `VeryfiLens.xcframework` embeds `long_receipt` was not unpacked (**Unconfirmed**). If long-receipt detection fails on iOS, ask support about models. Do not add another pod.

Client settings are a dictionary. Wire-up is [implementation.md](../implementation.md). Install is [install.md](../install.md).

## Permissions

`NSCameraUsageDescription`. Photo library usage because `galleryIsOn` is true. Do not add the photo-library **add** key: backups are off. Do not add location.

## Settings

Base hardening, then the Full recipe. `showDocumentTypes` stays true because more than one type is set.

```javascript
const settings = {
  ignoreRemoteSettings: true, // dashboard lens_settings must not overwrite this object
  backupDocsToGallery: false, // default true copies every scan into Photos
  backupDocsToiCloud: false,
  moreSettingsMenuIsOn: false,
  moreMenuIsOn: false, // Android would otherwise restore stored user overrides
  autoCaptureOtherIsOn: false, // default true auto-captures "other"
  showNoDocumentDetectedWarning: false,
  dictateIsOn: false, // obsolete
  locationServicesIsOn: false,
  glareDetectionIsOn: false, // Android default true
  enableScreenshots: true, // device UI capture; imports are allowSubmittingScreenshots

  dataExtractionEngine: 'api',
  documentTypes: ['receipt', 'invoice', 'other', 'long_receipt'],
  showDocumentTypes: true,
  defaultSelectedDocumentType: 'receipt',
  autoSubmitDocumentOnCapture: false,
  batchUploadOnCamera: false,
  imagePreviewIsOn: true,
  galleryIsOn: true, // in-camera control, not showGallery()
  browseIsOn: true, // hidden while moreMenuIsOn is false
  showBrowserButton: false,
  autoCaptureIsOn: false,
  autoDocDetectionAndCropIsOn: true,
  autoRotateIsOn: true,
  autoSkewCorrectionIsOn: true,
  cleanBorderIsOn: true,
  dewarpingIsOn: false,
  stitchIsOn: true,
  stitchOtherIsOn: false,
  multipleDocumentsIsOn: true, // submit preview can split packages
  multiplePagesCaptureIsOn: true, // side-by-side crops stay separate
  singleScanPackages: false,
  returnStitchedPDF: true,
  packageMaxScans: 10,
  closeCameraOnSubmit: true,
  sameFileUploadPreventionPolicy: 'session',
  allowSubmittingScreenshots: true,
  webhookIsOn: false,
  autoDeleteAfterProcessing: false, // server delete, not local files
};
```

If the host reads image paths after the callback, also set `autoDeleteLocalResourcesAfterProcessing: false`. `clearLensStorage` is not bridged.

## Present

Listen on `VeryfiLens.NativeModule` first ([implementation.md](../implementation.md)). Then:

```javascript
VeryfiLens.configureWithCredentials(credentials, settings, (ok) => {
  if (ok) VeryfiLens.showCamera();
});
```

Gallery-only or Files-only sessions call `showGallery()` or `showDocumentBrowser()` instead, not in addition.

## Do not

Add `credit_card` or `code` to this list on Android. Do not set `showInfoButton`, `dictateIsOn`, or `"custom"`. Paid field detection is not this binary.
