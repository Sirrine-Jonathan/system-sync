export function getDeterministicRandomNumber(input: string): number {
    // Simple hash function to convert the string to a number
    let hash = 0
    for (let i = 0; i < input.length; i++) {
        hash = (hash << 5) - hash + input.charCodeAt(i)
        hash |= 0 // Convert to 32-bit integer
    }

    // Map the hash value to a number between 0 and 255
    return Math.abs(hash) % 255
}

export const lowerNumberTowardsMinByPercentage = (
    number: number,
    min: number,
    percentage: number
) => {
    if (number < min) {
        throw new Error("Number can't be lower than min")
    }
    return Math.max(Math.floor(number * (1 - percentage / 100)), min)
}

export const raiseNumberTowardsMaxByPercentage = (
    number: number,
    max: number,
    percentage: number
) => {
    if (number > max) {
        throw new Error("Number can't be higher than max")
    }
    return Math.min(Math.floor(number * (1 + percentage / 100)), max)
}
