# Any-Documents

Any-Documents is an open solution: `documentTypes` is `any_document` and `anyDocumentTemplate` names the document. It is not a KYC-only product and not a medical-only product. The template list is not closed. A type that is not supported yet can be arranged with support.

Shortcut flavors of the same solution, not separate plugins: nutrition facts, US passport, driver license, and prescription labels.

## Do this before writing a template name

This plugin vendors `VeryfiLens.xcframework` and links Android `veryfi-lens-sdk`. This pack did not unpack the iOS binary and did not verify which Any-Documents templates that Full build contains. Android Full allows the `ANY_DOCUMENT` type. That is not proof a given template string is entitled or bundled.

Contact support to:

1. Confirm the account already has the template, or
2. Arrange support for a template, including one that does not exist yet.

Until that reply, do not put a guessed `anyDocumentTemplate` in the host. Do not set `anyDocumentType` (deprecated local regex OCR: `ine`, `passport`, `colombian_id`, `health_care`, `driver_license`).

## Shape after support confirms a name

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
  documentTypes: ['any_document'],
  anyDocumentTemplate: '<name support confirmed>',
  showDocumentTypes: false,
  cameraProcessingMode: 'card', // 'document' for a page-shaped label
  stitchIsOn: false,
  galleryIsOn: false,
  browseIsOn: false,
  autoCaptureIsOn: false,
  autoRotateIsOn: true,
  cleanBorderIsOn: true,
  autoDocDetectionAndCropIsOn: true,
  returnStitchedPDF: true,
};
```

`cameraProcessingMode` is for `any_document`. Using it on other types is **Unconfirmed**.

Back of an any-document, only when support wants it:

```javascript
settings.anyDocumentBackIsOn = true;
settings.anyDocumentBackIsRequired = false; // true forces the back
settings.packageMaxScans = 2; // must be exactly 2 or the prompt is skipped
```

Checks, driver licenses, and insurance cards do not use `anyDocumentBack*`. They have their own back flags. Driver-license and insurance backs are not this template unless support placed them on an any-document template.

Optional face sequence: `identityVerificationIsOn: true`. Confirm the account wants it.

## Present

Same as other recipes: listeners, then `configureWithCredentials`, then `showCamera()` only if the callback is true. Android can open an `any_document` camera and still fail extraction if the template is unknown. Treat a failed extract as a support issue, not a reason to switch engines to `"mobile"`.

## Do not

- Invent `us_passport`, `nutrition_facts`, or any other string because a shortcut flavor exists in native docs
- Install a nutrition, passport, or prescription pod. This plugin has one binary
- Set `documentFieldsToDetect` or `fraudDetectionIsOn` and call the feature enabled
- Use Headless or Lite. Both are unsupported here
