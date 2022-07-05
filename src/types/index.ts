import type { ON_GLOBAL_RESPONSE_PROGRESS, ABORT_CONTROLLER } from '../constants'
import type Req from '../Req'
import type Res from '../Res'

export interface ResInit extends ResponseInit {
  meta?: Record<string, any>
  timeout: number
  throwHttpError: boolean
  [ABORT_CONTROLLER]: AbortController
  onResponseProgress?: ProgressCallback
  [ON_GLOBAL_RESPONSE_PROGRESS]?: ProgressCallback
}

export interface ReqInit extends Omit<RequestInit, 'body'> {
  url?: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'PATCH'
  meta?: Record<string, any>
  timeout?: number
  throwHttpError?: boolean
  body?: BodyInit | Record<string, any>
  onResponseProgress?: ProgressCallback
  [ON_GLOBAL_RESPONSE_PROGRESS]?: ProgressCallback
}

export type Next = (req: Req) => Promise<Res>
export type Middleware = (next: Next) => (req: Req) => Promise<Res>

export interface Progress {
  ratio: number // Current Transfer Ratio
  carry: number // Current Transfer Byte Size
  total: number // Total size of transmitted bytes
}

export type ProgressCallback = (progress: Progress, chunk: Uint8Array) => void

export interface Options extends ReqInit {
  baseUrl?: string
  params?: Record<string, any>
}
