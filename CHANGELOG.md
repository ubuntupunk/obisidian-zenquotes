# Changelog

## [1.0.12] - 2024-12-27
### Summary of Changes:
- **Enhanced Security**: Updated the plugin to eliminate the use of `innerHTML`, replacing it with safer DOM manipulation methods. This change significantly reduces the risk of potential security vulnerabilities.
  
- **Improved Date Handling**: The `On This Day` feature now accurately reflects the current date by using the system's date instead of relying on the API's potentially outdated responses. This ensures users receive relevant and timely information.

- **Attribution Section**: Added a new attribution line to acknowledge the development team, enhancing the transparency and community engagement of the plugin.

- **Styling Updates**: Refined the CSS styles for better compatibility with various themes, ensuring a consistent and visually appealing user experience across different setups.

### Files Included:
- `manifest.json`: Updated to reflect the new version and changes.
- `styles.css`: Contains the latest styling adjustments for improved UI.
- `main.ts`: Core functionality enhancements and security improvements.

## [1.0.7] - 2024-12-20
### Added
- Introduced custom inputs for selecting century and decade in the On This Day feature.
- Implemented filtering logic for fetching quotes based on user-defined century and decade.

### Changed
- Updated the date format in the On This Day feature to a more user-friendly format (e.g., "December 20th").
- Enhanced the attribution text to include historical data alongside quotes and images.

### Removed
- Deprecated the dropdowns for selecting century and decade in favor of custom input fields.

## [1.0.6] - 2024-12-19
### Added
- Initial release of the On This Day feature.
- Fetch historical quotes based on the current date.

### Changed
- Various UI improvements and bug fixes.

## [Unreleased]
### Added
- Implemented toggle for On This Day Quotes.

## [v1.0.6] - 2024-12-19
- Added ZenQuotes API attribution to settings page
- Fixed image fetching and storage functionality
- Improved binary data handling for images
- Added comprehensive error logging
- Enhanced settings display with proper styling

## [v1.0.5] - 2024-12-19
- Initial release with basic quote fetching functionality.
