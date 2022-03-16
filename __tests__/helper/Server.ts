import Koa, { DefaultState, DefaultContext } from 'koa'
import cors from '@koa/cors'
import body from 'koa-body'
// import body from 'koa-bodyparser'
import Router, { Middleware } from '@koa/router'

export default class Server {
  private _server: any
  server: Koa
  router: Router
  config: { host: string; port: number }

  constructor(config = {}) {
    this.server = new Koa()
    this.router = new Router()
    this.server.use(cors())
    this.server.use(body({ multipart: true }))
    this.config = {
      host: 'http://localhost',
      port: 3000
    }
  }

  async listen(): Promise<number> {
    return await new Promise((resolve) => {
      this._server = this.server.listen(this.config.port, () => resolve(Date.now()))
    })
  }

  get(path: string | RegExp, ...middleware: Array<Middleware<DefaultState, DefaultContext>>) {
    this.router.get(path, ...middleware)
    this.server.use(this.router.routes())
  }

  post(path: string | RegExp, ...middleware: Array<Middleware<DefaultState, DefaultContext>>) {
    this.router.post(path, ...middleware)
    this.server.use(this.router.routes())
  }

  put(path: string | RegExp, ...middleware: Array<Middleware<DefaultState, DefaultContext>>) {
    this.router.put(path, ...middleware)
    this.server.use(this.router.routes())
  }

  delete(path: string | RegExp, ...middleware: Array<Middleware<DefaultState, DefaultContext>>) {
    this.router.del(path, ...middleware)
    this.server.use(this.router.routes())
  }

  close() {
    this._server.close()
  }
}
