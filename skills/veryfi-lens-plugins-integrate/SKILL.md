---
name: veryfi-lens-plugins-integrate
description: >-
  Integrates Veryfi Lens hybrid plugins for Cordova, React Native, Flutter,
  Capacitor, and .NET MAUI/Xamarin. Routes the host, applies Full-SDK settings
  recipes (receipts, long receipts, checks, credit cards, business cards,
  barcodes, OCR strips/caps, W-2, W-9), and documents install, configure,
  events, and callbacks from the pinned plugin sources. Use when adding Veryfi
  Lens to Cordova, React Native, Flutter, Capacitor, MAUI, or Xamarin, or when
  a plugin method, setting, or event is in question.
---

# Veryfi Lens plugins

Integrate a hybrid host against the plugin that is actually linked. Do not invent methods, event names, or settings keys. If a fact is not in the pinned plugin source or the iOS settings baseline, mark it **Unconfirmed** and leave it out of host code.

**Guided** is the recommended path. **Quick** is a first scan when the plugin is already obvious.

Semantic settings come from [../veryfi-lens-ios-integrate/SKILL.md](../veryfi-lens-ios-integrate/SKILL.md). Exact call syntax comes from the plugin guide. These plugins ship the **Full** UI SDK (where a package URL is present it is `veryfi-lens-spm.git`). They do not ship a separate Receipts, Checks, Lite, Headless, or Remote Models package. Product choice is a settings recipe on that Full binary.

## Checklist

```
Plugin route:
- [ ] Infer plugin
- [ ] UI SDK vs Headless (Headless is unavailable)
- [ ] Intake (quick assumptions or guided answers)
- [ ] One recipe on the Full binary
- [ ] Install + credentials + configure
- [ ] Events before or with present, per the guide
- [ ] One presentation call
- [ ] Conflict / unbridged check
```

Open only what this host needs:

- [syntax.md](syntax.md) — install, configure, events, callbacks
- [cordova.md](cordova.md)
- [react-native.md](react-native.md)
- [flutter.md](flutter.md)
- [capacitor.md](capacitor.md)
- [maui.md](maui.md)
- [parity.md](parity.md) — API and settings matrix
- [recipes.md](recipes.md) — Full template and focused recipes
- [unbridged.md](unbridged.md) — native APIs not bridged, `VeryfiInfoView`
- [troubleshooting.md](troubleshooting.md)
- [sources.md](sources.md) — pinned commits

## 1. Infer the plugin

User wording wins. Then:

| Signal | Guide |
|--------|--------|
| `config.xml`, `cordova.plugins.Veryfi`, `@veryfi/cordova-plugin-veryfi-lens` | [cordova.md](cordova.md) |
| `package.json` `@veryfi/react-native-veryfi-lens`, `metro.config.js` | [react-native.md](react-native.md) |
| `pubspec.yaml` name `veryfi`, `package:veryfi/lens.dart` | [flutter.md](flutter.md) |
| `capacitor.config.ts`, `@veryfi/veryfi-lens-capacitor` | [capacitor.md](capacitor.md) |
| `UseMaui`, `VeryfiLens.Maui`, `VeryfiLensBinding` | [maui.md](maui.md) |
| `VeryfiLensiOS` / `VeryfiNetBinding` legacy bindings | [maui.md](maui.md) — legacy section |

A nested `ios/` or `android/` folder belongs to the plugin. Do not switch to the native iOS or Android skill because those folders exist. If two rows match, ask once.

## 2. Product

These plugins wrap the Lens **UI SDK**. Camera (and, on some plugins, gallery or files) is Lens UI.

Headless Receipts and Headless Credit Cards are separate binaries (`VeryfiLensHeadless`). No pinned plugin exports that API. Say **unsupported**. Do not imitate it with `showCamera`.

`UploadImages` exists only on MAUI. That is UI SDK `uploadImages`, not a Headless product. See [unbridged.md](unbridged.md).

Lite / App Clip is not referenced by any pinned plugin. Say **unsupported**.

