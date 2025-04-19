import * as vscode from 'vscode';
import { localize } from './localize';
import * as moment from 'moment';
import 'moment-timezone';

export async function showTimestampPicker(): Promise<string | undefined> {
    const presets = [
        { label: 'Full DateTime (YYYY-MM-DD HH:mm:ss)', format: 'YYYY-MM-DD HH:mm:ss' },
        { label: 'Date Only (YYYY-MM-DD)', format: 'YYYY-MM-DD' },
        { label: 'Time Only (HH:mm:ss)', format: 'HH:mm:ss' },
        { label: 'ISO 8601', format: moment.ISO_8601 },
        { label: 'Unix Timestamp (seconds)', format: 'X' },
        { label: 'Unix Timestamp (milliseconds)', format: 'x' },
        { label: 'RFC 2822', format: 'ddd, DD MMM YYYY HH:mm:ss ZZ' },
        { label: 'Short Date (MM/DD/YYYY)', format: 'MM/DD/YYYY' },
        { label: 'Long Date (MMMM Do YYYY, h:mm:ss a)', format: 'MMMM Do YYYY, h:mm:ss a' },
        { label: 'Weekday, Month Day, Year', format: 'dddd, MMMM Do YYYY' }
    ];

    const items = presets.map(p => {
        return {
            label: p.label,
            description: moment().format(p.format),
            format: p.format
        };
    });

    const selected = await vscode.window.showQuickPick(items, {
        placeHolder: localize('selectFormat'),
        matchOnDescription: true
    });

    if (!selected) {
        return undefined;
    }

    return selected.format;
}
