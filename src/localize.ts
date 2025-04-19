export function localize(key: string): string {
    const messages: { [key: string]: string } = {
        noActiveEditor: "No active editor found.",
        selectFormat: "Select a timestamp format",
        selectTimezone: "Select a timezone",
        enterCustomTimezone: "Enter a custom timezone (e.g., America/New_York)",
        copiedClipboard: "Timestamp copied to clipboard",
        failedCopy: "Failed to copy timestamp to clipboard",
        insertedTimestamp: "Timestamp inserted",
        enterRelativeTime: "Enter relative time (e.g., 5 minutes ago, in 2 hours)",
        invalidRelativeTime: "Invalid relative time format"
    };
    return messages[key] || key;
}
