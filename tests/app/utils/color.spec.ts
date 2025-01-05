import { describe, expect, it, test } from 'vitest'
import {
    generateRandomInputOutputs,
    generateRandomRgb,
} from '~/../tests/test-utils'
import {
    getDeterministicRandomColor,
    darkenRgb,
    lightenRgb,
    splitRgb,
} from '~/utils/color'

describe('getDeterministicRandomColor', () => {
    it('should return a random rgb color', () => {
        const InputOutputPairs: [string, [number, number, number]][] =
            generateRandomInputOutputs(getDeterministicRandomColor)
        InputOutputPairs.forEach(([input, output]) => {
            const color = getDeterministicRandomColor(input)
            expect(color).toStrictEqual(output)
            const [r, g, b] = color
            expect(r).toBeGreaterThanOrEqual(0)
            expect(r).toBeLessThanOrEqual(255)
            expect(g).toBeGreaterThanOrEqual(0)
            expect(g).toBeLessThanOrEqual(255)
            expect(b).toBeGreaterThanOrEqual(0)
            expect(b).toBeLessThanOrEqual(255)
            const tests = []
            for (let i = 0; i < 10; i++) {
                tests.push(getDeterministicRandomColor(input))
            }
            expect(
                tests.every((n) => {
                    const [nr, ng, nb] = n
                    return nr === r && ng === g && nb === b
                })
            ).toEqual(true)
        })
    })
})

describe('darkenRgb', () => {
    const percentage = 20
    const InputOutputPairs: Map<
        [number, number, number],
        [number, number, number]
    > = new Map()
    for (let i = 0; i < 100; i++) {
        const rgb = generateRandomRgb()
        const output = darkenRgb(rgb, percentage)
        InputOutputPairs.set(rgb, output)
    }
    test.each(Array.from(InputOutputPairs.entries()))(
        'darkenRgb(%j, %j) should return %j',
        (
            input: [number, number, number],
            expected: [number, number, number]
        ) => {
            const color = darkenRgb(input, percentage)
            expect(color).toStrictEqual(expected)
            const [r, g, b] = color
            expect(r).toBeLessThanOrEqual(expected[0])
            expect(g).toBeLessThanOrEqual(expected[1])
            expect(b).toBeLessThanOrEqual(expected[2])
        }
    )
})

describe('lightenRgb', () => {
    const percentage = 20
    const InputOutputPairs: Map<
        [number, number, number],
        [number, number, number]
    > = new Map()
    for (let i = 0; i < 100; i++) {
        const rgb = generateRandomRgb()
        const output = lightenRgb(rgb, percentage)
        InputOutputPairs.set(rgb, output)
    }
    test.each(Array.from(InputOutputPairs.entries()))(
        'lightenRgb(%j, %j) should return %j',
        (
            input: [number, number, number],
            expected: [number, number, number]
        ) => {
            const color = lightenRgb(input, percentage)
            expect(color).toStrictEqual(expected)
            const [r, g, b] = color
            expect(r).toBeGreaterThanOrEqual(expected[0])
            expect(g).toBeGreaterThanOrEqual(expected[1])
            expect(b).toBeGreaterThanOrEqual(expected[2])
        }
    )
})

describe('splitRgb', () => {
    it('should return an array of numbers', () => {
        const InputOutputPairs: [string, [number, number, number]][] = []
        for (let i = 0; i < 100; i++) {
            const [r, g, b] = generateRandomRgb()
            const rgbString = `rgb(${r}, ${g}, ${b})`
            const output = splitRgb(rgbString)
            InputOutputPairs.push([rgbString, output])
        }
        InputOutputPairs.forEach(([input, output]) => {
            const rgb = splitRgb(input)
            expect(rgb).toEqual(output)
            expect(rgb.length).toBe(3)
            expect(typeof rgb[0]).toBe('number')
            expect(typeof rgb[1]).toBe('number')
            expect(typeof rgb[2]).toBe('number')
        })
    })
})
