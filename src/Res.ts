import { ON_GLOBAL_REQUEST, ON_GLOBAL_RESPONSE } from './consts'

const readStream = (response: Response, onResponse: ProgressCallback) =>
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

      onResponse(
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

        onResponse(
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

export interface ResInit extends ResponseInit {
  meta?: Record<string, any>
  timeout?: number
  onRequest?: ProgressCallback
  onResponse?: ProgressCallback
  [ON_GLOBAL_REQUEST]?: ProgressCallback
  [ON_GLOBAL_RESPONSE]?: ProgressCallback
}

export default class Res extends Response {
  meta?: Record<string, any>
  timeout?: number
  onRequest?: ProgressCallback
  onResponse?: ProgressCallback;
  readonly [ON_GLOBAL_REQUEST]?: ProgressCallback;
  readonly [ON_GLOBAL_RESPONSE]?: ProgressCallback
  constructor(response: Response | Res, init?: ResInit) {
    const _response = response.clone()
    super(response.body, {
      status: init?.status ?? response.status,
      statusText: init?.statusText ?? response.statusText,
      headers: init?.headers ?? response.headers
    })
    this.meta = init?.meta ?? (response as Res).meta
    this.timeout = init?.timeout ?? (response as Res).timeout
    this.onRequest = init?.onRequest ?? (response as Res).onRequest
    this.onResponse = init?.onResponse ?? (response as Res).onResponse
    this[ON_GLOBAL_REQUEST] = init?.[ON_GLOBAL_REQUEST] ?? (response as Res)[ON_GLOBAL_REQUEST]
    this[ON_GLOBAL_RESPONSE] = init?.[ON_GLOBAL_RESPONSE] ?? (response as Res)[ON_GLOBAL_RESPONSE]
    readStream(_response, (...args) => {
      this.onResponse?.(...args)
      this[ON_GLOBAL_RESPONSE]?.(...args)
    })
  }
}
