export const numDaysDaysInMonth = (y: number, m: number) =>
    new Date(y, m, 0).getDate()

export const getPreviousMonth = (date: Date) => {
    const previousMonth = new Date(date)
    previousMonth.setMonth(previousMonth.getMonth() - 1)
    return previousMonth
}

export const getNextMonth = (date: Date) => {
    const nextMonth = new Date(date)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    return nextMonth
}

export const getPreviousDay = (date: Date) => {
    const previousDay = new Date(date)
    previousDay.setDate(previousDay.getDate() - 1)
    return previousDay
}

export const getNextDay = (date: Date) => {
    const nextDay = new Date(date)
    nextDay.setDate(nextDay.getDate() + 1)
    return nextDay
}

export const getPreviousWeek = (date: Date) => {
    const previousWeek = new Date(date)
    previousWeek.setDate(previousWeek.getDate() - 7)
    return previousWeek
}

export const getNextWeek = (date: Date) => {
    const nextWeek = new Date(date)
    nextWeek.setDate(nextWeek.getDate() + 7)
    return nextWeek
}

export const getRangeMinMax = (date: Date) => {
    // first moment of the month
    const monthMin = new Date(date)
    monthMin.setDate(1)
    monthMin.setMonth(Number(date.getMonth()))
    monthMin.setFullYear(Number(date.getFullYear()))
    monthMin.setHours(0, 0, 0, 0)

    // last moment of the month
    const monthMax = new Date(date)
    const daysInMonth = numDaysDaysInMonth(
        Number(date.getFullYear()),
        Number(date.getMonth() + 1)
    )
    monthMax.setDate(daysInMonth - 1)
    monthMax.setMonth(Number(date.getMonth()))
    monthMax.setFullYear(Number(date.getFullYear()))
    monthMax.setHours(23, 59, 59, 999)

    // first moment of week
    const weekMin = new Date(date)
    weekMin.setDate(date.getDate() - date.getDay())
    weekMin.setHours(0, 0, 0, 0)

    // last moment of week
    const weekMax = new Date(date)
    weekMax.setDate(date.getDate() - date.getDay() + 6)
    weekMax.setHours(23, 59, 59, 999)

    // first moment of day
    const dayMin = new Date(date)
    dayMin.setDate(date.getDate())
    dayMin.setHours(0, 0, 0, 0)

    // last moment of day
    const dayMax = new Date(date)
    dayMax.setDate(date.getDate())
    dayMax.setHours(23, 59, 59, 999)

    return { monthMin, monthMax, weekMin, weekMax, dayMin, dayMax }
}

export const isValidTimeZone = (tz: string) => {
    if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
        throw new Error('Time zones are not available in this environment')
    }

    try {
        Intl.DateTimeFormat(undefined, { timeZone: tz })
        return true
    } catch (ex) {
        return false
    }
}
