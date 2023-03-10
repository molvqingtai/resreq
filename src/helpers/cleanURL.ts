const cleanURL = (url: string) => url.replace(/([^:]\/)\/+/g, '$1').replace(/\/+$/, '')

export default cleanURL
