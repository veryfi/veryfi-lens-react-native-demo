# Install

Package `@veryfi/react-native-veryfi-lens` version `2.0.62`. Import the default export. The `react-native` field in `package.json` points at `src/index`. The published `types` field points at `lib/typescript/index.d.ts`, which drifts from `src/index.tsx` ([sources.md](sources.md)).

## Add the package

The README installs from private git over SSH, not from a public npm name:

```sh
yarn add ssh://bitbucket.org/veryfi/react-native-veryfi-lens.git#2.0.62
```

Replace the tag only when the host is pinning a different release. This skill's syntax is the `2.0.62` tree. Hub SSH keys: https://hub.veryfi.com/api/settings/keys/

The README's sample import is `react-native-veryfi-lens`. `package.json` `name` is `@veryfi/react-native-veryfi-lens`. Import the package name that the install actually resolves. Do not invent a second package.

Then `yarn`, and in `ios/` run `pod install`.

## New architecture: off

The pinned README says the new architecture is not supported yet. Keep both flags off:

```ruby
ENV['RCT_NEW_ARCH_ENABLED'] = '0'
```

Put that on the first line of the host `Podfile`. In `android/settings.gradle`:

```
newArchEnabled=false
```

`showHelpScreen` in `src/index.tsx` still passes `global.nativeFabricUIManager !== undefined` as the second native argument. Call it with the component name only. Do not flip the architecture on so that flag becomes true.

The README also shows `SoLoader.init(this, OpenSourceMergedSoMapping)` in `MainApplication.onCreate` for React Native 0.76. Follow that when the host is on the README's React Native line. This skill does not change the host's React Native version.

## iOS

Podspec: iOS deployment target `15.0`. Vendored frameworks:

- `Frameworks/VeryfiLens.xcframework`
- `Frameworks/AWSCore.xcframework`
- `Frameworks/AWSS3.xcframework`

Dependencies: `React-Core`, `React-RCTAppDelegate`, `ReactAppDependencyProvider`.

If the iOS app is Objective-C only, the README says to add a Swift file so Xcode creates a bridging header. Bitcode: No. Validate Workspace: Yes.

### Info.plist

The README block does **not** include `NSCameraUsageDescription`. Add it. Camera will not be usable without a camera usage string.

| Key | When |
|-----|------|
| `NSCameraUsageDescription` | `showCamera`. Add it even though the README sample omits it |
| `NSPhotoLibraryUsageDescription` | `galleryIsOn`, `showGallery`, or in-camera browse that reads photos |
| `NSPhotoLibraryAddUsageDescription` | only if `backupDocsToGallery` is true. Base recipe sets it false |
| `NSLocationWhenInUseUsageDescription` | only if `locationServicesIsOn` is true. Base recipe sets it false |
| `NSLocationAlwaysAndWhenInUseUsageDescription` | only if the host already uses always-location. Not required by the base recipe |
| `NSSpeechRecognitionUsageDescription` | only if dictate were on. Dictate is obsolete; leave it off and omit this key |
| `NSContactsUsageDescription` / `NSCalendarsUsageDescription` | README lists them. Current Lens features that need them are **Unconfirmed** / likely stale. Omit unless the host already uses those features |

## Android

Plugin `minSdkVersion` is **24**. Match the app `minSdkVersion`. The README also sets NDK ABI filters `armeabi-v7a`, `arm64-v8a`, `x86`, `x86_64`, Java 17, and `pickFirst` on `libc++_shared.so` for those ABIs. Copy that packaging block when the app does not already have it.

Dependency inside the plugin, not a host `implementation` line the host should duplicate:

```
com.veryfi.lens:veryfi-lens-sdk:2.7.0.4
```

Maven: `https://nexus.veryfi.com/repository/maven-releases/` with `MAVEN_VERYFI_USERNAME` and `MAVEN_VERYFI_PASSWORD`. Do not copy a password into the repo. Keep credentials in the environment or CI secrets.

That coordinate is the Full UI artifact. It has no flavor suffix. Do not add `veryfi-lens-receipts-sdk`, `veryfi-lens-cheques-sdk`, `veryfi-lens-credit-cards-sdk`, `veryfi-lens-ocr-sdk`, `veryfi-lens-lite-sdk`, a Headless artifact, or `veryfi-lens-remote-models-sdk` beside it.

Android Full allows receipt, long receipt, other, any document, check, business card, invoice, W-2, W-9, barcode, and several identity types. It does **not** allow `CREDIT_CARD` or `CODE`. `showCamera` then shows a Toast, logs an error, and does not open the camera (no delegate callback). See [templates/credit-cards.md](templates/credit-cards.md) and the OCR templates.

## Size

When size matters, the native recommendation is Remote Models: heavy models download after install. This plugin does not ship that variant. Remote Models variants of the plugins are planned.

Measure the final release product once with this dependency and once without it. The vendored XCFramework and the Android AAR are fat artifacts (every architecture and platform slice). Neither number is the size added to the installed app. [SDK binary sizes](https://docs.veryfi.com/lens/mobile/settings/sdk_binary_sizes/).
