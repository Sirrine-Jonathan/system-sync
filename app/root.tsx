import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from '@remix-run/react'
import { useContext, useEffect, useRef } from 'react'
import type { LinksFunction } from '@remix-run/node'
import { withEmotionCache, Global } from '@emotion/react'

import ClientStyleContext from '~/styles/client.context'
import ServerStyleContext from '~/styles/server.context'

export const links: LinksFunction = () => [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
    },
    {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
    },
    {
        rel: 'icon',
        href: '/images/logo.png',
        type: 'image/png',
    },
]

interface DocumentProps {
    children: React.ReactNode
    title?: string
}

const Document = withEmotionCache(
    ({ children, title }: DocumentProps, emotionCache) => {
        const serverStyleData = useContext(ServerStyleContext)
        const clientStyleData = useContext(ClientStyleContext)
        const reinjectStylesRef = useRef(true)
        // Only executed on client
        // When a top level ErrorBoundary or CatchBoundary are rendered,
        // the document head gets removed, so we have to create the style tags
        useEffect(() => {
            if (!reinjectStylesRef.current) {
                return
            }
            // re-link sheet container
            emotionCache.sheet.container = document.head

            // re-inject tags
            const tags = emotionCache.sheet.tags
            emotionCache.sheet.flush()
            tags.forEach((tag) => {
                emotionCache.sheet._insertTag(tag)
            })

            // reset cache to re-apply global styles
            clientStyleData.reset()
            // ensure we only do this once per mount
            reinjectStylesRef.current = false
        }, [clientStyleData, emotionCache.sheet])

        return (
            <html lang="en">
                <head>
                    {title ? <title>{title}</title> : null}
                    <meta charSet="utf-8" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1"
                    />
                    <Meta />
                    <Links />
                    {serverStyleData?.map(({ key, ids, css }) => (
                        <style
                            key={key}
                            data-emotion={`${key} ${ids.join(' ')}`}
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={{ __html: css }}
                        />
                    ))}
                    <link rel="manifest" href="/manifest.json"></link>
                </head>
                <body>
                    {children}
                    <ScrollRestoration />
                    <Scripts />
                </body>
            </html>
        )
    }
)

const globalStyles = `
  :root {
    --color-black: #111111;
    --color-white: #eeeeee;
    --primary-bg: #e1d2b7;
    --primary-bg-dark:rgb(29, 27, 23);
    --secondary-bg:  #3d4c72;
    --accent-color: #f6b32b;
    --strong-color: #a04029;
    --subtle-color: #90a46d;
    --vertical-padding: 0.5rem;
    --horizontal-padding: 0.5rem;
  }
  html, body {
    margin: 0;
    padding: 0;
    min-height: 100%;
    box-sizing: border-box;
  }

  body {
    background-color: var(--primary-bg-dark);
    // background: URL("/images/forest-fog.jpg") no-repeat center center fixed;
    background-size: cover;
    color: var(--color-white);
    font: 1em "Inter", sans-serif;
    font-family: "NotoSans", sans-serif;
  }

  main {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  main section {
    padding: var(--vertical-padding) var(--horizontal-padding);
  }

  img {
    width: 1.5rem;
    max-width: 100%;
  }

  hr {
    border: none;
    border-top: 1px solid var(--subtle-color);
    margin: var(--vertical-padding) 0;
  }



  @media (min-width: 769px) {
    body {
      font-size: 14px;
    }
  }

  @media (max-width: 768px) {
    body {
      font-size: 12px;
    }
  }

  @font-face {
    font-family: "CormantGaramond";
    font-weight: 400;
    font-style: normal;
    src: url("/fonts/Cormant_Garamond/CormorantGaramond-Regular.ttf") format("truetype");
  }

  @font-face {
    font-family: "NotoSans";
    src: url("/fonts/Noto_Sans/static/NotoSans-Regular.ttf") format("truetype");
  } 
`

export default function App() {
    return (
        <Document>
            <Global styles={globalStyles} />
            <Outlet />
        </Document>
    )
}
