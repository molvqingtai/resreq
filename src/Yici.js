import { compose, typeOf, normalizeUrl, timeout, formatMethod, transformParams, transformBody } from './utils/index.js'

export const CancelToken = () => {}

export default class Yici {
  constructor(options = {}) {
    this.options = options
    this.middleware = []
    this.baseURL = options.baseURL || ''
    this.fetch = options.fetch || fetch.bind(globalThis)
    this.timeout = options.timeout || 0
    this.retry = false
    this.limit = 1
    this.ResponseType = options.ResponseType || 'json'
    this.onResponseProgress = options.onResponseProgress
  }

  use(...args) {
    this.middleware = [...this.middleware, ...args]
    return this
  }

  adapter(request) {
    return timeout(this.fetch(request), this.timeout, request.url)
  }

  response(pending) {
    return (onResponseProgress) =>
      pending.then(async (response) => {
        // Read-only attributes cannot use spread operators
        const { headers, redirected, status, statusText, type, url, ok, body } = response
        const total = +headers.get('content-length') || 0
        if (!ok) throw new Error(response.statusText)

        const data = await new Response(
          new ReadableStream({
            start(controller) {
              let being = 0
              let timing = 0
              const reader = body.getReader()
              // Initial progress
              onResponseProgress(
                {
                  ratio: 0, // Current Transfer Ratio
                  being: 0, // Current Transfer Byte Size
                  total: 0, // Total size of transmitted bytes
                  speed: 0 // Current transmission speed per second
                },
                new Uint8Array() // The chunk argument is an instance of Uint8Array.
              )
              const pipe = async () => {
                const startTime = +new Date()
                const { done, value } = await reader.read()
                const endTime = +new Date()

                if (done) return controller.close()
                controller.enqueue(value)

                being += value.byteLength
                timing = timing + (endTime - startTime) / 1000
                onResponseProgress(
                  {
                    ratio: being / total,
                    being,
                    total,
                    speed: being / timing
                  },
                  value
                )
                return pipe()
              }
              return pipe()
            }
          })
        )[this.ResponseType]()

        return {
          headers,
          redirected,
          status,
          statusText,
          type,
          url,
          data
        }
      })
  }

  request({ url, data, method, ...options }) {
    console.log(url, data, method, options)
    url = normalizeUrl(this.baseURL + url)
    options = { ...this.options, ...options, method }
    method = formatMethod(method)
    // TODO Fix Content-Type
    if (method === 'GET' && typeOf(data) === 'Object') url = transformParams(data)
    if (method === 'POST' && typeOf(data) === 'Object') options = { ...options, body: transformBody(data) }

    const request = new Request(url, options)
    const dispatch = compose(this.middleware)
    return this.response(dispatch(this.adapter.bind(this))(request))(options.onResponseProgress)
  }

  get(url, options = {}) {
    return this.request({ ...options, url, method: 'GET' })
  }

  post(url, options = {}) {
    return this.request({ ...options, url, method: 'POST' })
  }
}
