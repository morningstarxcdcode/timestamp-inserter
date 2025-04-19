import * as vscode from 'vscode';
import { localize } from './localize';

// Import clipboard API
import { env as vscodeEnv, window as vscodeWindow } from 'vscode';

// Import moment for date formatting
import * as moment from 'moment';
import 'moment-timezone';

/**
 * This method is called when your extension is activated.
 * Your extension is activated the very first time the command is executed.
 * @param context - The extension context
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('Timestamp Inserter extension is now active!');

    // Register the command 'extension.insertTimestamp'
    let disposable = vscode.commands.registerCommand('extension.insertTimestamp', async () => {
        // Get the active text editor
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage(localize('noActiveEditor'));
            return;
        }

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
        }

        // Format the timestamp string
        const timestamp = now.format(format);

        // Insert the timestamp at all selections/cursors
        await editor.edit((editBuilder: vscode.TextEditorEdit) => {
            editor.selections.forEach((selection: vscode.Selection) => {
                if (selection.isEmpty) {
                    // Insert at cursor position
                    editBuilder.insert(selection.start, timestamp);
                } else {
                    // Replace selected text
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
            // Show info message that timestamp was inserted
            vscodeWindow.setStatusBarMessage(localize('insertedTimestamp'), 3000);
        }
    });

    context.subscriptions.push(disposable);
}

/**
 * This method is called when your extension is deactivated
 */
export function deactivate() {
    // Clean up resources if needed
}
