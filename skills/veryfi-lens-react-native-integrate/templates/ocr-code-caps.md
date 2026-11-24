# OCR bottle caps

Same document type and engine as strips. Only `ocrType` changes to `"caps"`. iOS serializes that mode as `caps`. Android Full still rejects `CODE`, so this recipe does not open the camera on Android. iOS models are **Unconfirmed**. `ocrType` on Android is **Unconfirmed**.

## Permissions

Camera only.

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
  documentTypes: ['code'],
  showDocumentTypes: false,
  ocrType: 'caps',
  ocrRegex: '[A-Z0-9]{10}', // replace with the host pattern
  autoCaptureIsOn: true,
  galleryIsOn: false,
  stitchIsOn: false,
  autoLightDetectionIsOn: false,
  continuousAutoFocus: true, // close-up focus for caps
};
```

## Present

```javascript
VeryfiLens.configureWithCredentials(credentials, settings, (ok) => {
  if (ok) VeryfiLens.showCamera();
});
```

`shareOCRFeedback()` is the bridged way to send a bad read. There is no second plugin for caps.

## Do not

Ship the sample regex as the customer's pattern. Use `strips` for flat strips. Promise Android capture on `veryfi-lens-sdk`.
