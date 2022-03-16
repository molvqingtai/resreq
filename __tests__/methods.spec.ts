import { test, describe, beforeAll, afterAll, expect } from 'vitest'
import Server from './helper/Server'
import Resreq from '../src'

interface ApiResponse {
  code: number
  message: string
  data: any
}

let resreq: Resreq
const server = new Server()

beforeAll(async () => {
  const { origin } = await server.listen()
  resreq = new Resreq({ baseUrl: origin })
})
afterAll(() => server.close())

describe('Test methods', () => {
  test('request', async () => {
    server.get('/api', (ctx) => {
      try {
        ctx.body = {
          code: 200,
          message: 'ok',
          data: ctx.request.query
        }
      } catch (error) {
        ctx.throw(500, error.message)
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
  })
  test('GET request with query', async () => {
    server.get('/api', (ctx) => {
      try {
        ctx.body = {
          code: 200,
          message: 'ok',
          data: ctx.request.query
        }
      } catch (error) {
        ctx.throw(500, error.message)
      }
    })

    const res: ApiResponse = await (await resreq.get('/api?message=ok')).json()

    expect(res.code).toBe(200)
    expect(res.message).toEqual('ok')
    expect(res.data).toEqual({ message: 'ok' })
  })
  test('GET request with params', async () => {
    server.get('/api', (ctx) => {
      try {
        ctx.body = {
          code: 200,
          message: 'ok',
          data: ctx.request.query
        }
      } catch (error) {
        ctx.throw(500, error.message)
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
  })

  test('POST request with formData', async () => {
    server.post('/api', (ctx) => {
      try {
        ctx.body = {
          code: 200,
          message: 'ok',
          data: ctx.request.body
        }
      } catch (error) {
        ctx.throw(500, error.message)
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
  })
  test('POST request with json', async () => {
    server.post('/api', (ctx) => {
      try {
        ctx.body = {
          code: 200,
          message: 'ok',
          data: ctx.request.body
        }
      } catch (error) {
        ctx.throw(500, error.message)
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
    server.put('/api', (ctx) => {
      try {
        ctx.body = {
          code: 200,
          message: 'ok',
          data: ctx.request.body
        }
      } catch (error) {
        ctx.throw(500, error.message)
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
  })

  test('Put request with json', async () => {
    server.put('/api', (ctx) => {
      try {
        ctx.body = {
          code: 200,
          message: 'ok',
          data: ctx.request.body
        }
      } catch (error) {
        ctx.throw(500, error.message)
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
  })

  test('Delete request', async () => {
    server.delete('/api', (ctx) => {
      try {
        ctx.body = {
          code: 200,
          message: 'ok',
          data: ctx.request.query
        }
      } catch (error) {
        ctx.throw(500, error.message)
      }
    })

    const res: any = await (await resreq.delete('/api?message=ok')).json()

    expect(res.code).toBe(200)
    expect(res.message).toEqual('ok')
    expect(res.data).toEqual({ message: 'ok' })
  })
})
