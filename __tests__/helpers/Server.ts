import Koa, { DefaultState, DefaultContext } from 'koa'
import cors from '@koa/cors'
import body from 'koa-body'
import Router, { Middleware } from '@koa/router'

interface ServerInfo {
  port: number
  origin: string
  host: string
}
export default class Server {
  private server: any
  private readonly app: Koa
  private readonly router: Router

  constructor() {
    this.app = new Koa()
    this.router = new Router()
    this.app.use(cors())
    this.app.use(body({ multipart: true }))
    this.app.use(this.router.routes())
  }

  async listen(port?: number): Promise<ServerInfo> {
    return await new Promise((resolve) => {
      this.server = this.app.listen(port)
      this.server.on('listening', () => {
        const port: number = this.server.address().port
        resolve({
          port,
          host: `localhost:${port}`,
          origin: `http://localhost:${port}`
        })
      })
    })
  }

  get(path: string | RegExp, ...middleware: Array<Middleware<DefaultState, DefaultContext>>) {
    this.router.get(path, ...middleware)
  }

  post(path: string | RegExp, ...middleware: Array<Middleware<DefaultState, DefaultContext>>) {
    this.router.post(path, ...middleware)
  }

  put(path: string | RegExp, ...middleware: Array<Middleware<DefaultState, DefaultContext>>) {
    this.router.put(path, ...middleware)
  }

  delete(path: string | RegExp, ...middleware: Array<Middleware<DefaultState, DefaultContext>>) {
    this.router.del(path, ...middleware)
  }

  close() {
    this.server.close()
  }

  on(event: string, listener: (...args: any[]) => void) {
    this.app.on(event, listener)
  }
}
