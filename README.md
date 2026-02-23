# taiga-link-helper

A browser extension to streamline opening pull requests related to Taiga tasks.

## Features

- Detects Github PRs and issues links in Taiga tasks.
- Provides quick access to open related pull requests.

## Installation

1. Clone this repository:
   ```sh
   git clone https://github.com/6c6a64/taiga-link-helper.git
   ```
2. Edit `manifest.json` to specify your Taiga URL.
3. Open your browser's extensions page:
   - For Chrome: `chrome://extensions/`
   - For Firefox: `about:addons`
4. Enable "Developer mode" or "Load Temporary Add-on".
5. Click "Load unpacked" and select the `taiga-link-helper` directory.

## Usage

- Once installed, the extension will automatically detect Github PRs and issues on Taiga pages, and a popup will appear in the top right corner.
- Use the popup to open the links in another tab.

## License

MIT License
