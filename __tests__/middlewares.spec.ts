import { test, describe, expect, vi } from 'vitest'
import Server from './helpers/Server'
import Resreq from '../src'

describe('Test middleware', () => {
  test('Request success with middleware', async () => {
    const server = new Server()
    const { origin: baseUrl } = await server.listen()
    const resreq = new Resreq({ baseUrl })

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
    const { origin: baseUrl } = await server.listen()
    const resreq = new Resreq({ baseUrl })

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
    const { origin: baseUrl } = await server.listen()
    const resreq = new Resreq({ baseUrl })

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
    const { origin: baseUrl } = await server.listen()
    const resreq = new Resreq({ baseUrl })

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
