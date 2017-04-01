export default {
  // 将字符串生成hash码
  getHashCode (str) {
    // let hash = 0
    // if (str.length === 0) {
    //   return hash
    // }
    // for (let i = 0; i < str.length; i++) {
    //   let char = str.charCodeAt(i)
    //   hash = ((hash << 5) - hash) + char
    //   hash = hash & hash // Convert to 32bit integer
    // }
    // return hash
    let hash = 5381
    let i = str.length

    while (i) {
      hash = (hash * 33) ^ str.charCodeAt(--i)
    }
    /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
     * integers. Since we want the results to be always positive, convert the
     * signed int to an unsigned by doing an unsigned bitshift. */
    return hash >>> 0
  },
  // 将字符串和对象合并成一个字符串，并进行hash转码
  getObjectHashCode (str, obj) {
    let str1 = str + Object.keys(obj).concat(Object.values(obj)).join('')
    return this.getHashCode(str1)
  }
}
