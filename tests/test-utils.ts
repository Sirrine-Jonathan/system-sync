export const generateRandomString = (): string => {
    const inputChars =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const maxLength = 50
    let input = ''
    for (let i = 0; i < Math.floor(Math.random() * maxLength + 1); i++) {
        input += inputChars[Math.floor(Math.random() * inputChars.length)]
    }
    return input
}
export const generateRandomInputOutputs = <T>(
    func: (input: string) => T
): [string, T][] => {
    const InputOutputPairs: [string, T][] = []
    for (let i = 0; i < 1000; i++) {
        const input = generateRandomString()
        const output = func(input)
        InputOutputPairs.push([input, output])
    }
    return InputOutputPairs
}

export const generateRandomRgb = (): [number, number, number] => {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    return [r, g, b]
}
