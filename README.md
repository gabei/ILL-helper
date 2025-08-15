# ILL-helper
An extension to assit with extending ILL capabilities. A neatly packaged version of the ILL-extended bot.

# Setup
This extension requires usage of ```imports```. Imports are tricky when developing for extensions. We use rollup to bundle everything into a single distributed content script.

```npm run build``` will bundle the content script and its imports into the ```dist/main.js``` file, which is then injected into the page when ```popup/ui.js``` is run.

Rollup configuration can be found in the root directory at ```rollup.config.js```.

