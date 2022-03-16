// import 'web-streams-polyfill/dist/polyfill.min.js'
import { test, describe, beforeAll, afterEach, afterAll, expect } from 'vitest'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import Resreq from '../src'

interface ApiResponse {
  status: number
  message: string
  data: any
}

const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Test methods', () => {
  const resreq = new Resreq({
    baseUrl: 'http://localhost/'
  })

  test('GET request', async () => {
    server.use(
      rest.get('http://localhost/api', (req, res, ctx) => {
        return res(
          ctx.json({
            status: 200,
            message: req.url.searchParams.get('message')
          })
        )
      })
    )
    try {
      const res: ApiResponse = await (await resreq.get('/api/?message=ok')).json()

      expect(res.status).toBe(200)
      expect(res.message).toEqual('ok')
    } catch (error) {
      console.log('---', error)
    }
  })

  test('POST request', async () => {
    server.use(
      rest.post('http://localhost/api', (req, res, ctx) => {
        return res(
          ctx.json({
            status: 200,
            message: (req.body as any).message
          })
        )
      })
    )
    const formData = new FormData()
    formData.append('message', 'ok')
    const res: ApiResponse = await (
      await resreq.post('/api', {
        body: formData
      })
    ).json()

    expect(res.status).toBe(200)
    expect(res.message).toEqual('ok')
  })
})
