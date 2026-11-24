# Cordova

Public surface: `cordova.plugins.Veryfi.Lens` from `www/veryfi.js` (`plugin.xml` clobbers `cordova.plugins.Veryfi`). Version `2.6.60`. Commit in [sources.md](sources.md).

Full UI SDK. SPM `https://repo.veryfi.com/shared/lens/veryfi-lens-spm.git` (from `3.0.13`). Android `com.veryfi.lens:veryfi-lens-sdk:2.6.0.15`. Recipe: [recipes.md](recipes.md). There is no second package for receipts, checks, cards, OCR, W-2, W-9, Lite, or Headless.

## Install

README command:

```sh
cordova plugin add ssh://bitbucket.org/veryfi/cordova-plugin-veryfi-lens.git#[VERSION] --save
```

`plugin.xml` sets `android-minSdkVersion` 23 and `android-targetSdkVersion` 35. The README's min SDK 21 disagrees; follow `plugin.xml`.

`plugin.xml` merges iOS usage strings for camera, photo library, photo library add, location, contacts, calendars, speech, and microphone. Add a usage string only for a feature the recipe turns on. Camera is required for `showCamera`. Photo library is required when `galleryIsOn` or `backupDocsToGallery` is true. Location only when `locationServicesIsOn` is true. The base recipe leaves location, dictate, and gallery backup off.

Android Maven needs `MAVEN_VERYFI_URL`, `MAVEN_VERYFI_USERNAME`, and `MAVEN_VERYFI_PASSWORD` (`src/android/Veryfi.gradle`).

## Configure and present

`init` stores arguments. `showCamera` builds the auth object `{ url, clientId, userName, apiKey }`, sends `[auth, settings]`, and on both platforms configures then calls native `showCamera`.

```javascript
var settings = { /* base + one recipe */ };
cordova.plugins.Veryfi.Lens.init(false, 'https://api.veryfi.com/', clientId, username, apiKey, settings);
cordova.plugins.Veryfi.Lens.showCamera(onLens, onLaunchError);

function onLens(response) {
  var json = JSON.parse(response);
  switch (json.event) {
    case 'veryfi_lens_close':
      break;
    case 'veryfi_lens_update':
      if (json.msg === 'img_original_path' || json.msg === 'img_thumbnail_path' || json.msg === 'img_stitched_pdf_path') {
        cordova.plugins.Veryfi.Lens.getFileBase64(json, function (b64) {}, function () {});
      }
      break;
    case 'veryfi_lens_success':
      break;
    case 'veryfi_lens_error':
      break;
  }
}
```

`getFileBase64` passes the object through. Native reads `data` as the path. Pass the update object, not a raw string.

Success `status` documented in the README is `done`, `msg` `results`, body in `data`.

## Other calls

```javascript
cordova.plugins.Veryfi.Lens.retryPackage(packageId, function () {}, function () {});
cordova.plugins.Veryfi.Lens.retryAllPackages(function () {}, function () {});
cordova.plugins.Veryfi.Lens.discardPackage(packageId, function () {}, function () {});
cordova.plugins.Veryfi.Lens.discardAllPackages(function () {}, function () {});
cordova.plugins.Veryfi.Lens.shareOCRFeedback(function () {}, function () {});
cordova.plugins.Veryfi.Lens.observeAnalyticsEvents(function (payload) {}, function () {});
```

`retryPackage` in JS takes only the id. iOS `Veryfi.m` also reads arguments 1 and 2 (metadata, image source tag) which this JS function does not send. Android uses the id only. Do not add extra JS arguments.

Analytics is a separate callback from camera events. iOS observes `VeryfiLensAnalyticsEvent`. Android listens for the secure analytics broadcast and returns a JSON string.

## Not on this plugin

`showGallery`, `showDocumentBrowser`, `closeCamera`, `uploadImages`, `headlessUpload`, Headless `process`, Lite, `onHelpButtonClicked`, `VeryfiInfoView`. In-camera gallery still depends on `galleryIsOn` inside the camera `showCamera` opens.

`showInfoButton` in the settings object does not install a host view. See [unbridged.md](unbridged.md).
