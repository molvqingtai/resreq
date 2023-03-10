import assembleURL from './assembleURL'
import cleanURL from './cleanURL'
import isAbsoluteURL from './isAbsoluteURL'

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * reference: https://github.com/axios/axios/blob/v1.x/lib/core/buildFullPath.js
 */
const buildFullURL = (baseURL: string = '', pathURL: string = '', params: Record<string, any> = {}) => {
  const url = cleanURL(isAbsoluteURL(pathURL) ? pathURL : `${baseURL}/${pathURL}`)
  return assembleURL(url, params)
}

export default buildFullURL
