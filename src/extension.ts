import * as vscode from 'vscode';
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

        // Show presets + UI picker with dark mode support
        const colorTheme = vscode.window.activeColorTheme.kind;
        const isDarkMode = colorTheme === vscode.ColorThemeKind.Dark || colorTheme === vscode.ColorThemeKind.HighContrast;

        const format = await vscode.window.showQuickPick(PRESET_FORMATS.concat(['Custom...']), {
            placeHolder: localize('selectTimestampFormat'),
            ignoreFocusOut: true
        });

        if (!format) {
            return;
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
            } catch {
                vscodeWindow.showWarningMessage(localize('failedCopy'));
            }
        } else {
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
