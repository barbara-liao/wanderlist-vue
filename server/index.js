import 'dotenv/config'
import express from 'express'
import ClientError from './client-error.js'
import errorMiddleware from './error-middleware.js'
import staticMiddleware from './static-middleware.js'

const app = express()

app.use(staticMiddleware)

app.use('/api/*', (req, res, next) => {
  next(new ClientError(404, `Cannot ${req.method} ${req.originalUrl}.`))
})

app.use(errorMiddleware)

app.listen(process.env.PORT, () => {
  process.stdout.write(`\napp listening on port ${process.env.PORT}\n`)
})
