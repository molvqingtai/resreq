import fetch, { Headers, Request, Response } from 'node-fetch'
import AbortController from 'abort-controller'
import { FormData, Blob } from 'formdata-node'

// @ts-expect-error
globalThis.AbortController = AbortController
// @ts-expect-error
globalThis.fetch = fetch
globalThis.Headers = Headers
// @ts-expect-error
globalThis.Request = Request
// @ts-expect-error
globalThis.Response = Response
// @ts-expect-error
globalThis.FormData = FormData
// @ts-expect-error
globalThis.Blob = Blob
