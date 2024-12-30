import { describe, expect, it } from 'vitest'
import { numDaysDaysInMonth, getRangeMinMax } from '~/utils/time'

describe('getRangeMinMax', () => {
    it('should return the correct min and max dates - January', () => {
        const date = new Date(2025, 0, 1, 0, 0, 0, 0)
        const { weekMin, weekMax, monthMin, monthMax, dayMin, dayMax } =
            getRangeMinMax(date)

        expect(weekMin).toEqual(new Date(2024, 11, 29, 0, 0, 0, 0))
        expect(weekMax).toEqual(new Date(2025, 0, 4, 23, 59, 59, 999))
        expect(monthMin).toEqual(new Date(2025, 0, 1, 0, 0, 0, 0))
        expect(monthMax).toEqual(new Date(2025, 0, 30, 23, 59, 59, 999))
        expect(dayMin).toEqual(new Date(2025, 0, 1))
        expect(dayMax).toEqual(new Date(2025, 0, 1, 23, 59, 59, 999))
    })

    it('should return the correct min and max dates - December', () => {
        const date = new Date(2024, 11, 30, 0, 0, 0, 0)
        const { weekMin, weekMax, monthMin, monthMax, dayMin, dayMax } =
            getRangeMinMax(date)

        expect(weekMin).toEqual(new Date(2024, 11, 29, 0, 0, 0, 0))
        expect(weekMax).toEqual(new Date(2025, 0, 4, 23, 59, 59, 999))
        expect(monthMin).toEqual(new Date(2024, 11, 1, 0, 0, 0, 0))
        expect(monthMax).toEqual(new Date(2024, 11, 30, 23, 59, 59, 999))
        expect(dayMin).toEqual(new Date(2024, 11, 30))
        expect(dayMax).toEqual(new Date(2024, 11, 30, 23, 59, 59, 999))
    })
})

describe('numDaysDaysInMonth', () => {
    it('should return the correct number of days in a month', () => {
        expect(numDaysDaysInMonth(2023, 1)).toBe(31)
        expect(numDaysDaysInMonth(2023, 2)).toBe(28)
        expect(numDaysDaysInMonth(2023, 3)).toBe(31)
        expect(numDaysDaysInMonth(2023, 4)).toBe(30)
        expect(numDaysDaysInMonth(2023, 5)).toBe(31)
        expect(numDaysDaysInMonth(2023, 6)).toBe(30)
        expect(numDaysDaysInMonth(2023, 7)).toBe(31)
        expect(numDaysDaysInMonth(2023, 8)).toBe(31)
        expect(numDaysDaysInMonth(2023, 9)).toBe(30)
        expect(numDaysDaysInMonth(2023, 10)).toBe(31)
        expect(numDaysDaysInMonth(2023, 11)).toBe(30)
        expect(numDaysDaysInMonth(2023, 12)).toBe(31)
    })
})
