import { ON_GLOBAL_REQUEST_PROGRESS, ON_GLOBAL_RESPONSE_PROGRESS } from './consts'

const readStream = (response: Response, onResponseProgress: ProgressCallback) =>
  new ReadableStream({
    async start(controller) {
      /**
       * When http compression is used (common for big downloads)
       * The content-length is the size after the http compression
       * While the byteLength is the size after the file has been extracted.
       */
      const total = +response.headers.get('content-length')! || 0
      const reader = response.clone().body!.getReader()
      let carry = 0

      onResponseProgress(
        {
          ratio: 0, // Current Transfer Ratio
          carry: 0, // Current Transfer Byte Size
          total: 0 // Total size of transmitted bytes
        },
        new Uint8Array() // The chunk argument is an instance of Uint8Array.
      )
      const read = async () => {
        const { done, value } = await reader.read()
        if (done) return controller.close()

        carry += value!.byteLength

        onResponseProgress(
          {
            ratio: (carry / total) * 100,
            carry,
            total
          },
          value!
        )
        controller.enqueue(value)
        await read()
      }
      await read()
    }
  })

export interface ResInit extends ResponseInit, ExtendInit {
  [ON_GLOBAL_REQUEST_PROGRESS]?: ProgressCallback
  [ON_GLOBAL_RESPONSE_PROGRESS]?: ProgressCallback
}

export default class Res extends Response {
  baseUrl?: string
  params?: Record<string, any>
  meta?: Record<string, any>
  timeout?: number
  throwHttpErrors?: boolean
  onRequestProgress?: ProgressCallback
  onResponseProgress?: ProgressCallback;
  readonly [ON_GLOBAL_REQUEST_PROGRESS]?: ProgressCallback;
  readonly [ON_GLOBAL_RESPONSE_PROGRESS]?: ProgressCallback
  constructor(response: Response, init?: ResInit) {
    const _response = response.clone()
    super(response.body, {
      status: init?.status ?? response.status,
      statusText: init?.statusText ?? response.statusText,
      headers: init?.headers ?? response.headers
    })
    this.params = init?.params
    this.meta = init?.meta
    this.timeout = init?.timeout
    this.throwHttpErrors = init?.throwHttpErrors
    this.onRequestProgress = init?.onRequestProgress
    this.onResponseProgress = init?.onResponseProgress
    this[ON_GLOBAL_REQUEST_PROGRESS] = init?.[ON_GLOBAL_REQUEST_PROGRESS]
    this[ON_GLOBAL_RESPONSE_PROGRESS] = init?.[ON_GLOBAL_RESPONSE_PROGRESS]
    readStream(_response, (...args) => {
      this.onResponseProgress?.(...args)
      this[ON_GLOBAL_RESPONSE_PROGRESS]?.(...args)
    })
  }
}
