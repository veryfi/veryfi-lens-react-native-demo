---
name: veryfi-lens-react-native-integrate
description: >-
  Integrates Veryfi Lens into React Native with @veryfi/react-native-veryfi-lens
  2.0.62: private-git install, configureWithCredentials, NativeEventEmitter events,
  iOS and Android bridge differences, and Full-SDK recipes for receipts, long
  receipts, checks, credit cards, business cards, barcodes, OCR strips/caps,
  W-2, and W-9, plus Any-Documents support escalation. Use when adding Veryfi
  Lens to React Native, wiring listeners, or choosing a document recipe.
---

# Veryfi Lens React Native

Walk a React Native host from install to a working first scan. Prefer the fewest settings. Do not invent methods, event names, or settings keys.

Facts were read from `@veryfi/react-native-veryfi-lens` `2.0.62` at commit `d57624ab75654fbd026cf301197b83c0822c82a2`. Public JavaScript is `react-native-veryfi-lens/src/index.tsx`. If a fact is not in that plugin or in the Lens settings semantics recorded here, mark it **Unconfirmed** and leave it out of host code. Record: [sources.md](sources.md).

**Settings are a JSON dictionary** of Lens keys. Do not construct `VeryfiLensReceiptsSettings` or any `VeryfiLens*Settings` subclass.

**Ignore `lib/typescript/index.d.ts` when it disagrees with `src/index.tsx`.** That `.d.ts` lists `setInfoView` and omits `closeCamera`. `setInfoView` is not a method in `src/index.tsx` or `VeryfiLens.swift`.

The plugin links the **Full** UI SDK. Android is `com.veryfi.lens:veryfi-lens-sdk:2.7.0.4`. iOS vendors `Frameworks/VeryfiLens.xcframework` (that file name is shared by several UI flavors; this pack did not unpack it). Product choice is a settings recipe on that binary, not a second npm package.

## Pick a workflow

- **Quick** — the host already named the document. Ask nothing else. Apply base hardening plus one template, then state the assumptions.
- **Guided** — anything important is missing. Ask only the missing questions below, in one message, then continue.

### Quick

```
Lens React Native quick:
- [ ] Map request → one template
- [ ] Install + new architecture off + plist/Gradle (install.md)
- [ ] Listen on VeryfiLens.NativeModule before configure
- [ ] Base hardening + one recipe
- [ ] configureWithCredentials; present only when the callback is true
- [ ] One of showCamera, showGallery, showDocumentBrowser
- [ ] Handle close / update / success / error
- [ ] Run conflicts.md
```

Assumptions when the host did not say: Full UI binary the plugin already links, camera, `documentTypes` `receipt`, engine `"api"`, review then submit, gallery and in-camera browse on, backups off, More menu off, dictate off.

### Guided

Ask only what is unknown:

1. **Documents** — receipt, invoice, other, long receipt, check, credit card, business card, barcode, OCR strip, OCR cap, W-2, W-9, or another document (Any-Documents).
2. **Extract** — Veryfi Cloud (`"api"`), on-device (`"mobile"`, only `credit_card`, `code`, `barcode`), or the customer runs Process a Document later (`"none"`).
3. **UX** — review then submit, auto-submit, or batch until max.
4. **Entry** — camera, gallery, or the document browser. Files after capture: keep them, or let Lens delete them.

## Templates

| Product | Template |
|---------|----------|
| Full / several receipt-like types | [templates/full.md](templates/full.md) |
| Receipts | [templates/receipts.md](templates/receipts.md) |
| Long receipts | [templates/long-receipts.md](templates/long-receipts.md) |
| Checks | [templates/checks.md](templates/checks.md) |
| Credit cards | [templates/credit-cards.md](templates/credit-cards.md) |
| Business cards | [templates/business-cards.md](templates/business-cards.md) |
| Barcodes | [templates/barcodes.md](templates/barcodes.md) |
| OCR code strips | [templates/ocr-code-strips.md](templates/ocr-code-strips.md) |
| OCR bottle caps | [templates/ocr-code-caps.md](templates/ocr-code-caps.md) |
| W-2 | [templates/w2.md](templates/w2.md) |
| W-9 | [templates/w9.md](templates/w9.md) |
| Any-Documents | [templates/any-documents.md](templates/any-documents.md) |

Open one template. Shared references, one level deep:

- [install.md](install.md) — git install, new architecture, plist, Maven, size
- [implementation.md](implementation.md) — configure, events, callbacks, files, entry points, iOS vs Android
- [recipes.md](recipes.md) — base dictionary and focused recipes
- [settings-groups.md](settings-groups.md) — conceptual groups
- [settings-catalog.md](settings-catalog.md) — key meanings
- [conflicts.md](conflicts.md) — incompatible flags
- [clarifications.md](clarifications.md) — Unconfirmed items
- [troubleshooting.md](troubleshooting.md) — symptom → cause → fix
- [suggestions.md](suggestions.md) — partner defaults worth stating
- [checklist.md](checklist.md) — handoff checklist
- [parity.md](parity.md) — bridged APIs, missing native APIs, port candidates
- [sources.md](sources.md) — pinned commit and files read

