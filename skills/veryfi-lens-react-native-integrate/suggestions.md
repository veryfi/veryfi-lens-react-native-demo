# Suggestions

Say these when they match the host. They are defaults, not extra features to turn on.

## Install and size

Keep the new architecture off. Pin the git tag the host actually ships (`2.0.62` is the tree this skill describes).

If the app binary is too large, say Remote Models is the native flavor that downloads heavy resources after install, and that a React Native Remote Models variant is planned. Do not swap the Gradle coordinate. Ask them to compare a release build with this dependency and without it, not the XCFramework or AAR file size. [SDK binary sizes](https://docs.veryfi.com/lens/mobile/settings/sdk_binary_sizes/).

## Privacy

Leave gallery and iCloud backups off unless the product wants every scan copied into the user's Photos or iCloud. Leave location off unless vendor detection needs it. Leave dictate off.

Hide the More menu so users cannot turn backups, auto capture, or Superman mode back on. On Android that also stops stored preferences from overwriting the recipe.

## Extraction

Cloud (`"api"`) for receipts, long receipts, checks, business cards, W-2, and W-9. On-device (`"mobile"`) for barcodes, and for credit cards and OCR codes where the binary allows them. `"none"` when the customer calls Process a Document themselves. Tell them which package path they must keep.

Do not send credit card images or card data to the backend.

## Paid features

Fraud detection and field detection are paid and backend-gated. Offer to ask the account owner to enable them. Do not set the flags as if that were sufficient. Field detection is also the wrong binary for this plugin.

## Documents this binary may not scan

Credit cards and OCR codes on Android: explain the Full artifact limit before writing a screen that calls `showCamera`. W-2, W-9, checks, and long receipts on iOS: the vendored framework was not unpacked, so if detection fails, that is a support question about models, not a second import.

Any-Documents: ask support which `anyDocumentTemplate` the account has, including a template that does not exist yet. Nutrition facts, US passport, driver license, and prescription labels are shortcuts of that solution, not separate plugins.

## Help and files

If they need a custom explanation screen, use the Help event and `showHelpScreen`, not `showInfoButton`.

If they display images after the callback, set `autoDeleteLocalResourcesAfterProcessing` false and use `getFileBase64` on `event.data` while the file exists. Tell them cleanup is their responsibility.

## Retry

On iOS, pass package id, metadata, and image source tag. On Android, only the package id is sent. Do not write Android-only metadata and expect a richer retry.

## What not to suggest

- Headless, Lite, or a Remote Models package today
- `uploadImages` until the plugin exports it
- `setInfoView`
- `"custom"` extraction
- Enabling screenshots blocking and imported-screenshot rejection as one flag
- Editing the plugin repository from the host task
