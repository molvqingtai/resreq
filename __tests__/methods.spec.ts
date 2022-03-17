import { test, describe, expect } from 'vitest'
import Server from './helper/Server'
import Resreq from '../src'

interface ApiResponse {
  code: number
  message: string
  data: any
}

describe('Test methods', () => {
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
        method: 'get',
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

    const res: any = await (
      await resreq.post('/api', {
        body: formData
      })
    ).json()

    expect(res.code).toBe(200)
    expect(res.message).toEqual('ok')
    expect(res.data).toEqual({ message: 'ok' })

    server.close()
  })

  test('POST request with json', async () => {
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

    const res: any = await (
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

    const res: any = await (
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

    const res: any = await (
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

    const res: any = await (await resreq.delete('/api?message=ok')).json()

    expect(res.code).toBe(200)
    expect(res.message).toEqual('ok')
    expect(res.data).toEqual({ message: 'ok' })

    server.close()
  })
})
