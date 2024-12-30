import { useEffect, useRef } from 'react'
import { Highlight } from './styledParts/Text'

export const DateTime = () => {
    const dateStringRef = useRef<HTMLDivElement>(null)
    const localTimeRef = useRef<HTMLDivElement>(null)

    const setTime = () => {
        if (dateStringRef.current) {
            dateStringRef.current.textContent = new Date().toLocaleDateString()
        }
        if (localTimeRef.current) {
            localTimeRef.current.textContent =
                new Date().toLocaleTimeString().slice(0, 4) +
                ' ' +
                new Date().toLocaleTimeString().slice(8)
        }
    }

    useEffect(() => {
        setTime()
        setInterval(() => {
            setTime()
        }, 3000)
    }, [])

    return (
        <div>
            <div>
                Today is <Highlight ref={dateStringRef}>--/--/----</Highlight>
            </div>
            <div>
                The time is <Highlight ref={localTimeRef}>--:-- --</Highlight>
            </div>
        </div>
    )
}
