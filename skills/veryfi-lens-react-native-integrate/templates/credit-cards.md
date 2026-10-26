# Credit cards

On-device extraction only. Card data is never sent to the backend. Engine `"mobile"` and `documentTypes: ['credit_card']`.

## Binary limit

Android dependency `com.veryfi.lens:veryfi-lens-sdk:2.7.0.4` is the Full artifact. Android Full does **not** allow `CREDIT_CARD`. `showCamera` shows a Toast, logs an error, and does not open (no delegate callback). Do not add `veryfi-lens-credit-cards-sdk` in the host. A future plugin flavor would have to link that artifact. Say **unsupported on Android with the current plugin** and still show the dictionary so an iOS-only host, or a later flavor, has the right settings.

iOS: the vendored `VeryfiLens.xcframework` was not unpacked. Whether it contains credit-card models is **Unconfirmed**. If the camera opens and nothing reads the card, ask support before changing settings.

Android `configure` forces in-app extraction when the first type is a credit card. Keep `"mobile"` anyway. Gallery stays off.

## Permissions

Camera only. No photo library (gallery is off). No photo-add key.

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
  documentTypes: ['credit_card'],
  showDocumentTypes: false,
  autoCaptureIsOn: true,
  galleryIsOn: false,
  stitchIsOn: false,
  autoLightDetectionIsOn: false,
  autoRotateIsOn: true,
  cropLayoutIsOn: true, // Android hybrid mode also needs this
  cropLayoutWithAutoDetection: true,
  cropLayoutWidth: 80,
  cropLayoutHeight: 25,
  cropLayoutCornerRadius: 15, // visual; saved crop stays rectangular
  cropLayoutStroke: 16,
  cropLayoutBorderColor: '#FFFFFFFF',
};
```

## Present

```javascript
VeryfiLens.configureWithCredentials(credentials, settings, (ok) => {
  if (ok) VeryfiLens.showCamera();
});
```

Card results are local. Do not post the success payload to the Veryfi document API. Do not require `status === "done"` when the native card result does not use that envelope.

There is no Headless credit-card API on this plugin. Do not imitate it with `showCamera` and a custom camera.

## Do not

Set `"api"` or `"none"` when the host expects card numbers back from Lens. Set `showInfoButton`. Enable fraud detection and claim it is on.
