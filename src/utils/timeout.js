/**
 * Network timeout
 * References：Why the default is 2147483647 milliseconds?
 * https://github.com/denysdovhan/wtfjs/issues/61
 * https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
 *
 * @param {Function} request Request method
 * @param {Number}   timeout Timeout milliseconds
 * @param {String}   url     Request url
 * @return {Promise}         Request Pending Results
 */
export default (request, timeout, url) =>
  Promise.race([
    request,
    new Promise((_, reject) => {
      const timeoutID = setTimeout(() => {
        clearTimeout(timeoutID);
        reject(new Error(`network timeout at: ${url}`));
      }, timeout || 2147483647);
    }),
  ]);
