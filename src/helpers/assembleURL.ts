/**
 * Add params to the URL
 */
const assembleURL = (url: string, params: Record<string, any>) => {
  return Object.entries(params)
    .reduce((url, [key, value]) => {
      url.searchParams.append(key, value)
      return url
    }, new URL(url))
    .toString()
}

export default assembleURL
