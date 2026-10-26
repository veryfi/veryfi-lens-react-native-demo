# Flutter

Public surface: `lib/lens.dart`, class `Veryfi`. Package name `veryfi` `2.0.59`. Import `package:veryfi/lens.dart`. Commit in [sources.md](sources.md).

`pubspec.yaml` environment: Dart `sdk: ^3.11.0`, Flutter `>=3.41.0`. Channel `veryfi`. Analytics channel `lens_analytics_events`.

iOS SPM `https://repo.veryfi.com/shared/lens/veryfi-lens-spm.git` from `3.0.19` (`ios/veryfi/Package.swift`). Android `com.veryfi.lens:veryfi-lens-sdk:2.7.0.2`, `minSdkVersion` 23. Full UI SDK. Recipes: [recipes.md](recipes.md).

The README's `VeryfiLensCredentials` and `VeryfiLensSettings` types are not declared in `lens.dart`. Do not generate them.

## Install

```yaml
dependencies:
  veryfi:
    git:
      url: git@bitbucket.org:veryfi/flutter-plugin-veryfi-lens.git
      ref: [VERSION]
```

Android Maven env: `MAVEN_VERYFI_USERNAME`, `MAVEN_VERYFI_PASSWORD` (README). README Info.plist keys: camera, location always, location when in use, photo library add, photo library, contacts, calendars. Keep location and contacts out unless the recipe enables them.

README also says Android min SDK 21 and Kotlin `1.5.31`. The plugin `android/build.gradle` sets `minSdkVersion` 23. Follow the Gradle file for min SDK.

## Configure, delegate, present

```dart
import 'package:veryfi/lens.dart';

void onLens(LensEvent event, Map<String, dynamic> response) {
  switch (event) {
    case LensEvent.close:
      break;
    case LensEvent.update:
      final msg = response['msg'];
      final path = response['data'];
      break;
    case LensEvent.success:
      break;
    case LensEvent.error:
      break;
  }
}

Future<void> startLens(Map<String, dynamic> settings) async {
  Veryfi.setDelegate(onLens);
  await Veryfi.initLens({
    'url': 'https://api.veryfi.com/',
    'clientId': clientId,
    'userName': username,
    'apiKey': apiKey,
  }, settings);
  await Veryfi.showCamera();
}
```

Credential key is `userName`, matching Android `rawCredentials["userName"]` and iOS `Keys.userName`.

Native event method names handled in Dart: `veryfiLensClose`, `veryfiLensError`, `veryfiLensSuccess`, `veryfiLensUpdate`.

## Completion gap

`Veryfi.initLens` and `Veryfi.showCamera` `await` the method channel. In this commit, iOS `veryfiInitLens` and Android `initLens` call `configure` and do not call the success `result`. The same pattern holds for several other happy paths (the iOS file calls `result` for argument errors and `FlutterMethodNotImplemented` only). An `await` may not complete even though configure ran. Do not invent a completion callback. If the await does not return, treat it as that source gap, not as a missing recipe key. See [troubleshooting.md](troubleshooting.md).

## Other calls

```dart
await Veryfi.retryPackage(packageId, metadata, imageSourceTag);
await Veryfi.retryAllPackages();
await Veryfi.discardPackage(packageId);
await Veryfi.discardAllPackages();
await Veryfi.shareOCRFeedback();
await Veryfi.observeAnalyticsEvents();
Veryfi.analyticsStream.listen((event) {});
```

`lens.dart` puts the tag on the channel under the key `imageSourceData`. iOS `VeryfiPlugin.swift` reads `imageSourceTag`. Those names differ, so the iOS `if let` fails and the plugin returns `retryPackageError` ("Package ID must be sent to retry the upload") even when the Dart caller passed a tag. Do not add a second Dart parameter; the public method already takes `imageSourceTag` and hardcodes the channel key. Android retry uses `packageID` only and does not read either key.

Call `observeAnalyticsEvents` once. It subscribes to the event channel and then invokes the native method.

## Not on this plugin

`showGallery`, `showDocumentBrowser`, `closeCamera`, `getFileBase64`, `uploadImages`, Headless, Lite, help-button events, `VeryfiInfoView`. Image paths still arrive on `LensEvent.update` as `data` when the native payload includes them. The host reads the file itself; there is no base64 helper.

`showInfoButton` in the map is not a Flutter widget. See [unbridged.md](unbridged.md).
