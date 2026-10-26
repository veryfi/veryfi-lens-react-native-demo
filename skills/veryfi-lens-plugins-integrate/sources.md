# Pinned sources

Read these trees. Do not bump them from this skill. Versions below are the `package.json`, `pubspec.yaml`, `plugin.xml`, or `csproj` values in that commit.

| Plugin | Path | Commit |
|--------|------|--------|
| Cordova | `/Users/veryfij/plugins/veryfi-lens-cordova-plugin-androidx` | `5d197c585c50389bbf830b48352825c31f776919` |
| React Native | `/Users/veryfij/plugins/veryfi-lens-react-plugin` | `d57624ab75654fbd026cf301197b83c0822c82a2` |
| Flutter | `/Users/veryfij/plugins/veryfi-lens-flutter-plugin` | `307c6bc6f18b502d9bec45289517099da581dc0c` |
| Capacitor | `/Users/veryfij/plugins/veryfi-lens-capacitor-plugin` | `558244333860701fea3b933bc5cf9de2df8b3f50` |
| MAUI / Xamarin | `/Users/veryfij/plugins/veryfi-lens-xamarin-plugin` | `ef01d6b2fe32fcb2db0a10c6b198d8f1597e868a` |

| Plugin | Public API read | Native bridge read |
|--------|-----------------|--------------------|
| Cordova `2.6.60` | `cordova-plugin-veryfi-lens/www/veryfi.js`, `plugin.xml`, `README.md` | `src/ios/Veryfi.m`, `src/android/Veryfi.java`, `src/android/Veryfi.gradle`, `Package.swift` |
| React Native `2.0.62` | `react-native-veryfi-lens/src/index.tsx`, `README.md` | `ios/VeryfiLens.swift`, `ios/VeryfiLens.m`, `android/.../VeryfiLensModule.kt`, `android/build.gradle`, `react-native-veryfi-lens.podspec` |
| Flutter `2.0.59` | `flutter-plugin-veryfi-lens/lib/lens.dart`, `pubspec.yaml`, `README.md` | `ios/veryfi/Sources/veryfi/VeryfiPlugin.swift`, `android/.../VeryfiPlugin.kt`, `ios/veryfi/Package.swift`, `android/build.gradle` |
| Capacitor `2.0.61` | `veryfi-lens-capacitor/src/definitions.ts`, `src/index.ts`, `src/web.ts`, `README.md`, `package.json` | `ios/Sources/VeryfiVeryfiLensCapacitor/VeryfiLensCapacitorPlugin.swift`, `android/.../VeryfiLensCapacitorPlugin.java`, `Package.swift`, `VeryfiVeryfiLensCapacitor.podspec`, `android/build.gradle` |
| MAUI `2.0.60` | `VeryfiLens.Maui/src/VeryfiLens.Sdk/VeryfiLensMaui.cs`, `IVeryfiLensDelegate.cs`, `IVeryfiLensAnalyticsDelegate.cs`, `VeryfiLensCredentials.cs`, sample `MainPage.xaml.cs`, repo `README.md` | `Platforms/iOS/VeryfiLens.ios.cs`, `Platforms/Android/VeryfiLens.android.cs`, `ios/native/.../VeryfiLensBridge.swift`, `android/native/.../VeryfiLensBridge.java` |

`lib/typescript/index.d.ts` in the React Native package is stale relative to `src/index.tsx` (it lists `setInfoView` and omits `closeCamera`). Do not treat that `.d.ts` as the export list.

iOS settings semantics: `veryfi-lens-ios` `VeryfiLensSettings` dictionary decoder and [../veryfi-lens-ios-integrate/flavor-matrix.md](../veryfi-lens-ios-integrate/flavor-matrix.md). `veryfi-lens-spm.git` is the Full UI package there.

## Not verified by unpacking

- Models embedded inside each vendored `VeryfiLens.xcframework`
- React Native iOS flavor, beyond the vendored file name `VeryfiLens.xcframework` and Android `veryfi-lens-sdk` with no flavor suffix
- Android `initWithJsonObject` behavior for every recipe key (Android SDK sources were not opened)
- That `npm install` succeeds for packages the README installs via private git
- Legacy `VeryfiNetBinding` method-by-method parity with `VeryfiLensBinding`. The legacy file `VeryfiNetBinding/iOSVeryfiBinding/ApiDefinition.cs` exposes `VeryfiLens` in namespace `VeryfiLensiOS` (`ConfigureWith`, `ShowCameraIn`, `UploadImagesWithPaths`). Use the MAUI guide for new hosts

## Files in this pack

- [SKILL.md](SKILL.md)
- [syntax.md](syntax.md)
- [cordova.md](cordova.md)
- [react-native.md](react-native.md)
- [flutter.md](flutter.md)
- [capacitor.md](capacitor.md)
- [maui.md](maui.md)
- [parity.md](parity.md)
- [recipes.md](recipes.md)
- [unbridged.md](unbridged.md)
- [troubleshooting.md](troubleshooting.md)
- [sources.md](sources.md)
