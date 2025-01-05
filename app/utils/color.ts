import {
    getDeterministicRandomNumber,
    lowerNumberTowardsMinByPercentage,
    raiseNumberTowardsMaxByPercentage,
} from '~/utils/number'

export function getDeterministicRandomColor(
    input: string
): [number, number, number] {
    const divisor = Math.floor(input.length / 3)
    const r = getDeterministicRandomNumber(input.slice(0, divisor))
    const g = getDeterministicRandomNumber(input.slice(divisor, divisor * 2))
    const b = getDeterministicRandomNumber(input.slice(divisor * 2))
    return [r, g, b]
}

export const splitRgb = (rgbString: string): [number, number, number] => {
    const splitByComma = rgbString.split(',')
    const SplitByCommaTrimmed = splitByComma.map((n) => n.trim())
    const r = parseInt(SplitByCommaTrimmed[0].replace('rgb(', ''))
    const g = parseInt(SplitByCommaTrimmed[1])
    const b = parseInt(SplitByCommaTrimmed[2].replace(')', ''))
    return [r, g, b]
}

export const darkenRgb = (
    rgb: [number, number, number],
    percentage: number
): [number, number, number] => {
    const [r, g, b] = rgb.map((n) =>
        raiseNumberTowardsMaxByPercentage(n, 255, percentage)
    )
    return [r, g, b]
}

export const lightenRgb = (
    rgb: [number, number, number],
    percentage: number
): [number, number, number] => {
    const [r, g, b] = rgb.map((n) =>
        lowerNumberTowardsMinByPercentage(n, 0, percentage)
    )
    return [r, g, b]
}

export const getListColor = (() => {
    const colorCache: Record<string, [number, number, number]> = {}

    return (id: string): [number, number, number] => {
        if (!id) {
            return [0, 0, 0]
        }
        colorCache[id] = colorCache[id] || getDeterministicRandomColor(id)

        return colorCache[id]
    }
})()
