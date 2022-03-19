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
      body instanceof ArrayBuffer ||
      ArrayBuffer?.isView(body) ||
      body instanceof URLSearchParams ||
      body instanceof ReadableStream
    )
  )
}

export default isJsonBody
