const express = require('express')
const next = require('next')
const timber = require('timber')

const routes = require('./routes')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const handler = routes.getRequestHandler(app)

const transport = new timber.transports.HTTPS(process.env.API_KEY_TIMER)
timber.install(transport)

app.prepare()
.then(() => {
  const server = express()
  server.use(timber.middlewares.express())
  server.use(handler)

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
