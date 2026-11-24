# Capacitor

Public surface: `VeryfiLensCapacitor` from `src/index.ts`, typed by `src/definitions.ts`. Package `@veryfi/veryfi-lens-capacitor` `2.0.61`. Plugin registration name `VeryfiLensCapacitor`. Commit in [sources.md](sources.md).

README install line `npm install veryfi-lens-capacitor` does not match `package.json` `name`. Use `@veryfi/veryfi-lens-capacitor`. README docgen omits methods that `definitions.ts` declares; follow `definitions.ts`.

iOS SPM `https://repo.veryfi.com/shared/lens/veryfi-lens-spm.git` from `3.0.16`, pod dependency `VeryfiLens` (Full pod name). Android `com.veryfi.lens:veryfi-lens-sdk:2.6.0.18`, min SDK 23. Recipes: [recipes.md](recipes.md).

`src/web.ts` implements every method as an empty async function. Do not expect Lens in a browser.

## Install

```sh
npm install @veryfi/veryfi-lens-capacitor
npx cap sync
```

The README's `npx cap sync` step is the one in source after its install line. Point the dependency at the `package.json` name above.

## Configure, delegate, listen, present

Native `veryfiInitLens` does not assign the Lens delegate. `setLensEventDelegate` does. `addListener` subscribes to Capacitor events the delegate then `notifyListeners`s.

```typescript
import { VeryfiLensCapacitor } from '@veryfi/veryfi-lens-capacitor';

const credentials = {
  url: 'https://api.veryfi.com/',
  clientId,
  userName: username,
  apiKey,
};

await VeryfiLensCapacitor.veryfiInitLens({ credentials, settings });
await VeryfiLensCapacitor.setLensEventDelegate();
await VeryfiLensCapacitor.addListener('veryfiLensUpdate', (data) => {});
await VeryfiLensCapacitor.addListener('veryfiLensSuccess', (data) => {});
await VeryfiLensCapacitor.addListener('veryfiLensError', (data) => {});
await VeryfiLensCapacitor.addListener('veryfiLensClose', (data) => {});
await VeryfiLensCapacitor.showCamera();
```

Listener names: `veryfiLensClose`, `veryfiLensError`, `veryfiLensSuccess`, `veryfiLensUpdate`, `veryfiLensAnalytics`.

Neither `VeryfiLensCapacitorPlugin.swift` nor `VeryfiLensCapacitorPlugin.java` calls `call.resolve`. iOS calls `call.reject` only when init is missing credentials or settings, or when retry/discard is missing `packageID` (and, on iOS retry, metadata and `imageSourceTag`). Whether the JavaScript promise still settles is **Unconfirmed** (the Capacitor runtime was not executed). Do not add a fictional status return. If `await veryfiInitLens` never finishes, treat it as that source gap.

## Other calls

```typescript
await VeryfiLensCapacitor.retryPackage({
  packageID,
  metadata,
  imageSourceTag,
});
await VeryfiLensCapacitor.retryAllPackages();
await VeryfiLensCapacitor.discardPackage({ packageID });
await VeryfiLensCapacitor.discardAllPackages();
await VeryfiLensCapacitor.shareOCRFeedback();
await VeryfiLensCapacitor.observeAnalyticsEvents();
await VeryfiLensCapacitor.addListener('veryfiLensAnalytics', (data) => {});
```

iOS retry rejects unless `packageID`, `metadata`, and `imageSourceTag` are all present. Android reads `packageID` only.

## Not on this plugin

`showGallery`, `showDocumentBrowser`, `closeCamera`, `getFileBase64`, `uploadImages`, Headless, Lite, help events, `VeryfiInfoView`. Gallery inside the camera is the `galleryIsOn` setting, not a host method.

No base64 helper. Update payloads still carry path strings in `data` when the native SDK sends them.
