import { useState, useEffect } from 'react'
import { type User } from '~/services/auth.server'
import { useOutletContext } from '@remix-run/react'

export const useIsSignedIn = () => {
    const context = useOutletContext<{ user: User | null }>()
    const [isSignedIn, setIsSignedIn] = useState(!!context?.user)

    useEffect(() => {
        setIsSignedIn(!!context)
    }, [context?.user])

    return isSignedIn
}
