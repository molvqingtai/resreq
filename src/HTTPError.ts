import type Res from './Res'

export default class HTTPError extends Error {
  readonly response: Res

  constructor(response: Res) {
    super(`${response.status} ${response.statusText}`)
    this.name = 'HTTPError'
    this.response = response
  }
}
