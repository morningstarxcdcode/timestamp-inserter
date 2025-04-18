// Import the necessary modules for testing
import * as assert from 'assert';
import * as vscode from 'vscode';
import * as myExtension from '../extension';

suite('Timestamp Inserter Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Extension should activate without errors', async () => {
        const extension = vscode.extensions.getExtension('your-publisher-name.timestamp-inserter');
        await extension?.activate();
        assert.ok(extension?.isActive, 'Extension is not active');
    });

    test('Insert Timestamp command should insert text', async () => {
        const editor = await vscode.window.showTextDocument(
            await vscode.workspace.openTextDocument({ content: '' })
        );

        // Run the command
        await vscode.commands.executeCommand('extension.insertTimestamp');

        // Check that the editor content is not empty after command
        const text = editor.document.getText();
        assert.notStrictEqual(text.length, 0, 'Timestamp was not inserted');
    });
});
