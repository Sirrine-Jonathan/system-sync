import { useEffect, useState } from 'react'
export const useIsMobile = () => {
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)

    useEffect(() => {
        if (typeof window === 'undefined') {
            return
        }
        const handleResize = () => {
            setWidth(window.innerWidth)
            setHeight(window.innerHeight)
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return {
        isMobile: width < 768,
        isLandscape: height < width,
    }
}
