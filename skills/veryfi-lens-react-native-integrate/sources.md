# Source record

Do not bump this pin from the skill. Syntax below was read at this commit.

| | |
|--|--|
| Plugin | React Native Veryfi Lens |
| Package | `@veryfi/react-native-veryfi-lens` |
| Version | `2.0.62` (`react-native-veryfi-lens/package.json`) |
| Path | `/Users/veryfij/plugins/veryfi-lens-react-plugin` |
| Commit | `d57624ab75654fbd026cf301197b83c0822c82a2` |

## Files read

| Role | Path |
|------|------|
| Public JS | `react-native-veryfi-lens/src/index.tsx` |
| Stale types | `react-native-veryfi-lens/lib/typescript/index.d.ts` |
| iOS bridge | `react-native-veryfi-lens/ios/VeryfiLens.swift` |
| iOS exports | `react-native-veryfi-lens/ios/VeryfiLens.m` |
| Android bridge | `react-native-veryfi-lens/android/src/main/java/com/reactnativeveryfilens/VeryfiLensModule.kt` |
| Android Gradle | `react-native-veryfi-lens/android/build.gradle` |
| Podspec | `react-native-veryfi-lens/react-native-veryfi-lens.podspec` |
| README | `react-native-veryfi-lens/README.md` |

Native module name: `VeryfiLens` (`RCT_EXTERN_REMAP_MODULE` and Android `getName()`).

## Versions inside the plugin

| Side | What the files say |
|------|--------------------|
| Android | `implementation "com.veryfi.lens:veryfi-lens-sdk:2.7.0.4"`, `minSdkVersion` 24 |
| iOS | Vendored `Frameworks/VeryfiLens.xcframework`, plus `AWSCore.xcframework` and `AWSS3.xcframework`. Pod iOS `15.0` |

## Not verified by unpacking or running

- Models inside `Frameworks/VeryfiLens.xcframework`. The file name is shared by several UI flavors
- That `yarn add` of the private git URL succeeds in this environment
- Android `initWithJsonObject` for every recipe key. Keys are iOS `VeryfiLensSettings` dictionary names the plugin forwards. Android Full's allowed `documentTypes` are recorded from the Android SDK flavor table, not by executing this plugin
- Whether `VeryfiLens.startObserving()` / `stopObserving()` from JavaScript reach the iOS overrides. `src/index.tsx` calls them. `VeryfiLens.m` does not list them as `RCT_EXTERN_METHOD`. Android has no matching `@ReactMethod`
- Runtime of Help-screen presentation (new-architecture flag, missing root view)

`lib/typescript/index.d.ts` lists `setInfoView` and omits `closeCamera`. `src/index.tsx` exports `closeCamera` and does not export `setInfoView`.
