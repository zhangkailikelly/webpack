// 将指定的值缓存到sessionStorage中
import stringUtil from './stringUtil'
export default {
  set (url, val) {
    let key = stringUtil.getHashCode(url)
    let value = JSON.stringify(val)
    window.sessionStorage.setItem(key, value)
  },
  get (url) {
    let key = stringUtil.getHashCode(url)
    let value = window.sessionStorage.getItem(key)
    try {
      value = JSON.parse(value)
    }
    catch (e) {
      console.log(e)
    }
    return value
  }
}
