import { test, describe, beforeAll, afterAll, expect } from 'vitest'
import Server from './helper/Server'
import Resreq from '../src'

interface ApiResponse {
  code: number
  message: string
  data: any
}

const server = new Server({
  host: 'http://localhost',
  port: 3000
})

beforeAll(async () => {
  await server.listen()
})
afterAll(() => server.close())

describe('Test methods', () => {
  const resreq = new Resreq({
    baseUrl: 'http://localhost:3000'
  })

  test('GET request', async () => {
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

  test('POST request', async () => {
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

  test('POST request', async () => {
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

  test('POST request', async () => {
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

    const formData = new FormData()
    formData.append('message', 'ok')

    const res: any = await (await resreq.delete('/api?message=ok')).json()

    expect(res.code).toBe(200)
    expect(res.message).toEqual('ok')
    expect(res.data).toEqual({ message: 'ok' })
  })
})
