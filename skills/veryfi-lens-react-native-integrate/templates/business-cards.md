# Business cards

Cloud extract for `business_card`. The README lists this type and does not say to use `"mobile"`. Use `"api"`. Android Full allows `BUSINESS_CARD`. iOS model presence is **Unconfirmed**.

## Permissions

Camera. Gallery is off in this recipe, so the photo-library key is unnecessary unless the host turns `galleryIsOn` on or calls `showGallery()`.

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
  documentTypes: ['business_card'],
  showDocumentTypes: false,
  autoCaptureIsOn: false,
  galleryIsOn: false,
  stitchIsOn: false,
  autoRotateIsOn: true,
  autoDocDetectionAndCropIsOn: true,
  cleanBorderIsOn: true,
};
```

## Present

```javascript
VeryfiLens.configureWithCredentials(credentials, settings, (ok) => {
  if (ok) VeryfiLens.showCamera();
});
```

## Do not

Use `"mobile"`. Treat a business card as Any-Documents. Set `stitchIsOn` true. This is not a credit card: card data rules do not apply, and the image is processed in the cloud.
