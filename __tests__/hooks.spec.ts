import { test, describe, expect, vi } from 'vitest'
import Server from './helpers/Server'
import Resreq from '../src'
import sleep from './helpers/sleep'

describe('Test hooks', () => {
  test('Use global onResponseProgress hook', async () => {
    const server = new Server()
    const { origin: baseUrl } = await server.listen()
    const progressInfo: any[][] = []
    server.get('/api', async (ctx) => {
      ctx.res.writeHead(200, { 'content-length': 6 })
      ctx.res.write('foo')
      await sleep(1000)
      ctx.res.end('bar')
    })
    const resreq = new Resreq({
      baseUrl,
      responseType: 'text',
      onResponseProgress(progress, chunk) {
        progressInfo.push([progress, new TextDecoder().decode(chunk)])
      }
    })

    const res = await resreq.request({ url: '/api' })

    expect(progressInfo).toEqual([
      [{ ratio: 0, carry: 0, total: 0 }, ''],
      [{ ratio: 50, carry: 3, total: 6 }, 'foo'],
      [{ ratio: 100, carry: 6, total: 6 }, 'bar']
    ])
    expect(res).toBe('foobar')

    server.close()
  })

  test('Use local onResponseProgress hook', async () => {
    const server = new Server()
    const { origin: baseUrl } = await server.listen()
    const progressInfo: any[][] = []
    server.get('/api', async (ctx) => {
      ctx.res.writeHead(200, { 'content-length': 6 })
      ctx.res.write('foo')
      await sleep(1000)
      ctx.res.end('bar')
    })
    const resreq = new Resreq({
      baseUrl,
      responseType: 'text'
    })

    const res = await resreq.request({
      url: '/api',
      onResponseProgress(progress, chunk) {
        progressInfo.push([progress, new TextDecoder().decode(chunk)])
      }
    })

    expect(progressInfo).toEqual([
      [{ ratio: 0, carry: 0, total: 0 }, ''],
      [{ ratio: 50, carry: 3, total: 6 }, 'foo'],
      [{ ratio: 100, carry: 6, total: 6 }, 'bar']
    ])
    expect(res).toBe('foobar')

    server.close()
  })

  test('Hooks standalone callbacks', async () => {
    const server = new Server()
    const { origin: baseUrl } = await server.listen()

    const globalProgressCallback = vi.fn()
    const localProgressCallback = vi.fn()

    server.get('/api', async (ctx) => {
      ctx.res.writeHead(200, { 'content-length': 6 })
      ctx.res.write('foobar')
    })

    const resreq = new Resreq({
      baseUrl,
      responseType: 'text',
      onResponseProgress: () => globalProgressCallback()
    })

    await resreq.request({
      url: '/api',
      onResponseProgress: () => localProgressCallback()
    })

    expect(globalProgressCallback).toBeCalledTimes(2)
    expect(localProgressCallback).toBeCalledTimes(2)

    server.close()
  })
})
