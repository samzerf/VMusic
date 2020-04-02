import originJsonp from 'jsonp'

export default function jsonp (url, data, option) {
  url += (~url.indexOf('?') ? '&' : '?') + createQueryString(data)
  return new Promise((resolve, reject) => {
    originJsonp(url, option, (e, data) => {
      if (e) {
        reject(e)
      } else {
        resolve(data)
      }
    })
  })
}

export function createQueryString (data) {
  const paramsArr = []
  for (const k in data) {
    const val = data[k] !== undefined ? data[k] : ''
    paramsArr.push(`${k}=${encodeURIComponent(val)}`)
  }
  return paramsArr.join('&')
}
