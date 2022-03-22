![logo](https://github.com/molvqingtai/resreq/blob/develop/logo.svg | width=300)



# Resreq

> Fetch-based onion model http client.



## What is resreq?

It is a modern http client, based on fetch, because it is implemented internally using the onion model, so you can use middleware to intercept requests and responses elegantly.



## Install

Resreq targets modern browsers and [Deno](https://github.com/denoland/deno)

```shell
npm install resreq
```



If you use it in [node](https://nodejs.org/en/), you need to add some polyfill

```typescript
import fetch, { Headers, Request, Response } from 'node-fetch'
import AbortController from 'abort-controller'

globalThis.fetch = fetch
globalThis.Headers = Headers
globalThis.Request = Request
globalThis.Response = Response
globalThis.AbortController = AbortController
```





## Documentation



### Get Started

```typescript
import Resreq from 'resreq'

const resreq = new Resreq({
  baseUrl: 'https://example.com'
})

const res = await resreq.request({
  url: '/api',
  method: 'GET',
  params: { foo: 'bar' }
})

console.log(res.json())
```



**Use Methods**

```typescript
const resreq = new Resreq()

// Get request
const res = await resreq.get('https://example.com/api', {
  params: { foo: 'bar' }
})

console.log(res.json())

// Post request
const res = await resreq.post('https://example.com/api', {
  body: { foo: 'bar' }
})

console.log(res.json())

// Cancel request
const abortController = new AbortController()
const res = await resreq.get({
  url: '/api',
  signal: abortController.signal
}).catch(error){
  console.log(error) // request abort
}

abortController.abort()
console.log(res.json())
```



**Use Middlewares**

```typescript
const resreq = new Resreq({
  baseUrl: 'https://example.com'
})

// Intercepting responses and requests using middleware
resreq.use((next) => async (req) => {
  try {
    console.log(req) // Request can be changed here
    const res = await next(req)
    console.log(res) // Response can be changed here
    return res
  } catch (error) {
    console.log(error) // Catch errors here
    throw error
  }
})

const res = await resreq.get('/api', {
  params: { foo: 'bar' }
})

console.log(res.json())
```



### API

**new Resreq(options?:Options)**

Create a resreq instance and configure the global options

```typescript
const resreq = new Resreq({
  baseUrl: 'https://example.com',
  timeout: 10000,
  throwHttpError: true,
  onResponseProgress:(progress: Progress, chunk: Uint8Array){
    console.log(progress,chunk)
  }
})
```



**resreq.request(options?:Options)**

Use ''request'' to send the request and configure the options

```typescript
const resreq = new Resreq({
  baseUrl: 'https://example.com'
})

const res = await resreq.request({
  url: '/api',
  method: 'GET',
  params: { foo: 'bar' },
  throwHttpError: true,
  onResponseProgress:(progress: Progress, chunk: Uint8Array){
    console.log(progress,chunk)
  }
})

console.log(res.json())
```



**resreq\[method\](options?:Options)**

Use ''method'' to send the request and configure the options

```typescript
const resreq = new Resreq({
  baseUrl: 'https://example.com'
})

const res = await resreq.get('/api',{
  params: { foo: 'bar' },
  throwHttpError: true,
  onResponseProgress:(progress: Progress, chunk: Uint8Array){
 	  console.log(progress,chunk)
  }
})

console.log(res.json())
```



**resreq.use(middleware:Middleware)**

Rewriting request headers using middleware

```typescript
const resreq = new Resreq({
  baseUrl: 'https://example.com'
})

resreq.use((next) => async (req) => {
  // Create a new request with Req
  const _req = new Req(req, {
    headers: {
      'X-Custom-Header': 'bar'
    }
  })
  return await next(_req)
})

const res = await resreq.get('/api', {
  headers: {
    'X-Custom-Header': 'foo'
  }
})

console.log(res.headers.get('X-Custom-Header')) // bar
```



**Req(req:Req, init?:ReqInit) & Res(res:Res, init?:ResInit)**

In the middleware, use `new Req()` and `new Res()` to rewrite the request and response

```typescript
import { Middleware, Req, Res } from './index'

const middleware: Middleware = (next) => async (req) => {
  const _req = new Req(req, {
    url: 'http://localhost:3000/mock/api'
  })
  const res = await next(_req)
  return new Res(res, {
    status: 200,
    statusText: 'mock success'
  })
}
```

Note: Req & Res inherits from [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request) and [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response); to create a new request and response in the middleware, use Req & Res



### Interfaces

**Options**

Options extends from the [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request) type with some additional properties

```typescript
interface Options extends Omit<RequestInit, 'body'> {
  baseUrl?: string
  url?: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'PATCH'
  params?: Record<string, any>
  body?: BodyInit | Record<string, any>
  meta?: Record<string, any>
  timeout?: number
  throwHttpError?: boolean
  onResponseProgress?: ProgressCallback
}
```

* **baseUrl**: The url prefix of the request will be concatenated with the url in `resreq[method]()` to form a complete request address, the default value is ' '
* **url**: Request url, the default value is ' '
* **method**：Request method, the default value is 'GET'
* **params**: The params of a `resreq.get` request are automatically added to the url via the [new URLSearchParams](https://developer.mozilla.org/zh-CN/docs/Web/API/URLSearchParams) method
* **body**: Based on [BodyInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request), and adding `Record<string, any>`, which means you can pass `object` directly, instead of `JSON.stringify(object)`, which will automatically add `Content-Type: application/json` request headers
* **meta**: The extra information that needs to be carried in the request is not really sent to the server, but it can be obtained in the `res.meta`
* **throwHttpError**: If true, a status code outside of 200-299 will throw an error, the default value is false
* **onResponseProgress**: The download progress hook, which depends on the [ReadableStream API](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream), does not currently work in node



To avoid adding complexity, `new Resreq(options)` and `resreq[method](options)`, in which 'options' are of the same type

The options defined in `new Resreq(options)` will take effect globally, `resreq[method](options)`, will override the "global options", except for the following options which will not be overridden

* **headers**: The headers defined in the method are merged into the global headers

* **onResponseProgress**: Defining onResponseProgress in a method and the global onResponseProgress are both retained.

  

**ReqInit**

Options extends from the [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request) type with some additional properties

```typescript
interface ReqInit extends Omit<RequestInit, 'body'> {
  url?: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'PATCH'
  meta?: Record<string, any>
  timeout?: number
  throwHttpError?: boolean
  body?: BodyInit | Record<string, any>
  onResponseProgress?: ProgressCallback
}
```

Note that its 'headers' behave differently than 'Options.headers', which overrides the global headers



**ResInit**

ResInit extends from the [ResponseInit](https://developer.mozilla.org/en-US/docs/Web/API/Response/Response) type with some additional properties

```typescript
interface ResInit extends ResponseInit {
  meta?: Record<string, any>
  timeout?: number
  throwHttpError?: boolean
  onResponseProgress?: ProgressCallback
}
```



**Middleware**

The middleware must call next(req) to return a promise

```typescript
type Middleware = (next: Next) => (req: Req) => Promise<Res>
```







