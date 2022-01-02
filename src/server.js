import Koa from 'koa'
import cors from '@koa/cors'

const app = new Koa()
app.use(cors())

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
