/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */

import { CacheProvider } from '@emotion/react'
import { RemixBrowser } from '@remix-run/react'
import * as React from 'react'
import { startTransition, StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'

import ClientStyleContext from '~/styles/client.context'
import createEmotionCache from '~/styles/createEmotionCache'

interface ClientCacheProviderProps {
    children: React.ReactNode
}

function ClientCacheProvider({ children }: ClientCacheProviderProps) {
    const [cache, setCache] = React.useState(createEmotionCache())

    const reset = React.useCallback(() => {
        setCache(createEmotionCache())
    }, [])

    return (
        <ClientStyleContext.Provider value={{ reset }}>
            <CacheProvider value={cache}>{children}</CacheProvider>
        </ClientStyleContext.Provider>
    )
}

startTransition(() => {
    hydrateRoot(
        document,
        <StrictMode>
            <ClientCacheProvider>
                <RemixBrowser />
            </ClientCacheProvider>
        </StrictMode>
    )
})
