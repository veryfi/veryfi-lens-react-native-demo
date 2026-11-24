# OCR code strips

On-device OCR of a code printed on a strip. `documentTypes: ['code']`, `ocrType: 'strips'`, engine `"mobile"`. Caps are [ocr-code-caps.md](ocr-code-caps.md). Same binary, different `ocrType`.

## Binary limit

Android Full does **not** allow `CODE`. The camera will not open on Android. Do not add `veryfi-lens-ocr-sdk` in the host app. Say the current plugin cannot scan codes on Android until a flavor exists.

iOS `ocrType` `"strips"` is the default code mode. Whether the vendored xcframework contains the code models is **Unconfirmed**. Android acceptance of the `ocrType` key is **Unconfirmed** even on an OCR artifact.

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
  ocrType: 'strips',
  ocrRegex: '[A-Z0-9]{10}', // replace with the host pattern
  autoCaptureIsOn: true,
  galleryIsOn: false,
  stitchIsOn: false,
  autoLightDetectionIsOn: false,
  continuousAutoFocus: true,
};
```

Replace `ocrRegex`. The example is not a product default to ship unchanged.

## Present

```javascript
VeryfiLens.configureWithCredentials(credentials, settings, (ok) => {
  if (ok) VeryfiLens.showCamera();
});
```

`shareOCRFeedback()` sends the latest OCR image as a failing sample. It takes no arguments. Code success may omit the `status` `"done"` envelope.

## Do not

Point OCR at `"api"` and expect the same on-device code payload. Use `barcode` for barcodes. Set `showInfoButton`.
