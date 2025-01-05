import { describe, expect, it } from 'vitest'
import {
    generateRandomInputOutputs,
    generateRandomString,
    generateRandomRgb,
    splitRgb,
} from '~/../tests/test-utils'

describe('generateRandomInputOutputs', () => {
    it('should return an array of input-output pairs', () => {
        const InputOutputPairs: [string, string][] = generateRandomInputOutputs(
            (input: string) => input
        )
        expect(InputOutputPairs.length).toBe(1000)
        InputOutputPairs.forEach(([input, output]) => {
            expect(input).toBe(output)
            expect(typeof input).toBe('string')
        })
    })
})

describe('generateRandomString', () => {
    it('should return a random string', () => {
        const InputOutputPairs: [string, string][] =
            generateRandomInputOutputs(generateRandomString)
        InputOutputPairs.forEach(([, output]) => {
            expect(typeof output).toBe('string')
        })
    })
})
