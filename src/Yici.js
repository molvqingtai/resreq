import { compose, typeOf, normalizeUrl, timeout, formatMethod, transformParams, transformBody } from './utils/index.js'

export const CancelToken = () => {}

export default class Yici {
  constructor(options = {}) {
    this.options = options
    this.middleware = []
    this.baseURL = options.baseURL || ''
    this.fetch = options.fetch || window.fetch
    this.timeout = options.timeout || 0
    this.retry = false
    this.limit = 1
    this.ResponseType = options.ResponseType || 'json'
    this.methods = ['GET', 'PUT', 'HEAD', 'DELETE', 'OPTIONS', 'PATCH']
  }

  use(...args) {
    this.middleware = [...this.middleware, ...args]
    return this
  }

  async adapter(request) {
    const response = await timeout(window.fetch(request), this.timeout, request.url)

    if (!response.ok) throw new Error(response.statusText)
    return { ...response, data: response[this.ResponseType]() }
  }

  request({ url, data, method, ...options }) {
    console.log(url, data, method, options)

    url = normalizeUrl(this.baseURL + url)
    options = { ...this.options, ...options, method }
    method = formatMethod(method)

    if (method === 'GET' && typeOf(data) === 'Object') url = transformParams(data)
    if (method === 'POST' && typeOf(data) === 'Object') options = { ...options, body: transformBody(data) }
    const request = new Request(url, options)

    const dispatch = compose(this.middleware)
    return dispatch(this.adapter.bind(this))(request)
  }

  get(url, data, options = {}) {
    return this.request({ ...options, url, data, method: 'GET' })
  }

  post(url, data, options = {}) {
    return this.request({ ...options, url, data, method: 'POST' })
  }
}
