const isJsonBody = (body: Body | BodyInit | Record<string, any>) => {
  /**
   * Judging the type supported by BodyInit
   * Types not supported by node, first determine if they exist
   */

  return (
    body &&
    typeof body === 'object' &&
    !(
      (globalThis.FormData && body instanceof FormData) ||
      (globalThis.Blob && body instanceof Blob) ||
      (globalThis.File && body instanceof File) ||
      (globalThis.ArrayBuffer && body instanceof ArrayBuffer) ||
      (globalThis.ArrayBuffer && ArrayBuffer.isView(body)) ||
      (globalThis.URLSearchParams && body instanceof URLSearchParams) ||
      (globalThis.ReadableStream && body instanceof ReadableStream)
    )
  )
}

export default isJsonBody
