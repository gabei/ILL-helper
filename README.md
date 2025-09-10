# ILL-helper
An extension to assist with extending ILL capabilities. A neatly packaged version of the ILL-extended bot.

## Setup
This extension requires usage of ```imports```. Imports are tricky when developing for extensions. We use rollup to bundle everything into a single distributed content script.

```npm run build``` will bundle the content script and its imports into the ```dist/main.js``` file, which is then injected into the page when ```popup/ui.js``` is run.

Rollup configuration can be found in the root directory at ```rollup.config.js```.

## Publishing
Web-ext is used on the command line to lint and publish this extension for Firefox. See [Getting Started](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/) for details.

Commanding web-ext to sign the extension will invoke a background firefox debugging process. Depending on your network and security settings, this may be flagged as malicious (work computers beware).

`web-ext sign --channel=listed --amo-metadata=<path to your metadata JSON file> --api-key=$AMO_JWT_ISSUER --api-secret=$AMO_JWT_SECRET`

Obviously these values are not available in this repo. This is here for reference.