export function logEvent(eventName: string, data?: Record<string, any>) {
    // Simple console log for analytics event
    console.log(`Analytics event: ${eventName}`, data || {});
    // In a real implementation, send this data to an analytics service
}
