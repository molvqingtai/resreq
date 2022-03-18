const cleanUrl = (url: string) => url.replace(/([^:]\/)\/+/g, '$1')

export default cleanUrl
