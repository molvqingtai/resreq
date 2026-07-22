import { test, describe, expect, vi } from 'vitest'
import Server from './helpers/Server'
import Resreq, { HTTPError } from '../src'
import sleep from './helpers/sleep'

describe('Test errors', () => {
  test('Http error with 500', async () => {
    const server = new Server()
    const { origin: baseURL } = await server.listen()
    const resreq = new Resreq({ baseURL, throwHttpError: true })

    server.get('/api', (ctx) => {
      ctx.status = 500
    })

    await expect(resreq.get('/api')).rejects.toThrowError(/500/)

    server.close()
  })

  test('Http error with 404', async () => {
    const server = new Server()
    const { origin: baseURL } = await server.listen()
    const resreq = new Resreq({ baseURL, throwHttpError: true })

    await expect(resreq.get('/404')).rejects.toThrowError(/404/)

    server.close()
  })

  test('Http error preserves the response when statusText is empty', async () => {
    const body = { error: 'Invalid request' }
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify(body), { status: 400 }))

    try {
      const resreq = new Resreq({ throwHttpError: true })
      const error = await resreq.get('https://example.com/api').catch((error: unknown) => error)

      expect(error).toBeInstanceOf(HTTPError)
      if (!(error instanceof HTTPError)) throw error
      expect(error.response.status).toBe(400)
      expect(error.response.statusText).toBe('')
      await expect(error.response.json()).resolves.toEqual(body)
    } finally {
      fetchMock.mockRestore()
    }
  })

  test('Http error with connect', async () => {
    const server = new Server()
    const { origin: baseURL } = await server.listen()
    const resreq = new Resreq({ baseURL })
    await expect(resreq.get('/', { baseURL: 'https://localhost' })).rejects.toThrowError(/fetch failed/)

    server.close()
  })

  test('Fetch error with url', async () => {
    const server = new Server()
    const { origin: baseURL } = await server.listen()
    const resreq = new Resreq({ baseURL })

    await expect(resreq.get('/', { baseURL: '/http' })).rejects.toThrowError(/Invalid URL/)

    server.close()
  })

  test('Fetch error with body', async () => {
    const server = new Server()
    const { origin: baseURL } = await server.listen()
    const resreq = new Resreq({ baseURL })

    await expect(resreq.get('/', { body: {} })).rejects.toThrowError(/cannot have body/)

    server.close()
  })

  test('Http error with cancel', async () => {
    const server = new Server()
    const { origin: baseURL } = await server.listen()
    const resreq = new Resreq({ baseURL })

    server.get('/api', async (ctx) => {
      ctx.status = 200
    })

    const abortController = new AbortController()
    const res = resreq.request({
      url: '/api',
      signal: abortController.signal
    })
    abortController.abort()
    await expect(res).rejects.toThrowError(/abort/)

    server.close()
  })

  test('Http error with timeout', async () => {
    const server = new Server()
    const { origin: baseURL } = await server.listen()
    const resreq = new Resreq({ baseURL, timeout: 300 })

    server.get('/api', async (ctx) => {
      await sleep(500)
      ctx.status = 200
    })

    const res = resreq.request({
      url: '/api'
    })

    await expect(res).rejects.toThrowError(/timeout/)

    server.close()
  })

  test('Http error with responseType', async () => {
    const server = new Server()
    const { origin: baseURL } = await server.listen()
    const resreq = new Resreq({ baseURL, responseType: 'json' })

    server.get('/api', async (ctx) => {
      ctx.body = 'foobar'
    })

    const res = resreq.request({
      url: '/api'
    })
    await expect(res).rejects.toThrowError(/JSON/)

    server.close()
  })
})
