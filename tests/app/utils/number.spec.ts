import { describe, expect, it } from 'vitest'
import {
    generateRandomInputOutputs,
    generateRandomString,
} from '~/../tests/test-utils'
import {
    getDeterministicRandomNumber,
    lowerNumberTowardsMinByPercentage,
    raiseNumberTowardsMaxByPercentage,
} from '~/utils/number'

describe('getDeterministicRandomNumber', () => {
    it('should return a number between 0 and 255', () => {
        const InputOutputPairs: [string, number][] = generateRandomInputOutputs(
            getDeterministicRandomNumber
        )
        for (let i = 0; i < 1000; i++) {
            const input = generateRandomString()
            const output = getDeterministicRandomNumber(input)
            InputOutputPairs.push([input, output])
        }
        InputOutputPairs.forEach(([input, output]) => {
            const number = getDeterministicRandomNumber(input)
            expect(number).toBe(output)
            expect(number).toBeGreaterThanOrEqual(0)
            expect(number).toBeLessThanOrEqual(255)
            const tests = []
            for (let i = 0; i < 10; i++) {
                tests.push(getDeterministicRandomNumber(input))
            }
            expect(tests.every((n) => n === number)).toBe(true)
        })
    })
})

describe('lowerNumberTowardsMinByPercentage', () => {
    it('should return a number between 0 and 255', () => {
        const InputOutputPairs: [number, number, number, number | string][] = []
        for (let i = 0; i < 1000; i++) {
            const number = Math.floor(Math.random() * 256)
            const min = Math.floor(Math.random() * 256)
            const percentage = Math.floor(Math.random() * 101)
            try {
                const output = lowerNumberTowardsMinByPercentage(
                    number,
                    min,
                    percentage
                )
                InputOutputPairs.push([number, min, percentage, output])
            } catch (e) {
                const message = e instanceof Error ? e.message : (e as string)
                InputOutputPairs.push([number, min, percentage, message])
            }
        }
        InputOutputPairs.forEach(([number, min, percentage, output]) => {
            try {
                const result = lowerNumberTowardsMinByPercentage(
                    number,
                    min,
                    percentage
                )
                expect(result).toBe(output)
                expect(result).toBeGreaterThanOrEqual(min)
                expect(result).toBeLessThanOrEqual(number)
            } catch (e) {
                const message = e instanceof Error ? e.message : (e as string)
                expect(message).toBe(output)
                return
            }
        })
    })
})

describe('raiseNumberTowardsMaxByPercentage', () => {
    it('should return a number between 0 and 255', () => {
        const InputOutputPairs: [number, number, number, number | string][] = []
        for (let i = 0; i < 1000; i++) {
            const number = Math.floor(Math.random() * 256)
            const max = Math.floor(Math.random() * 256)
            const percentage = Math.floor(Math.random() * 101)
            try {
                const output = raiseNumberTowardsMaxByPercentage(
                    number,
                    max,
                    percentage
                )
                InputOutputPairs.push([number, max, percentage, output])
            } catch (e) {
                const message = e instanceof Error ? e.message : (e as string)
                InputOutputPairs.push([number, max, percentage, message])
            }
        }
        InputOutputPairs.forEach(([number, max, percentage, output]) => {
            try {
                const result = raiseNumberTowardsMaxByPercentage(
                    number,
                    max,
                    percentage
                )
                expect(result).toBe(output)
                expect(result).toBeLessThanOrEqual(max)
                expect(result).toBeGreaterThanOrEqual(number)
            } catch (e) {
                const message = e instanceof Error ? e.message : (e as string)
                expect(message).toBe(output)
                return
            }
        })
    })
})
