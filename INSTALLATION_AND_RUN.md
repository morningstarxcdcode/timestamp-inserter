# Installation and Running Guide for Timestamp Inserter Extension

This guide will help you set up, build, test, and run the Timestamp Inserter VS Code extension on your MacBook terminal.

---

## Prerequisites

- Node.js and npm installed. You can download from https://nodejs.org/
- VS Code installed.

---

## Step 1: Clone or Download the Project

If you have the project folder on your Desktop, navigate to it:

```bash
cd ~/Desktop/timestamp-inserter
```

If you need to clone from GitHub (replace with your repo URL):

```bash
git clone https://github.com/morningstarxcdcode/timestamp-inserter.git
cd timestamp-inserter
```

---

## Step 2: Install Dependencies

Run the following commands to install all required packages and type declarations:

```bash
npm install vscode moment
npm install --save-dev @types/vscode @types/moment @types/node @types/mocha @types/assert typescript
```

---

## Step 3: Compile the Extension

Compile the TypeScript code to JavaScript:

```bash
npm run compile
```

---

## Step 4: Run Automated Tests (Optional but Recommended)

Run the test suite to verify everything is working:

```bash
npm test
```

---

## Step 5: Open in VS Code and Run Extension

1. Open the project folder in VS Code:

```bash
code .
```

2. Press `F5` to launch a new Extension Development Host window.

3. In the new window, open any text file, place the cursor, and run the command:

- Press `Ctrl+Alt+T` (Windows/Linux) or `Cmd+Alt+T` (macOS), or
- Open the Command Palette (`Cmd+Shift+P` or `Ctrl+Shift+P`) and type `Insert Current Timestamp`.

---

## Step 6: Packaging and Publishing (Optional)

To package the extension for publishing:

```bash
npm install -g vsce
vsce package
```

This creates a `.vsix` file you can share or publish.

For publishing to the VS Code Marketplace, follow the instructions in the `PUBLISHING_GUIDE.md` file.

---

If you encounter any issues or need further assistance, feel free to ask!

Happy coding! 🚀
