import { test, describe, expect } from 'vitest'
import Server from './helpers/Server'
import Resreq from '../src'

interface ApiResponse {
  code: number
  message: string
  data: any
}

describe('Test request methods', () => {
  test('request', async () => {
    const server = new Server()
    const { origin: baseUrl } = await server.listen()
    const resreq = new Resreq({ baseUrl })

    server.get('/api', (ctx) => {
      ctx.body = {
        code: 200,
        message: 'ok',
        data: ctx.request.query
      }
    })
    const res: ApiResponse = await (
      await resreq.request({
        url: '/api',
        method: 'GET',
        params: {
          message: 'ok'
        }
      })
    ).json()
    expect(res.code).toBe(200)
    expect(res.message).toEqual('ok')
    expect(res.data).toEqual({ message: 'ok' })

    server.close()
  })

  test('GET request with query', async () => {
    const server = new Server()
    const { origin: baseUrl } = await server.listen()
    const resreq = new Resreq({ baseUrl })

    server.get('/api', (ctx) => {
      ctx.body = {
        code: 200,
        message: 'ok',
        data: ctx.request.query
      }
    })

    const res: ApiResponse = await (await resreq.get('/api?message=ok')).json()

    expect(res.code).toBe(200)
    expect(res.message).toEqual('ok')
    expect(res.data).toEqual({ message: 'ok' })

    server.close()
  })

  test('GET request with params', async () => {
    const server = new Server()
    const { origin: baseUrl } = await server.listen()
    const resreq = new Resreq({ baseUrl })

    server.get('/api', (ctx) => {
      ctx.body = {
        code: 200,
        message: 'ok',
        data: ctx.request.query
      }
    })

    const res: ApiResponse = await (
      await resreq.get('/api', {
        params: {
          message: 'ok'
        }
      })
    ).json()

    expect(res.code).toBe(200)
    expect(res.message).toEqual('ok')
    expect(res.data).toEqual({ message: 'ok' })

    server.close()
  })

  test('POST request with formData', async () => {
    const server = new Server()
    const { origin: baseUrl } = await server.listen()
    const resreq = new Resreq({ baseUrl })

    server.post('/api', (ctx) => {
      ctx.body = {
        code: 200,
        message: 'ok',
        data: ctx.request.body
      }
    })

    const formData = new FormData()
    formData.append('message', 'ok')

    const res: ApiResponse = await (
      await resreq.post('/api', {
        body: formData
      })
    ).json()

    expect(res.code).toBe(200)
    expect(res.message).toEqual('ok')
    expect(res.data).toEqual({ message: 'ok' })

    server.close()
  })

  test('POST request with JSON', async () => {
    const server = new Server()
    const { origin: baseUrl } = await server.listen()
    const resreq = new Resreq({ baseUrl })

    server.post('/api', (ctx) => {
      ctx.body = {
        code: 200,
        message: 'ok',
        data: ctx.request.body
      }
    })

    const res: ApiResponse = await (
      await resreq.post('/api', {
        body: {
          message: 'ok'
        }
      })
    ).json()

    expect(res.code).toBe(200)
    expect(res.message).toEqual('ok')
    expect(res.data).toEqual({ message: 'ok' })
  })

  test('POST request with String', async () => {
    const server = new Server()
    const { origin: baseUrl } = await server.listen()
    const resreq = new Resreq({ baseUrl })

    server.post('/api', (ctx) => {
      ctx.body = {
        code: 200,
        message: 'ok',
        data: ctx.request.body
      }
    })

    const res: ApiResponse = await (
      await resreq.post('/api', {
        body: 'ok'
      })
    ).json()

    expect(res.code).toBe(200)
    expect(res.message).toEqual('ok')
    expect(res.data).toEqual('ok')
  })

  test('POST request with URLSearchParams', async () => {
    const server = new Server()
    const { origin: baseUrl } = await server.listen()
    const resreq = new Resreq({ baseUrl })

    server.post('/api', (ctx) => {
      ctx.body = {
        code: 200,
        message: 'ok',
        data: ctx.request.body
      }
    })

    const res: ApiResponse = await (
      await resreq.post('/api', {
        body: new URLSearchParams('message=ok')
      })
    ).json()

    expect(res.code).toBe(200)
    expect(res.message).toEqual('ok')
    expect(res.data).toEqual({ message: 'ok' })
  })

  test('POST request with Blob', async () => {
    const server = new Server()
    const { origin: baseUrl } = await server.listen()
    const resreq = new Resreq({ baseUrl })

    server.post('/api', (ctx) => {
      ctx.body = {
        code: 200,
        message: 'ok',
        data: ctx.request.body
      }
    })

    const res: ApiResponse = await (
      await resreq.post('/api', {
        body: new Blob([JSON.stringify({ message: 'ok' })], { type: 'application/json' })
      })
    ).json()

    expect(res.code).toBe(200)
    expect(res.message).toEqual('ok')
    expect(res.data).toEqual({ message: 'ok' })
  })

  test('POST request with ArrayBuffer', async () => {
    const server = new Server()
    const { origin: baseUrl } = await server.listen()
    const resreq = new Resreq({ baseUrl })

    server.post('/api', (ctx) => {
      ctx.body = {
        code: 200,
        message: 'ok',
        data: ctx.request.body
      }
    })

    const res: ApiResponse = await (
      await resreq.post('/api', {
        body: new Uint8Array([111, 107]),
        headers: {
          'Content-Type': 'text/plain'
        }
      })
    ).json()

    expect(res.code).toBe(200)
    expect(res.message).toEqual('ok')
    expect(res.data).toEqual('ok')
  })

  test('Put request with formData', async () => {
    const server = new Server()
    const { origin: baseUrl } = await server.listen()
    const resreq = new Resreq({ baseUrl })

    server.put('/api', (ctx) => {
      ctx.body = {
        code: 200,
        message: 'ok',
        data: ctx.request.body
      }
    })

    const formData = new FormData()
    formData.append('message', 'ok')

    const res: ApiResponse = await (
      await resreq.put('/api', {
        body: formData
      })
    ).json()

    expect(res.code).toBe(200)
    expect(res.message).toEqual('ok')
    expect(res.data).toEqual({ message: 'ok' })

    server.close()
  })

  test('Put request with json', async () => {
    const server = new Server()
    const { origin: baseUrl } = await server.listen()
    const resreq = new Resreq({ baseUrl })

    server.put('/api', (ctx) => {
      ctx.body = {
        code: 200,
        message: 'ok',
        data: ctx.request.body
      }
    })

    const res: ApiResponse = await (
      await resreq.put('/api', {
        body: {
          message: 'ok'
        }
      })
    ).json()

    expect(res.code).toBe(200)
    expect(res.message).toEqual('ok')
    expect(res.data).toEqual({ message: 'ok' })

    server.close()
  })

  test('Delete request', async () => {
    const server = new Server()
    const { origin: baseUrl } = await server.listen()
    const resreq = new Resreq({ baseUrl })

    server.delete('/api', (ctx) => {
      ctx.body = {
        code: 200,
        message: 'ok',
        data: ctx.request.query
      }
    })

    const res: ApiResponse = await (await resreq.delete('/api?message=ok')).json()

    expect(res.code).toBe(200)
    expect(res.message).toEqual('ok')
    expect(res.data).toEqual({ message: 'ok' })

    server.close()
  })

  test('Merge headers', async () => {
    const server = new Server()
    const { origin: baseUrl } = await server.listen()
    const resreq = new Resreq({
      baseUrl,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    server.get('/api', (ctx) => {
      ctx.status = 200
    })

    const res = await resreq.get('/api', {
      headers: {
        'Content-Type': 'text/plain',
        'X-Custom-Header': 'foo/bar'
      }
    })

    expect(res.headers.get('Content-Type')).toBe('text/plain')
    expect(res.headers.get('X-Custom-Header')).toBe('foo/bar')

    server.close()
  })
})
