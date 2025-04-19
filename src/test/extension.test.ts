import * as assert from 'assert';
import * as vscode from 'vscode';
import { localize, setLanguage } from '../localize';

suite('Timestamp Inserter Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Localization function returns correct string', () => {
        setLanguage('en');
        assert.strictEqual(localize('noActiveEditor'), 'No active editor found.');
        setLanguage('es');
        assert.strictEqual(localize('noActiveEditor'), 'No se encontró un editor activo.');
    });

    test('Timestamp history saves and retrieves correctly', async () => {
        const context: any = {
            globalState: {
                _storage: [] as string[],
                get: function(key: string, defaultValue: string[]) {
                    return this._storage.length ? this._storage : defaultValue;
                },
                update: function(key: string, value: string[]) {
                    this._storage = value;
                    return Promise.resolve();
                }
            }
        };

        const timestamp = '2024-06-01 12:00:00';
        const { saveTimestampToHistory } = require('../extension');
        await saveTimestampToHistory(context, timestamp);
        const history = context.globalState.get('timestampHistory', []);
        assert.ok(history.includes(timestamp));
    });
});
