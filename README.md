# Obsidian XenQuotes Plugin

## Project Overview
This project is based on the Obsidian sample plugin for Obsidian. It has evolved into a simple plugin that provides users with a random quote of the day, inspirational images, and an "On This Day" feature to pull historical quotes based on the current date.

## Features
- Fetch random quotes
- Fetch quotes of the day
- Fetch and save random images alongside quotes
- **On This Day**: Fetch historical quotes based on the current date.

## On This Day Feature
The On This Day feature allows users to retrieve notable events, births, and deaths that occurred on the current date. The data is fetched from the ZenQuotes API and displayed in a structured format.

### Usage
To use the On This Day feature, simply enable it in the plugin settings and trigger the fetch action. The historical data will be inserted into your current note.

## Attribution
Inspirational quotes and images provided by [ZenQuotes API](https://zenquotes.io/)

## Community Support
To help make the author-specific quotes feature available to everyone, please consider supporting the project by:
1. ⭐ Starring our repository on [GitHub](https://github.com/ubuntpunk/obsidian-xenquotes)
2. 💝 Fund development and unlocking new features via [buymeacoffee](https://buymeacoffee.com/ubuntupunk)
3. 🤝 Joining our community discussions on GitHub.

## Installation Instructions

1. Download the latest release from the [Releases](https://github.com/ubuntupunk/obsidian-xenquotes/releases) page.
2. Place the plugin folder in your Obsidian plugins directory: `YOUR_OBSIDIAN_VAULT/.obsidian/plugins/`.
3. Open Obsidian and enable the plugin from the settings.

## Usage Instructions

- To fetch a random quote, use the command palette or the ribbon icon.
- You can customize settings by navigating to the plugin settings in Obsidian.
- The plugin will automatically fetch and display a random quote along with an inspirational image.

### Known Issues
- Ensure that an active Markdown note is open when using the ribbon icon to avoid errors.


## Acknowledgments
This plugin is built upon the foundational work of the Obsidian sample plugin, which provided the initial structure and guidance for developing plugins within the Obsidian ecosystem.
