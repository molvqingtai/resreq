import { test, describe } from 'vitest'
import Server from './helper/Server'
import Resreq, { Req } from '../src'

describe('Init Request and Response', () => {
  test('Init Request', async () => {
    const server = new Server()
    const { origin: baseUrl } = await server.listen()
    const resreq = new Resreq({ baseUrl })

    server.get('/api', (ctx) => {
      ctx.status = 200
    })

    resreq.use((next) => async (req) => {
      // debugger
      const _req = new Req(req, {
        url: origin + 'api',
        method: 'GET',
        meta: {
          foo: 'bar'
        }
      })
      // debugger
      return await next(_req)
    })

    await resreq.post('/404')

    server.close()
  })
})