## Product limits

Headless Receipts and Headless Credit Cards are separate binaries. This plugin does not export `process` or `headlessUpload`. Say **unsupported**. Do not imitate them with `showCamera`.

`uploadImages` (UI SDK, no camera, files the host already has) is **not** on this plugin. It is a port candidate, not Headless. See [parity.md](parity.md).

Lite / App Clip is **unsupported**. No `VeryfiLensLite` reference.

Remote Models is not the current Android coordinate or the unpacked iOS binary. Per-plugin Remote Models variants are **planned**. Do not add a Remote Models package. Do not set `retrieveCheckTiffIsOn` and promise a TIFF download. Check TIFF is not in the current plugin link.

Any-Documents is an open solution, not a KYC-only or medical-only product. Nutrition facts, US passport, driver license, and prescription labels are shortcut flavors of Any-Documents. This pack does not treat a template name as present in the vendored binary. Contact support. See [templates/any-documents.md](templates/any-documents.md).

Credit card extraction is local only. Card data is never sent to the backend. Use `"mobile"` and `documentTypes: ["credit_card"]`. Android Full (`veryfi-lens-sdk`) does **not** allow `CREDIT_CARD` or `CODE`. Those recipes can fail to open the camera on Android until a plugin flavor exists. iOS model contents were not unpacked (**Unconfirmed**).

Local fraud detection and local field detection are separately paid and gated by the validated account/backend entitlement. A settings key does not unlock either. Field detection also needs a Field Detection or Remote Models binary, which this plugin does not link.

When SDK size matters, Remote Models is the recommended native flavor because heavy resources download after install. This plugin does not expose that flavor yet. Compare the final release app with the Lens dependency and without it. Do not quote the XCFramework or AAR size. [SDK binary sizes](https://docs.veryfi.com/lens/mobile/settings/sdk_binary_sizes/).

## Wire-up

Order the source implements:

1. Subscribe on `new NativeEventEmitter(VeryfiLens.NativeModule)` using `VeryfiLens.Events`. iOS `sendEvent` runs only when `hasListeners` is already true.
2. Build credentials (`url`, `clientId`, `userName`, `apiKey`) and one settings dictionary.
3. `configureWithCredentials`. Present only when the callback argument is `true`.
4. One presentation: `showCamera`, `showGallery`, or `showDocumentBrowser`.

Do not use the README's `new NativeEventEmitter(VeryfiLens)` or `VeryfiLens.getConstants()`. Exact shapes: [implementation.md](implementation.md).

## Do not

- Edit the plugin, the iOS SDK, or the Android SDK from this skill
- Turn on React Native's new architecture (`RCT_NEW_ARCH_ENABLED`, `newArchEnabled`). The pinned README says it is not supported yet
- Trust `lib/typescript/index.d.ts` over `src/index.tsx`
- Call `setInfoView` (stale `.d.ts` only)
- Set `dataExtractionEngine` to `"custom"` (README mentions it; the iOS decoder accepts only `api`, `mobile`, `none`)
- Set `"mobile"` except for `credit_card`, `code`, or `barcode`
- Send credit card data to the backend
- Set `showInfoButton` to embed a React screen. A number or bool becomes an empty `VeryfiInfoView` on iOS; any presence of the key becomes an empty `Fragment` on Android
- Promise Lite, Headless, or current Remote Models
- Present an unverified Any-Documents template as included
- Quote an XCFramework or AAR size as the installed app-size increase
- Leave `dictateIsOn` true
- Leave `backupDocsToGallery` or `backupDocsToiCloud` true unless the host wants those copies
- Leave `ignoreRemoteSettings` false unless the host wants dashboard `lens_settings` to override the recipe
- Leave `moreMenuIsOn` true unless end users should override capture behavior. On Android, stored More-menu values replace host settings on later configures
- Call `stopObserving` while listeners should stay active. If that call reaches the iOS override, `hasListeners` becomes false and iOS drops events
- Pass metadata to `retryPackage` and expect Android to use it. Kotlin is `retryPackage(packageID)` only
- Invent `uploadImages`, `headlessUpload`, or `clearLensStorage` on this plugin

## Output

When generating host code, produce:

1. Install notes actually needed (new architecture off, camera usage string, Maven env vars)
2. Listener registration on `VeryfiLens.NativeModule`, then `configureWithCredentials`
3. One presentation call inside the success callback
4. The recipe dictionary with a one-line comment per non-obvious flag
5. A short conflict note, Android Full limits for credit cards and codes, and any Unconfirmed item the host relies on
