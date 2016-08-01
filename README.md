# SCMDManager
### Cross-platform SteamCMD Server Manager

[![CircleCI](https://circleci.com/gh/zackdevine/scmdmanager.svg?style=svg)](https://circleci.com/gh/zackdevine/scmdmanager)

----

#### About
SCMDManager is a cross-platform SteamCMD server manager application. You can use it to install, update, and start/stop SteamCMD servers.

It was created out of the need of a nice-looking server manager for both GNU/Linux and Windows.

----

#### Features
- Fully cross-platform between Windows, GNU/Linux, and OS X
- Automaticaly downloads SteamCMD for the platform you're running the application on
  - If you run this on GNU/Linux, the downloader will also automatically install necessary dependencies for SteamCMD as-needed
- Install SteamCMD servers to different directories
- Bulk-update all SteamCMD servers (or individually)
- Nice looking UI (Bootstrap, Font Awesome)
- User-friendly and easy to use!

----

#### How-to (app binary)
Visit the [releases](https://github.com/zackdevine/scmdmanager/releases) tab to download the latest build!

If there is an outdated build (comapred to the latest commit in the master branch), please let me know!

----

#### How-to (source code)
Please note: You need to have [NodeJS](https://nodejs.org) and npm (comes with the NodeJS installer) installed in order to build from source!

```bash
# Clone the repository
git clone https://github.com/zackdevine/scmdmanager.git

# Enter the repository
cd scmdmanager

# Build the app and start it
npm install
npm start
```

----

#### Credits
- [Electron](http://electron.atom.io)
- [Bootstrap](https://getbootstrap.com) framework (UI)
- [Font Awesome](https://fontawesome.io) UI icons
- [Bootswatch](https://bootswatch.com) [Yeti](https://bootswatch.com/yeti) theme
- [electron-json-config](https://github.com/de-luca/electron-json-config) - Module to store config settings in JSON for Electron apps
- [decompress](https://github.com/kevva/decompress) and [decompress-targz](https://github.com/kevva/decompress-targz) - Modules to extract archives

----

#### License [MIT License](LICENSE.md)
