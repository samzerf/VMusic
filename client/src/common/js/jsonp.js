import originJsonp from 'jsonp'

export default function jsonp(url, data, option) {
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

export function createQueryString(data) {
  let paramsArr = []
  for (let k in data) {
    if (!data.hasOwnProperty(k)) {
      continue
    }
    let val = data[k] !== undefined ? data[k] : ''
    paramsArr.push(`${k}=${encodeURIComponent(val)}`)
  }
  return paramsArr.join('&')
}
