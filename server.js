/* eslint-disable no-undef */
import { createRequestHandler } from '@remix-run/express'
import { installGlobals } from '@remix-run/node'
import compression from 'compression'
import express from 'express'
import morgan from 'morgan'
import session from 'express-session'
import chalk from 'chalk'
import dotenv from 'dotenv'
dotenv.config()

installGlobals()

const viteDevServer =
    process.env.NODE_ENV === 'production'
        ? undefined
        : await import('vite').then((vite) =>
              vite.createServer({
                  server: { middlewareMode: true },
              })
          )

const remixHandler = createRequestHandler({
    build: viteDevServer
        ? () => viteDevServer.ssrLoadModule('virtual:remix/server-build')
        : await import('./build/server/index.js'),
})

const app = express()

app.use(compression())

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by')

// handle asset requests
if (viteDevServer) {
    app.use(viteDevServer.middlewares)
} else {
    // Vite fingerprints its assets so we can cache forever.
    app.use(
        '/assets',
        express.static('build/client/assets', { immutable: true, maxAge: '1y' })
    )
}

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
)

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static('build/client', { maxAge: '1h' }))

app.use(morgan('tiny'))

// handle SSR requests
app.all('*', remixHandler)

const port = process.env.PORT || 5173

app.listen(port, () =>
    console.log(
        chalk.blue.bold('Express server listening at'),
        chalk.green(`http://localhost:${port}`)
    )
)
