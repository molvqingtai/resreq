/**
 * Merge Headers
 * @param target target.headers
 * @param source source.headers
 * @returns headers
 */
const mergeHeaders = (target: HeadersInit | Headers, source: HeadersInit | Headers) => {
  const targetHeaders = Object.fromEntries(new Headers(target).entries())
  const sourceHeaders = Object.fromEntries(new Headers(source).entries())
  return new Headers({ ...targetHeaders, ...sourceHeaders })
}

export default mergeHeaders
