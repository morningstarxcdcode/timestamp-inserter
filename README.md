# 📅 Timestamp Inserter

A powerful and beginner-friendly VS Code extension to quickly insert formatted timestamps or dates into your active editor! ⏰✨

---

## Features

- Insert current timestamp or date at the cursor or replace selection.
- Supports multiple timestamp formats: full datetime, date only, time only, ISO.
- Configure your preferred timestamp format and timezone in settings.
- Supports multiple cursors and selections.
- Optionally copy the inserted timestamp to clipboard.
- Access via command palette, context menu, or keybinding (`Ctrl+Alt+T` / `Cmd+Alt+T`).
- Provides user feedback with info messages or status bar notifications.
- Robust error handling for smooth experience.

---

## How to Use

1. Open any text file in VS Code.
2. Place your cursor where you want to insert the timestamp.
3. Press `Ctrl+Alt+T` (Windows/Linux) or `Cmd+Alt+T` (macOS), or run the command **Insert Current Timestamp** from the command palette.
4. The formatted timestamp will be inserted at the cursor position(s).

---

## Configuration

You can customize the extension behavior in your VS Code settings (`settings.json`):

```json
{
  "timestampInserter.format": "YYYY-MM-DD HH:mm:ss",
  "timestampInserter.timezone": "local",
  "timestampInserter.copyToClipboard": false
}
```

- `timestampInserter.format`: Use [moment.js format tokens](https://momentjs.com/docs/#/displaying/format/) to define your timestamp format.
- `timestampInserter.timezone`: Choose `"local"` or `"UTC"` for the timestamp timezone.
- `timestampInserter.copyToClipboard`: Set to `true` to copy the inserted timestamp to your clipboard automatically.

---

## How It Works

This extension uses the VS Code API to:

- Detect the active text editor and cursor position(s).
- Generate the current timestamp formatted per your settings.
- Insert the timestamp text at the cursor(s).
- Optionally copy the timestamp to clipboard.
- Show feedback messages to enhance user experience.

---

## Development & Contribution

Want to contribute? Great! Here's how:

1. Fork the repository.
2. Clone your fork locally.
3. Run `npm install` to install dependencies.
4. Run `npm run compile` to build the extension.
5. Open the project in VS Code and press `F5` to launch a new Extension Development Host.
6. Make your changes and test thoroughly.
7. Commit your changes and push to your fork.
8. Open a pull request here.

---

## Future Plans

- Add more timestamp formats and presets.
- Support for custom timezones.
- Localization support.
- Unit and integration tests.
- CI/CD pipeline for automated testing and publishing.

---

## License

MIT License © 2024

---

Made with ❤️ by morningstarxcdcode 🚀
