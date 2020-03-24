function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle(arr) {
  arr = arr.slice(0)
  for (let i = 0, len = arr.length; i < len; i++) {
    let j = getRandomInt(0, i)
    let t = arr[j]
    arr[j] = arr[i]
    arr[i] = t
  }
  return arr
}

export function debounce(func, delay) {
  let timer = null
  return function(...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
