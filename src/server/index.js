import Koa from 'koa'
import cors from '@koa/cors'
import serve from 'koa-static'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = new Koa()
app.use(cors())

app.use(serve(__dirname, './static'))

app.use(async (ctx, next) => {
  // debugger
  return new Promise((resolve) => {
    setTimeout(resolve, 5000)
  }).then(() => {
    ctx.body = {
      message: 'I am a teapot.'
    }
    return next()
  })
})

app.listen(3000)
