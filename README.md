![Veryfi Logo](https://cdn.veryfi.com/logos/veryfi-logo-wide-github.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
# Veryfi Lens
Veryfi Lens is code (a framework) with UI for your mobile app to give it document capture superpowers in minutes.

Let Veryfi handle the complexities of frame processing, asset preprocessing, edge routing, and machine vision challenges in document capture. We have been at this for a long time and understand the intricate nature of mobile capture. That’s why we built Lens. Veryfi Lens is built by developers for developers; making the whole process of integrating Lens into your app fast and easy with as few lines as possible.

Veryfi Lens is a Framework: a self-contained, reusable chunks of code and resources you can import into you app.

Lens is built in native code and optimized for fast performance, clean user experience and low memory usage.

You can read further about Lens in Veryfi's dedicated page: https://www.veryfi.com/lens/

## Table of content
1. [Configuration](#configuration)
2. [iOS Localization](#localization)
3. [Other platforms](#other_platforms)
4. [Get in contact with our team](#contact)

### Configuration <a name="configuration"></a>
- Make sure your SSH key has been granted access to Veryfi's private repository [here](https://hub.veryfi.com/api/settings/keys/#package-managers-container). Also make sure your SSH key has been added to ssh-agent by running this command in the Terminal:
```
# Replace /path/to/private_key with the actual path to your SSH private key
ssh-add -K /path/to/private_key
```
- Go to Lens: Maven (Android) section and generate your access credentials [here](https://hub.veryfi.com/api/settings/keys/#package-managers-container).
- Add your Maven credentials to your system environment. Replace [USERNAME] and [PASSWORD] with the credentials that were set up in the previous step.
```
export MAVEN_VERYFI_USERNAME=[USERNAME]
export MAVEN_VERYFI_PASSWORD=[PASSWORD]
```

- Clone this repository
- Run `yarn add "https://bitbucket.org/veryfi/react-native-veryfi-lens.git#<VERSION>"` to install VeryfiLens.
- Replace credentials in `App.tsx` with yours
```
const veryfiLensCredentials = {
  url: 'yourUrl',
  clientId: 'yourClientId',
  userName: 'yourUsername',
  apiKey: 'yourApiKey',
};
```
- Run `pod repo update` and `pod install` on the iOS folder.
- Start metro running `npx react-native start`.
- Run your desired platform using: `npx react-native run-android` or `npx react-native run-ios`

### iOS Localization (Optional) <a name="localization"></a>
- In order to be able to enable iOS Lens native localization you need to enable a supported language on the project file:
![Step 1](https://raw.githubusercontent.com/veryfi/veryfi-lens-react-native-demo/main/github_assets/localization-step1.png)

- Generate  localization files for the desired language (for example in storyboard):
![Step 2](https://raw.githubusercontent.com/veryfi/veryfi-lens-react-native-demo/main/github_assets/localization-step2.png)

- At the end you should have at least 1 file localized for each language that you want to enable localization, see example:
![Step 3](https://raw.githubusercontent.com/veryfi/veryfi-lens-react-native-demo/main/github_assets/localization-step3.png)

### Other platforms <a name="other_platforms"></a>
We also support the following wrappers for native and hybrid frameworks:
- [Cordova](https://hub.veryfi.com/lens/docs/cordova/)
- [React Native](https://hub.veryfi.com/lens/docs/react-native/)
- [Flutter](https://hub.veryfi.com/lens/docs/flutter/)
- [Xamarin](https://hub.veryfi.com/lens/docs/xamarin/)
- [iOS](https://hub.veryfi.com/lens/docs/ios/)
- [Android](https://hub.veryfi.com/lens/docs/android/)

If you don't have access to our Hub, please contact our sales team, you can find the contact bellow.

### Get in contact with our sales team <a name="contact"></a>
Contact sales@veryfi.com to learn more about Veryfi's awesome products.
