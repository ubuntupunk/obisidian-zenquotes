# Obsidian XenQuotes Plugin

## Project Overview
This project is based on the Obsidian sample plugin for Obsidian. It has evolved into a simple plugin that provides users with a random quote of the day and inspirational images.

## Features
- Fetch random quotes
- Fetch quotes of the day
- Fetch and save random images alongside quotes
- **Coming Soon**: Author-specific quotes! This feature allows users to fetch quotes from specific authors. Since it is dependent upon the ZenQuotes.io API which requires premium API access, we discuss ways to support and unlock this feature in the [Discussions](https://github.com/ubuntpunk/obsidian-xenquotes/discussions) section of the GitHub repo.

## Attribution
Inspirational quotes and images provided by [ZenQuotes API](https://zenquotes.io/)

## Community Support
To help make the author-specific quotes feature available to everyone, please consider supporting the project by:
1. ⭐ Starring our repository on [GitHub](https://github.com/ubuntpunk/obsidian-xenquotes)
2. 💝 Fund development and unlocking new features via [buymeacoffee](https://buymeacoffee.com/ubuntupunk)
3. 🤝 Joining our community discussions on GitHub.

## First time developing plugins?

Quick starting guide for new plugin devs:

- Check if [someone already developed a plugin for what you want](https://obsidian.md/plugins)! There might be an existing plugin similar enough that you can partner up with.
- Make a copy of this repo as a template with the "Use this template" button (login to GitHub if you don't see it).
- Clone your repo to a local development folder. For convenience, you can place this folder in your `.obsidian/plugins/your-plugin-name` folder.
- Install NodeJS, then run `npm i` in the command line under your repo folder.
- Run `npm run dev` to compile your plugin from `main.ts` to `main.js`.
- Make changes to `main.ts` (or create new `.ts` files). Those changes should be automatically compiled into `main.js`.
- Reload Obsidian to load the new version of your plugin.
- Enable plugin in settings window.
- For updates to the Obsidian API run `npm update` in the command line under your repo folder.

## Releasing new releases

- Update your `manifest.json` with your new version number, such as `1.0.1`, and the minimum Obsidian version required for your latest release.
- Update your `versions.json` file with `"new-plugin-version": "minimum-obsidian-version"` so older versions of Obsidian can download an older version of your plugin that's compatible.
- Create new GitHub release using your new version number as the "Tag version". Use the exact version number, don't include a prefix `v`. See here for an example: https://github.com/obsidianmd/obsidian-sample-plugin/releases
- Upload the files `manifest.json`, `main.js`, `styles.css` as binary attachments. Note: The manifest.json file must be in two places, first the root path of your repository and also in the release.
- Publish the release.

> You can simplify the version bump process by running `npm version patch`, `npm version minor` or `npm version major` after updating `minAppVersion` manually in `manifest.json`.
> The command will bump version in `manifest.json` and `package.json`, and add the entry for the new version to `versions.json`

## Adding your plugin to the community plugin list

- Check the [plugin guidelines](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines).
- Publish an initial version.
- Make sure you have a `README.md` file in the root of your repo.
- Make a pull request at https://github.com/obsidianmd/obsidian-releases to add your plugin.

## Installation Instructions

1. Download the latest release from the [Releases](https://github.com/ubuntupunk/obsidian-xenquotes/releases) page.
2. Place the plugin folder in your Obsidian plugins directory: `YOUR_OBSIDIAN_VAULT/.obsidian/plugins/`.
3. Open Obsidian and enable the plugin from the settings.

## Usage Instructions

- To fetch a random quote, use the command palette or the ribbon icon.
- You can customize settings by navigating to the plugin settings in Obsidian.
- The plugin will automatically fetch and display a random quote along with an inspirational image.

## Recent Updates

### Version 1.0.0

- **Ribbon Icon Functionality:** 
  - The ribbon icon now correctly fetches and inserts quotes into the active note when clicked.
  - Improved error handling and logging for better debugging.

- **Command Execution:** 
  - The command to fetch the quote of the day can be executed via the command palette (Ctrl + Shift + P) and is also triggered by the ribbon icon.

- **Settings Improvements:** 
  - Added a dropdown for selecting the quote mode (Random, Today, Author).
  - Enhanced user interface elements for better usability.

### Version 1.0.1

- **New Feature:** 
  - Added support for author-specific quotes.
  - Improved performance and reduced latency.

- **Bug Fixes:** 
  - Fixed an issue where the ribbon icon would not work correctly in certain situations.
  - Improved error handling and logging for better debugging.

### Known Issues
- Ensure that an active Markdown note is open when using the ribbon icon to avoid errors.

## API Documentation

See https://github.com/obsidianmd/obsidian-api

## Acknowledgments
This plugin is built upon the foundational work of the Obsidian sample plugin, which provided the initial structure and guidance for developing plugins within the Obsidian ecosystem.
