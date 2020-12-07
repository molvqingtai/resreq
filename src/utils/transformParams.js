export default (params) => '?' + new URLSearchParams(params).toString()
