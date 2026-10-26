# Barcodes

On-device barcode capture. `"mobile"` and `documentTypes: ['barcode']`. Android Full allows `BARCODE`. iOS model presence in the vendored framework is **Unconfirmed**.

## Permissions

Camera. Gallery is off.

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

  dataExtractionEngine: 'mobile',
  documentTypes: ['barcode'],
  showDocumentTypes: false,
  autoCaptureIsOn: true,
  galleryIsOn: false,
  stitchIsOn: false,
  autoLightDetectionIsOn: false,
  continuousAutoFocus: true, // close-up focus; Android acceptance Unconfirmed
  dewarpingIsOn: true,
  cleanBorderIsOn: true,
  autoRotateIsOn: true,
};
```

## Present

```javascript
VeryfiLens.configureWithCredentials(credentials, settings, (ok) => {
  if (ok) VeryfiLens.showCamera();
});
```

Barcode success JSON may be the result object itself, without `status` `"done"`. Read the payload you receive. Do not drop it for lacking the package envelope.

`continuousAutoFocus` is not in the plugin README. If Android ignores it, capture still runs; say the focus flag is **Unconfirmed** on Android.

## Do not

Use `"api"` when the host wants the on-device barcode result from Lens. This is not OCR `code` (strips and caps). Do not set `ocrType` here.
