import { test, describe, expect, vi } from 'vitest'
import Server from './helpers/Server'
import Resreq, { Req, Res } from '../src'
import sleep from './helpers/sleep'

interface ApiResponse {
  code: number
  message: string
  data: any
}

describe('Test middleware', () => {
  test('Request success with middleware', async () => {
    const server = new Server()
    const { origin: baseURL } = await server.listen()
    const resreq = new Resreq({ baseURL })

    const requestLog = vi.fn()
    const responseLog = vi.fn()
    resreq.use((next) => async (req) => {
      requestLog()
      const res = await next(req)
      expect(res).toHaveProperty('status', 200)
      responseLog()
      return res
    })

    server.get('/api', (ctx) => {
      ctx.status = 200
    })

    await resreq.get('/api')
    expect(responseLog).toBeCalledTimes(1)
    expect(requestLog).toBeCalledTimes(1)

    server.close()
  })

  test('Request success with multiple middleware', async () => {
    const server = new Server()
    const { origin: baseURL } = await server.listen()
    const resreq = new Resreq({ baseURL })

    const requestLog = vi.fn()
    const responseLog = vi.fn()

    resreq.use([
      (next) => async (req) => {
        requestLog()
        const res = await next(req)
        expect(res).toHaveProperty('status', 200)
        responseLog()
        return res
      },
      (next) => async (req) => {
        requestLog()
        const res = await next(req)
        expect(res).toHaveProperty('status', 200)
        responseLog()
        return res
      }
    ])

    server.get('/api', (ctx) => {
      ctx.status = 200
    })

    await expect(resreq.get('/api')).resolves.toHaveProperty('status', 200)
    expect(responseLog).toBeCalledTimes(2)
    expect(requestLog).toBeCalledTimes(2)

    server.close()
  })

  test('Request error with middleware', async () => {
    const server = new Server()
    const { origin: baseURL } = await server.listen()
    const resreq = new Resreq({ baseURL })

    const requestLog = vi.fn()

    resreq.use((next) => async (req) => {
      requestLog()
      await next(req)
      throw new Error()
    })

    server.get('/api', (ctx) => {
      ctx.status = 200
    })

    await expect(resreq.get('/api')).rejects.toThrow()
    expect(requestLog).toBeCalledTimes(1)

    server.close()
  })

  test('Request error with multiple middleware', async () => {
    const server = new Server()
    const { origin: baseURL } = await server.listen()
    const resreq = new Resreq({ baseURL })

    const requestLog = vi.fn()
    const responseLog = vi.fn()

    resreq.use([
      (next) => async (req) => {
        requestLog()
        const res = await next(req)
        responseLog()
        return res
      },
      (next) => async (req) => {
        requestLog()
        const res = await next(req)
        responseLog()
        return res
      },
      (next) => async (req) => {
        requestLog()
        await next(req)
        throw new Error()
      }
    ])

    server.get('/api', (ctx) => {
      ctx.status = 500
    })

    await expect(resreq.get('/api')).rejects.toThrow()
    expect(requestLog).toBeCalledTimes(3)
    expect(responseLog).toBeCalledTimes(0)

    server.close()
  })
})

