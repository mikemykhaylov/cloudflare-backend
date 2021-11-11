const headers = new Headers()
headers.set('Access-Control-Allow-Origin', '*')
headers.set('content-type', 'application/json;charset=UTF-8')
export default Object.fromEntries(headers)
