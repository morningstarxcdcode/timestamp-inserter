import * as vscode from 'vscode';
<<<<<<< HEAD
import { localize, setLanguage } from './localize';
import { showTimestampPicker } from './uiPicker';
import { logEvent } from './analytics';
import { env as vscodeEnv, window as vscodeWindow, workspace } from 'vscode';
import * as moment from 'moment';
import 'moment-timezone';

const TIMESTAMP_HISTORY_KEY = 'timestampHistory';

const PRESET_FORMATS = [
    'YYYY-MM-DD HH:mm:ss',
    'YYYY-MM-DD',
    'HH:mm:ss',
    'MMMM Do YYYY, h:mm:ss a',
    'ddd, hA',
    'relative'
];
=======
import { localize } from './localize';

// Import clipboard API
import { env as vscodeEnv, window as vscodeWindow } from 'vscode';

// Import moment for date formatting
import * as moment from 'moment';
import 'moment-timezone';
>>>>>>> e8f278053f46b38b1d59a15b7ca49bb4ae9e7480

export function activate(context: vscode.ExtensionContext) {
    console.log('Timestamp Inserter extension is now active!');

    const config = vscode.workspace.getConfiguration('timestampInserter');
    const lang = config.get('language', 'en');
    setLanguage(lang);

    let disposableInsert = vscode.commands.registerCommand('extension.insertTimestamp', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage(localize('noActiveEditor'));
            return;
        }

<<<<<<< HEAD
        // Show presets + UI picker with dark mode support
        const colorTheme = vscode.window.activeColorTheme.kind;
        const isDarkMode = colorTheme === vscode.ColorThemeKind.Dark || colorTheme === vscode.ColorThemeKind.HighContrast;

        const format = await vscode.window.showQuickPick(PRESET_FORMATS.concat(['Custom...']), {
            placeHolder: localize('selectTimestampFormat'),
            ignoreFocusOut: true
        });

        if (!format) {
            return;
=======
    // Define timestamp format presets
    const presets = [
        { label: 'Full DateTime (YYYY-MM-DD HH:mm:ss)', format: 'YYYY-MM-DD HH:mm:ss' },
        { label: 'Date Only (YYYY-MM-DD)', format: 'YYYY-MM-DD' },
        { label: 'Time Only (HH:mm:ss)', format: 'HH:mm:ss' },
        { label: 'ISO 8601', format: moment.ISO_8601 },
        { label: 'Unix Timestamp (seconds)', format: 'X' },
        { label: 'Unix Timestamp (milliseconds)', format: 'x' },
        { label: 'RFC 2822', format: 'ddd, DD MMM YYYY HH:mm:ss ZZ' },
        { label: 'Relative Time (e.g., 5 minutes ago)', format: 'relative' },
        { label: 'Custom (use settings)', format: null }
    ];

        // Show quick pick menu for user to select format preset
        const selected = await vscode.window.showQuickPick(presets.map(p => p.label), {
            placeHolder: localize('selectFormat')
        });

        if (!selected) {
            // User cancelled the quick pick
            return;
        }

        // Get user configuration for timezone and copyToClipboard
        const config = vscode.workspace.getConfiguration('timestampInserter');
        const copyToClipboard: boolean = config.get('copyToClipboard', false);

        // Define timezone options including custom input
        const timezoneOptions = ['local', 'UTC', 'Custom'];

        // Show quick pick for timezone selection
        const selectedTimezone = await vscode.window.showQuickPick(timezoneOptions, {
            placeHolder: localize('selectTimezone')
        });

        if (!selectedTimezone) {
            // User cancelled the quick pick
            return;
        }

        // Determine timezone to use
        let timezone: string;
        if (selectedTimezone === 'Custom') {
            // Ask user to input custom timezone string (e.g., 'America/New_York')
            const inputTimezone = await vscode.window.showInputBox({
                prompt: localize('enterCustomTimezone'),
                placeHolder: 'America/New_York'
            });
            if (!inputTimezone) {
                // User cancelled input
                return;
            }
            timezone = inputTimezone;
        } else {
            timezone = selectedTimezone;
        }

        // Determine format based on selection
        let format: string;
        if (selected === 'Custom (use settings)') {
            format = config.get('format', 'YYYY-MM-DD HH:mm:ss');
        } else {
            const preset = presets.find(p => p.label === selected);
            format = preset?.format || 'YYYY-MM-DD HH:mm:ss';
        }

        // Handle relative time format
        if (format === 'relative') {
            // Ask user for relative time input (e.g., "5 minutes ago", "in 2 hours")
            const relativeInput = await vscode.window.showInputBox({
                prompt: localize('enterRelativeTime'),
                placeHolder: 'e.g., 5 minutes ago, in 2 hours'
            });
            if (!relativeInput) {
                return;
            }
            // Parse relative time using moment
            const now = moment();
            const relativeTime = moment(now).add(moment.duration(relativeInput));
            if (!relativeTime.isValid()) {
                vscode.window.showErrorMessage(localize('invalidRelativeTime'));
                return;
            }
            // Format relative time as ISO string for insertion
            const timestamp = relativeTime.format(config.get('format', 'YYYY-MM-DD HH:mm:ss'));
            // Insert timestamp at cursor(s)
            await editor.edit((editBuilder: vscode.TextEditorEdit) => {
                editor.selections.forEach((selection: vscode.Selection) => {
                    if (selection.isEmpty) {
                        editBuilder.insert(selection.start, timestamp);
                    } else {
                        editBuilder.replace(selection, timestamp);
                    }
                });
            });
            // Optionally copy to clipboard
            if (copyToClipboard) {
                try {
                    await vscodeEnv.clipboard.writeText(timestamp);
                    vscodeWindow.setStatusBarMessage(localize('copiedClipboard'), 3000);
                } catch (err) {
                    vscodeWindow.showWarningMessage(localize('failedCopy'));
                }
            } else {
                vscodeWindow.setStatusBarMessage(localize('insertedTimestamp'), 3000);
            }
            return;
        }

        // Get current date/time based on timezone setting
        let now = moment();
        if (timezone === 'UTC') {
            now = moment.utc();
        } else if (timezone !== 'local') {
            // Use moment-timezone to handle custom timezone
            now = moment.tz(timezone);
>>>>>>> e8f278053f46b38b1d59a15b7ca49bb4ae9e7480
        }

        let chosenFormat = format;
        if (format === 'Custom...') {
            const customFormat = await vscode.window.showInputBox({
                prompt: localize('enterCustomFormat'),
                placeHolder: 'e.g., YYYY/MM/DD HH:mm',
                ignoreFocusOut: true
            });
            if (!customFormat) {
                return;
            }
            chosenFormat = customFormat;
        }

        const copyToClipboard: boolean = config.get('copyToClipboard', false);

        const timezoneOptions = ['local', 'UTC', 'Custom'];
        const selectedTimezone = await vscode.window.showQuickPick(timezoneOptions, {
            placeHolder: localize('selectTimezone'),
            ignoreFocusOut: true
        });
        if (!selectedTimezone) {
            return;
        }

        let timezone: string;
        if (selectedTimezone === 'Custom') {
            const inputTimezone = await vscode.window.showInputBox({
                prompt: localize('enterCustomTimezone'),
                placeHolder: 'America/New_York',
                ignoreFocusOut: true
            });
            if (!inputTimezone) {
                return;
            }
            timezone = inputTimezone;
        } else {
            timezone = selectedTimezone;
        }

        let timestamp: string;
        if (chosenFormat === 'relative') {
            const relativeInput = await vscode.window.showInputBox({
                prompt: localize('enterRelativeTime'),
                placeHolder: 'e.g., 5 minutes ago, in 2 hours',
                ignoreFocusOut: true
            });
            if (!relativeInput) {
                return;
            }
            const now = moment();
            const relativeTime = moment(now).add(moment.duration(relativeInput));
            if (!relativeTime.isValid()) {
                vscode.window.showErrorMessage(localize('invalidRelativeTime'));
                return;
            }
            timestamp = relativeTime.format(config.get('format', 'YYYY-MM-DD HH:mm:ss'));
        } else {
            let now = moment();
            if (timezone === 'UTC') {
                now = moment.utc();
            } else if (timezone !== 'local') {
                now = moment.tz(timezone);
            }
            timestamp = now.format(chosenFormat);
        }

        await editor.edit((editBuilder: vscode.TextEditorEdit) => {
            editor.selections.forEach((selection: vscode.Selection) => {
                if (selection.isEmpty) {
                    editBuilder.insert(selection.start, timestamp);
                } else {
                    editBuilder.replace(selection, timestamp);
                }
            });
        });

        if (copyToClipboard) {
            try {
                await vscodeEnv.clipboard.writeText(timestamp);
                vscodeWindow.setStatusBarMessage(localize('copiedClipboard'), 3000);
<<<<<<< HEAD
            } catch {
                vscodeWindow.showWarningMessage(localize('failedCopy'));
            }
        } else {
=======
            } catch (err) {
                vscodeWindow.showWarningMessage(localize('failedCopy'));
            }
        } else {
            // Show info message that timestamp was inserted
>>>>>>> e8f278053f46b38b1d59a15b7ca49bb4ae9e7480
            vscodeWindow.setStatusBarMessage(localize('insertedTimestamp'), 3000);
        }

        saveTimestampToHistory(context, timestamp);
        logEvent('insertTimestamp', { format: chosenFormat, timezone });
    });

    let disposableHistory = vscode.commands.registerCommand('extension.insertTimestampFromHistory', async () => {
        const history = context.globalState.get<string[]>(TIMESTAMP_HISTORY_KEY, []);
        if (history.length === 0) {
            vscode.window.showInformationMessage(localize('noHistory'));
            return;
        }
        const selected = await vscode.window.showQuickPick(history, {
            placeHolder: localize('selectTimestampFromHistory'),
            ignoreFocusOut: true
        });
        if (!selected) {
            return;
        }
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage(localize('noActiveEditor'));
            return;
        }
        await editor.edit(editBuilder => {
            editor.selections.forEach(selection => {
                if (selection.isEmpty) {
                    editBuilder.insert(selection.start, selected);
                } else {
                    editBuilder.replace(selection, selected);
                }
            });
        });
        vscodeWindow.setStatusBarMessage(localize('insertedTimestampFromHistory'), 3000);
        logEvent('insertTimestampFromHistory');
    });

    let disposableExportSettings = vscode.commands.registerCommand('extension.exportSettings', async () => {
        const config = workspace.getConfiguration('timestampInserter');
        const settings = {
            format: config.get('format'),
            timezone: config.get('timezone'),
            copyToClipboard: config.get('copyToClipboard'),
            language: config.get('language')
        };
        const json = JSON.stringify(settings, null, 2);
        const uri = await vscodeWindow.showSaveDialog({
            filters: { 'JSON': ['json'] },
            saveLabel: localize('saveSettings')
        });
        if (!uri) {
            return;
        }
        await vscode.workspace.fs.writeFile(uri, Buffer.from(json, 'utf8'));
        vscodeWindow.showInformationMessage(localize('settingsExported'));
        logEvent('exportSettings');
    });

    let disposableImportSettings = vscode.commands.registerCommand('extension.importSettings', async () => {
        const uris = await vscodeWindow.showOpenDialog({
            canSelectMany: false,
            filters: { 'JSON': ['json'] },
            openLabel: localize('importSettings')
        });
        if (!uris || uris.length === 0) {
            return;
        }
        const data = await vscode.workspace.fs.readFile(uris[0]);
        const json = JSON.parse(data.toString());
        const config = workspace.getConfiguration('timestampInserter');
        for (const key in json) {
            if (json.hasOwnProperty(key)) {
                await config.update(key, json[key], vscode.ConfigurationTarget.Global);
            }
        }
        vscodeWindow.showInformationMessage(localize('settingsImported'));
        logEvent('importSettings');
    });

    context.subscriptions.push(disposableInsert);
    context.subscriptions.push(disposableHistory);
    context.subscriptions.push(disposableExportSettings);
    context.subscriptions.push(disposableImportSettings);
}

function saveTimestampToHistory(context: vscode.ExtensionContext, timestamp: string) {
    const history = context.globalState.get<string[]>(TIMESTAMP_HISTORY_KEY, []);
    if (!history.includes(timestamp)) {
        history.unshift(timestamp);
        if (history.length > 20) {
            history.pop();
        }
        context.globalState.update(TIMESTAMP_HISTORY_KEY, history);
    }
}

export function deactivate() {
    // Clean up resources if needed
}