describe('Test overload options', () => {
  test('Overload url and method', async () => {
    const server = new Server()
    const { origin: baseURL } = await server.listen()
    const resreq = new Resreq({ baseURL })

    server.get('/api', (ctx) => {
      ctx.status = 200
    })

    resreq.use((next) => async (req) => {
      const _req = new Req(req, {
        url: baseURL + '/api',
        method: 'GET'
      })
      return await next(_req)
    })

    await expect(resreq.post('/404')).resolves.toHaveProperty('status', 200)

    server.close()
  })

  test('Overload meta', async () => {
    const server = new Server()
    const { origin: baseURL } = await server.listen()
    const resreq = new Resreq({ baseURL })

    server.get('/api', (ctx) => {
      ctx.status = 200
    })

    resreq.use((next) => async (req) => {
      const _req = new Req(req, {
        meta: {
          key: 2
        }
      })
      return await next(_req)
    })

    await expect(
      resreq.get('/api', {
        meta: {
          key: 1
        }
      })
    ).resolves.toHaveProperty('meta', { key: 2 })

    server.close()
  })

  test('Overload headers', async () => {
    const server = new Server()
    const { origin: baseURL } = await server.listen()
    const resreq = new Resreq({ baseURL })

    server.get('/api', (ctx) => {
      ctx.status = 200
    })

    resreq.use((next) => async (req) => {
      const _req = new Req(req, {
        headers: {
          'X-Custom-Header': 'bar'
        }
      })
      expect(_req.headers.get('Content-Type')).toBe(null)
      expect(_req.headers.get('X-Custom-Header')).toBe('bar')
      return await next(_req)
    })

    await resreq.get<Response>('/api', {
      headers: {
        'Content-Type': 'application/json',
        'X-Custom-Header': 'foo'
      }
    })

    server.close()
  })

  test('Overload request body', async () => {
    const server = new Server()
    const { origin: baseURL } = await server.listen()
    const resreq = new Resreq({ baseURL, responseType: 'json' })

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

    const res: ApiResponse = await resreq.post('/api', {
      body: {
        message: 'ok'
      }
    })

    expect(res.data).toEqual({ message: 'no' })

    server.close()
  })

  test('Overload response body', async () => {
    const server = new Server()
    const { origin: baseURL } = await server.listen()
    const resreq = new Resreq({ baseURL, responseType: 'json' })

    server.post('/api', (ctx) => {
      ctx.body = {
        code: 200,
        data: ctx.request.body
      }
    })

    resreq.use((next) => async (req) => {
      const res = await next(req)

      return new Res(res, {
        body: {
          data: {
            message: 'no'
          }
        }
      })
    })

    const res: ApiResponse = await resreq.post('/api', {
      body: {
        message: 'ok'
      }
    })

    expect(res.data).toEqual({ message: 'no' })

    server.close()
  })

  test('Overload response body error', async () => {
    const server = new Server()
    const { origin: baseURL } = await server.listen()
    const resreq = new Resreq({ baseURL, responseType: 'json' })

    server.post('/api', (ctx) => {
      ctx.body = {
        code: 200,
        data: ctx.request.body
      }
    })

    resreq.use((next) => async (req) => {
      const formData = new FormData()
      formData.append('message', 'no')

      const res = await next(req)
      const errorObject = {
        content: {}
      }
      errorObject.content = errorObject
      return new Res(res, {
        body: errorObject
      })
    })

    await expect(resreq.post('/api')).rejects.toThrowError(/valid JSON object/)

    server.close()
  })

  test('Overload throwHttpError', async () => {
    const server = new Server()
    const { origin: baseURL } = await server.listen()
    const resreq = new Resreq({ baseURL })
    resreq.use((next) => async (req) => {
      const _req = new Req(req, {
        throwHttpError: true
      })
      return await next(_req)
    })

    server.get('/api', (ctx) => {
      ctx.status = 500
    })

    await expect(resreq.get('/api')).rejects.toThrowError(/500/)

    server.close()
  })

  test('Overload timeout', async () => {
    const server = new Server()
    const { origin: baseURL } = await server.listen()
    const resreq = new Resreq({ baseURL, timeout: 10000 })

    server.get('/api', async (ctx) => {
      await sleep(500)
      ctx.status = 200
    })
    resreq.use((next) => async (req) => {
      const _req = new Req(req, {
        timeout: 300
      })
      return await next(_req)
    })

    await expect(resreq.get('/api')).rejects.toThrowError(/timeout/)

    server.close()
  })

  test('Overload responseType', async () => {
    const server = new Server()
    const { origin: baseURL } = await server.listen()
    const resreq = new Resreq({ baseURL, responseType: 'json' })

    server.get('/api', async (ctx) => {
      ctx.body = {
        code: 200,
        data: 'foobar'
      }
    })
    resreq.use((next) => async (req) => {
      const _req = new Req(req, {
        timeout: 300,
        responseType: 'text'
      })
      return await next(_req)
    })

    const res: ApiResponse = await resreq.get('/api')
    expect(res.data).toBe('foobar')

    server.close()
  })
})