Remote Models is not a current plugin artifact. Treat it as future/planned. Do not add a Remote Models package or promise check TIFF.

Any-Documents is an open-ended solution, not a KYC- or medical-only product. Nutrition facts, US passport, driver license, and prescription labels are shortcut flavors of Any-Documents. This pack does not emit an `any_document` recipe because the pinned plugin demos do not verify which templates are present in their Full binaries. Contact support to confirm an existing template or arrange support for another document type.

Local fraud detection and local field detection are separately paid, backend-entitlement-gated features. A settings key alone does not enable either feature.

When SDK size matters, Remote Models is the recommended native flavor because heavy resources are retrieved after installation. The current plugins do not expose that flavor; per-plugin Remote Models variants are planned. Never use an XCFramework or AAR file size as the final app impact: compare the final release product with and without the Lens dependency. See [SDK binary sizes](https://docs.veryfi.com/lens/mobile/settings/sdk_binary_sizes/).

## 3. Intake

**Quick.** Do not interview. Write the assumptions in the route card.

| Gap | Assumption |
|-----|------------|
| Product | UI SDK, Full binary the plugin already links |
| Presentation | Camera. Gallery or files only if that guide exports the method |
| Documents | `receipt` |
| Extract | `"api"` |
| Recipe | `receipts` |
| Backups, dictate, more menus | Off, per [recipes.md](recipes.md) base |

**Guided (recommended).** Ask once. Skip rows the project already answers.

| Topic | Options |
|-------|---------|
| Plugin | Cordova, React Native, Flutter, Capacitor, MAUI, legacy .NET binding |
| Documents | receipt, invoice, other, long receipt, check, credit card, business card, barcode, OCR code, W-2, W-9 |
| Extract | `"api"`, `"mobile"` (only `credit_card`, `code`, `barcode`), `"none"` |
| UX | Review then submit, auto-submit, batch until max |
| Sources | Camera; gallery or files only where the guide exports them |
| Files after capture | Keep local package files, or let Lens delete them |

## 4. Recipe

Apply **base**, then **one** id from [recipes.md](recipes.md). The dictionary is the same on every plugin. The guide shows how that dictionary is passed.

Do not install `VeryfiLens-Receipts`, `VeryfiLens-Cheques`, `VeryfiLens-Lite`, `VeryfiLens-OCR`, or a Headless pod into a plugin host. The plugin already links Full.

Public settings stay a dictionary of Lens JSON keys. Do not tell the host to construct `VeryfiLensReceiptsSettings` or any `VeryfiLens*Settings` subclass.

## 5. Wire-up

Follow that plugin's section in [syntax.md](syntax.md), then the guide.

Order that the source actually implements:

1. Credentials and settings
2. Delegate or listeners, **before** present when the guide says events are dropped otherwise
3. Configure
4. One present call after configure succeeds, where the plugin reports success

## 6. Hand off

Stop the router. Generate host code only from the chosen guide plus one recipe.

```
Plugin route:
- Path: quick | guided
- Plugin:
- Product: UI SDK Full
- Presentation:
- Documents:
- Recipe:
- Assumptions:
- Not bridged:
- Next guide:
```

## Do not

- Edit plugin, iOS SDK, or Android SDK source from this skill
- Invent a method a guide marks absent
- Treat MAUI `UploadImages` or any future `uploadImages` bridge as Headless
- Set `dataExtractionEngine` to `"custom"` (plugin READMEs mention it; the iOS decoder accepts only `api`, `mobile`, `none`)
- Set `"mobile"` except for `credit_card`, `code`, or `barcode`
- Send credit card data to the backend
- Set `showInfoButton` to embed a host screen. That value is a native `VeryfiInfoView`, not JSON. See [unbridged.md](unbridged.md)
- Promise Lite, Headless, or Remote Models on these plugins
- Present an unverified Any-Documents template as included in a plugin Full binary
- Quote an XCFramework or AAR size as the installed app-size increase
- Leave `dictateIsOn` true
- Leave `ignoreRemoteSettings` false unless the host wants dashboard `lens_settings` to override the recipe
