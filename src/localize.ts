<<<<<<< HEAD
const messages: { [lang: string]: { [key: string]: string } } = {
    en: {
=======
export function localize(key: string): string {
    const messages: { [key: string]: string } = {
>>>>>>> e8f278053f46b38b1d59a15b7ca49bb4ae9e7480
        noActiveEditor: "No active editor found.",
        selectFormat: "Select a timestamp format",
        selectTimezone: "Select a timezone",
        enterCustomTimezone: "Enter a custom timezone (e.g., America/New_York)",
        copiedClipboard: "Timestamp copied to clipboard",
        failedCopy: "Failed to copy timestamp to clipboard",
        insertedTimestamp: "Timestamp inserted",
        enterRelativeTime: "Enter relative time (e.g., 5 minutes ago, in 2 hours)",
        invalidRelativeTime: "Invalid relative time format"
<<<<<<< HEAD
    },
    es: {
        noActiveEditor: "No se encontró un editor activo.",
        selectFormat: "Seleccione un formato de marca de tiempo",
        selectTimezone: "Seleccione una zona horaria",
        enterCustomTimezone: "Ingrese una zona horaria personalizada (p. ej., America/New_York)",
        copiedClipboard: "Marca de tiempo copiada al portapapeles",
        failedCopy: "Error al copiar la marca de tiempo al portapapeles",
        insertedTimestamp: "Marca de tiempo insertada",
        enterRelativeTime: "Ingrese tiempo relativo (p. ej., hace 5 minutos, en 2 horas)",
        invalidRelativeTime: "Formato de tiempo relativo inválido"
    }
};

let currentLanguage = 'en';

export function setLanguage(lang: string) {
    if (messages[lang]) {
        currentLanguage = lang;
    }
}

export function localize(key: string): string {
    return messages[currentLanguage][key] || key;
=======
    };
    return messages[key] || key;
>>>>>>> e8f278053f46b38b1d59a15b7ca49bb4ae9e7480
}
