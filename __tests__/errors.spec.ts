import { test, describe, beforeAll, afterAll, expect } from 'vitest'
import Server from './helper/Server'
import Resreq from '../src'

let resreq: Resreq
const server = new Server()

beforeAll(async () => {
  const { origin } = await server.listen()
  resreq = new Resreq({ baseUrl: origin, throwHttpErrors: true })
})
afterAll(() => server.close())

describe('Test errors', () => {
  test('Http error', async () => {
    server.get('/api', (ctx) => {
      ctx.status = 500
    })

    await expect(resreq.get('/api')).rejects.toThrowError(/500/)
  })
})
