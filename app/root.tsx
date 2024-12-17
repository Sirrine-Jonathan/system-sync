import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { useContext, useEffect, useRef } from "react";
import type { LinksFunction } from "@remix-run/node";
import { withEmotionCache, Global } from "@emotion/react";

import ClientStyleContext from "~/styles/client.context";
import ServerStyleContext from "~/styles/server.context";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "icon",
    href: "/favicon.ico",
    type: "image/x-icon",
  },
];

interface DocumentProps {
  children: React.ReactNode;
  title?: string;
}

const Document = withEmotionCache(
  ({ children, title }: DocumentProps, emotionCache) => {
    const serverStyleData = useContext(ServerStyleContext);
    const clientStyleData = useContext(ClientStyleContext);
    const reinjectStylesRef = useRef(true);
    // Only executed on client
    // When a top level ErrorBoundary or CatchBoundary are rendered,
    // the document head gets removed, so we have to create the style tags
    useEffect(() => {
      if (!reinjectStylesRef.current) {
        return;
      }
      // re-link sheet container
      emotionCache.sheet.container = document.head;

      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        emotionCache.sheet._insertTag(tag);
      });

      // reset cache to re-apply global styles
      clientStyleData.reset();
      // ensure we only do this once per mount
      reinjectStylesRef.current = false;
    }, [clientStyleData, emotionCache.sheet]);

    return (
      <html lang="en">
        <head>
          {title ? <title>{title}</title> : null}
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
          {serverStyleData?.map(({ key, ids, css }) => (
            <style
              key={key}
              data-emotion={`${key} ${ids.join(" ")}`}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: css }}
            />
          ))}
        </head>
        <body>
          {children}
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    );
  }
);

const globalStyles = `
  html, body {
    margin: 0;
    padding: 0;
    min-height: 100%;
  }

  body {
    background: URL("/images/sand.jpg") no-repeat center center fixed;
    background-size: cover;

    color: white;
    font: 1em "Inter", sans-serif;
    font-size: 16px;
    font-family: "NotoSans", sans-serif;
  }

  main {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  main header, main section {
    padding: 1rem
  }

  img {
    width: 1.5rem;
    max-width: 100%;
  }

  hr {
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    margin: 1rem 0;
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
`;

export default function App() {
  return (
    <Document>
      <Global styles={globalStyles} />
      <Outlet />
    </Document>
  );
}
