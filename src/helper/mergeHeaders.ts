import mergeObject from './mergeObject'
const mergeHeaders = (target: HeadersInit, source: HeadersInit) => {
  const targetHeaders = Object.fromEntries(new Headers(target).entries())
  const sourceHeaders = Object.fromEntries(new Headers(source).entries())
  return new Headers(mergeObject(targetHeaders, sourceHeaders))
}

export default mergeHeaders
