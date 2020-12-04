/**
 * Remove extra slashes in url
 * @param {String} url Input url
 * @return {String}    Output url
 */
export default (url) => url.replace(/([^:]\/)\/+/g, "$1");
