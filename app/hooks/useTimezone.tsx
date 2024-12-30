export const useTimezone = () => {
    const tzFromUrl =
        new URLSearchParams(
            typeof window !== 'undefined' ? window.location.search : 'UTC'
        ).get('tz') || 'UTC'
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    return { tzFromUrl, timezone }
}
