# .NET MAUI and legacy Xamarin

Current API: `VeryfiLens.VeryfiLensBinding` in `VeryfiLens.Maui/src/VeryfiLens.Sdk/VeryfiLensMaui.cs`. NuGet `PackageId` `VeryfiLens.Maui`, version `2.0.60`. Target frameworks `net10.0-android` and `net10.0-ios27.0`. Commit in [sources.md](sources.md).

The sample (`VeryfiLens.Maui.Sample/MainPage.xaml.cs`) calls `VeryfiLensBinding` directly. The repo README's `VeryfiLens.Sdk.VeryfiLens` type was not in this tree. A class comment says `using VeryfiLens = VeryfiLens.VeryfiLensBinding`. That alias was not found in the packaged props files that were read (`VeryfiLens.Sdk.props` only imports Android native references).

Android AAR coordinate in `VeryfiLens.Android.Binding.csproj`: `com.veryfi.lens:veryfi-lens-sdk:2.7.0.3`. iOS: README and `MAUI_PLAN.md` name SPM `https://repo.veryfi.com/shared/lens/veryfi-lens-spm.git`. No other flavor repo is named. Recipes: [recipes.md](recipes.md).

## Install

Repo README steps: open `VeryfiLens.Maui/VeryfiLens.Maui.sln`, set Maven credentials (`MAVEN_VERYFI_USERNAME`, `MAVEN_VERYFI_PASSWORD`), iOS git credentials for `veryfi-lens-spm.git`, and app credentials (`VERYFI_CLIENT_ID`, `VERYFI_USERNAME`, `VERYFI_API_KEY`, `VERYFI_URL` or `Resources/Raw/appsettings.json`). Reference `VeryfiLens.Sdk.csproj`.

Build requirements in that README: .NET 10 SDK + MAUI workload, JDK 17, Android SDK API 36, Xcode 16.4+.

This pack did not find `VeryfiLens.Maui/DISTRIBUTION.md`, which the README links. Packaging steps beyond the README and the csproj are **Unconfirmed**.

## Configure and present

```csharp
using VeryfiLens;

VeryfiLensBinding.SetDelegate(new HostDelegate());
VeryfiLensBinding.SetAnalyticsDelegate(new HostAnalytics());

var credentials = new VeryfiLensCredentials
{
    ClientId = clientId,
    Username = username,
    ApiKey = apiKey,
    Url = "https://api.veryfi.com/"
};

var settings = new Dictionary<string, object>
{
    ["dataExtractionEngine"] = "api",
    ["documentTypes"] = new[] { "receipt" },
    // remaining keys from the chosen recipe
};

VeryfiLensBinding.Configure(credentials, settings, success =>
{
    if (!success) return;
    VeryfiLensBinding.ObserveAnalyticsEvents();
    VeryfiLensBinding.ShowCamera(this);
});
```

`SetDelegate` before `Configure`. The bridge installs its listener during configure and forwards into the delegate that was stored.

`IVeryfiLensDelegate`: `OnClose`, `OnError`, `OnSuccess`, `OnUpdate`. Payload is `Dictionary<string, object>` unwrapped from native JSON. No `event` field is added. `IVeryfiLensAnalyticsDelegate.OnAnalyticsEvent(string eventName, string paramsJson, string value)`.

Android `Configure` calls `completion(true)` itself. That `true` does not come from the native SDK. iOS passes the native completion bool through.

## Other calls

```csharp
VeryfiLensBinding.ShowGallery(this);
VeryfiLensBinding.ShowDocumentBrowser(this);
VeryfiLensBinding.CloseCamera(this);
VeryfiLensBinding.Retry(packageId, metadataJson, imageSourceTag);
VeryfiLensBinding.RetryAll();
VeryfiLensBinding.UploadImages(paths, isSameTransaction: false);
VeryfiLensBinding.StopObservingAnalyticsEvents();
```

One presentation. `ShowGallery` and `ShowDocumentBrowser` are host calls. `galleryIsOn` only affects the camera UI.

`Retry`: iOS parses `metadataJson` and passes `imageSourceTag`. Android `VeryfiLensBridge.retry` takes the package id only.

`UploadImages`: UI SDK path upload, not Headless. Android passes `isSameTransaction`. iOS `uploadImages(paths:)` does not take that flag, and `VeryfiLens.ios.cs` does not pass it.

## Not on VeryfiLensBinding

`DiscardPackage`, `ShareOCRFeedback`, `GetFileBase64`, `headlessUpload`, Headless `process`, Lite, help-button events, `VeryfiInfoView`.

`showInfoButton` in the dictionary is not a .NET view. See [unbridged.md](unbridged.md).

## Legacy bindings

`VeryfiNetBinding/` is the older .NET for iOS / Android binding the repo README still lists. iOS API definition namespace is `VeryfiLensiOS`, type `VeryfiLens`, with `ConfigureWith`, `ShowCameraIn`, and `UploadImagesWithPaths` among its exports (`iOSVeryfiBinding/ApiDefinition.cs`). That is a generated binding over the native SDK, not `VeryfiLensBinding`.

New MAUI hosts should use `VeryfiLensBinding`. Do not mix the two in one walkthrough. This pack did not re-verify every legacy property against the current native SDK. If the host is already on `VeryfiLensiOS`, stay on that binding and do not rename calls to the MAUI API without a port.
