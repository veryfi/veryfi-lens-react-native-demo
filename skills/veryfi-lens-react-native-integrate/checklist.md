# Checklist

Copy into the handoff. Fill every line. Details live in the linked files; this list is the gate.

```
React Native Lens:
- [ ] Path: quick or guided
- [ ] Package @veryfi/react-native-veryfi-lens, syntax from 2.0.62
- [ ] New architecture off (Podfile and android/settings.gradle)
- [ ] NSCameraUsageDescription added
- [ ] Photo, location, speech, contacts, calendar keys only if that feature is on
- [ ] Maven credentials not committed
- [ ] Listeners on VeryfiLens.NativeModule before configure
- [ ] Credentials use userName
- [ ] Base hardening from recipes.md
- [ ] One template only
- [ ] dataExtractionEngine is api, mobile, or none
- [ ] mobile only for credit_card, code, or barcode
- [ ] Credit card stays on device
- [ ] Android Full warning if the type is credit_card or code
- [ ] showInfoButton omitted
- [ ] dictateIsOn false, backups false, moreMenuIsOn false, ignoreRemoteSettings true
- [ ] configure callback gates the one presentation call
- [ ] autoDeleteLocalResourcesAfterProcessing false if files are read later
- [ ] clearLensStorage not called (not bridged)
- [ ] retry metadata described as iOS-only
- [ ] No Headless, Lite, or Remote Models package
- [ ] Any-Documents template not invented
- [ ] conflicts.md reviewed
- [ ] Unconfirmed items named in the handoff
```

## Handoff card

```
React Native route:
- Path:
- Product: UI SDK Full (veryfi-lens-sdk 2.7.0.4 / vendored VeryfiLens.xcframework)
- Presentation:
- Documents:
- Recipe:
- Assumptions:
- Not bridged:
- Android limit:
- Unconfirmed:
```
