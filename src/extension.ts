// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';

// Import clipboard API
import { env as vscodeEnv, window as vscodeWindow } from 'vscode';

// Import moment for date formatting
import * as moment from 'moment';

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
            vscode.window.showErrorMessage('No active editor found. Please open a file to insert a timestamp.');
            return;
        }

        // Get user configuration for timestamp format and timezone
        const config = vscode.workspace.getConfiguration('timestampInserter');
        const format: string = config.get('format', 'YYYY-MM-DD HH:mm:ss');
        const timezone: string = config.get('timezone', 'local');
        const copyToClipboard: boolean = config.get('copyToClipboard', false);

        // Get current date/time based on timezone setting
        let now = moment();
        if (timezone === 'UTC') {
            now = moment.utc();
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
                vscodeWindow.setStatusBarMessage('Timestamp copied to clipboard!', 3000);
            } catch (err) {
                vscodeWindow.showWarningMessage('Failed to copy timestamp to clipboard.');
            }
        } else {
            // Show info message that timestamp was inserted
            vscodeWindow.setStatusBarMessage('Timestamp inserted!', 3000);
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
