import path from 'path'
import fs from 'fs/promises'

let staticMiddleware

if (process.env.NODE_ENV === 'development') {
  const vite = await import('vite')
  const { default: config } = await import('../vite.config.js')
  const server = await vite.createServer({
    ...config,
    server: {
      middlewareMode: true
    }
  })
  const excluded = [
    'viteSpaFallbackMiddleware',
    'viteIndexHtmlMiddleware',
    'vite404Middleware'
  ]
  server.middlewares.stack = server.middlewares.stack.filter(layer => {
    return !excluded.includes(layer.handle.name)
  })
  server.middlewares.use(async (req, res, next) => {
    if (req.url !== '/' && req.url !== '/index.html') return next()
    try {
      const indexHtmlPath = path.join(server.config.root, 'index.html')
      const template = await fs.readFile(indexHtmlPath, 'utf8')
      const indexHtml = await server.transformIndexHtml(
        req.url, template, req.originalUrl
      )
      res.set(server.config.server.headers).send(indexHtml)
    } catch (err) {
      next(err)
    }
  })
  staticMiddleware = server.middlewares
} else {
  const { default: express } = await import('express')
  const { pathname: publicPath } = new URL('./public', import.meta.url)
  staticMiddleware = express.static(publicPath)
}

export default staticMiddleware
