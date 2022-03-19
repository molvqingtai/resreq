import { test, describe, expect } from 'vitest'
import Server from './helpers/Server'
import Resreq, { Req } from '../src'

describe('Test options', () => {
  // test('Overload url and method', async () => {
  //   const server = new Server()
  //   const { origin: baseUrl } = await server.listen()
  //   const resreq = new Resreq({ baseUrl })

  //   server.get('/api', (ctx) => {
  //     ctx.status = 200
  //   })

  //   resreq.use((next) => async (req) => {
  //     const _req = new Req(req, {
  //       url: baseUrl + '/api',
  //       method: 'GET'
  //     })
  //     return await next(_req)
  //   })

  //   await expect(resreq.post('/404')).resolves.toHaveProperty('status', 200)

  //   server.close()
  // })

  // test('Overload meta', async () => {
  //   const server = new Server()
  //   const { origin: baseUrl } = await server.listen()
  //   const resreq = new Resreq({ baseUrl })

  //   server.get('/api', (ctx) => {
  //     ctx.status = 200
  //   })

  //   resreq.use((next) => async (req) => {
  //     const _req = new Req(req, {
  //       meta: {
  //         key: 2
  //       }
  //     })
  //     return await next(_req)
  //   })

  //   await expect(
  //     resreq.get('/api', {
  //       meta: {
  //         key: 1
  //       }
  //     })
  //   ).resolves.toHaveProperty('meta', { key: 2 })

  //   server.close()
  // })

  // test('Overload headers', async () => {
  //   const server = new Server()
  //   const { origin: baseUrl } = await server.listen()
  //   const resreq = new Resreq({ baseUrl })

  //   server.get('/api', (ctx) => {
  //     ctx.status = 200
  //   })

  //   resreq.use((next) => async (req) => {
  //     const _req = new Req(req, {
  //       headers: {
  //         'X-Custom-Header': 'custom'
  //       }
  //     })
  //     return await next(_req)
  //   })

  //   const value = (
  //     await resreq.get('/api', {
  //       headers: {
  //         'X-Custom-Header': 'custom2'
  //       }
  //     })
  //   ).headers.get('X-Custom-Header')

  //   expect(value).toBe('custom')

  //   server.close()
  // })

  test('Overload body', async () => {
    const server = new Server()
    const { origin: baseUrl } = await server.listen()
    const resreq = new Resreq({ baseUrl })

    server.post('/api', (ctx) => {
      ctx.body = {
        code: 200,
        data: ctx.request.body
      }
    })

    resreq.use((next) => async (req) => {
      const formData = new FormData()
      formData.append('message', 'no')
      const _req = new Req(req, {
        body: formData
      })
      return await next(_req)
    })

    const res: any = await (
      await resreq.post('/api', {
        body: {
          message: 'ok'
        }
      })
    ).json()

    expect(res.data).toEqual({ message: 'no' })

    server.close()
  })
})
// throwHttpError

// TODO
// timeout TEST
// signal TEST
// POST more body type
// abortController
