/**
 * Created by towersxu on 16/5/6.
 * 获取用户认证信息
 */
import Vue from 'vue'
import Store from '../assets/js/store.js/src/store.js'
let QueryString
export default {
  // 使用promise
  getToken () {
    var expireTime = 5 * 24 * 3600 * 1000 // 过期时间暂时设置为5天
    return new Promise((resolve, reject)=> {
      QueryString = getUrlToken()
      if (QueryString.token) {  // 如果有token,则该token存在url中或者微信获取后保存的
        // 判断是从校信来的, 存入缓存
        Store.set('appFrom', 'xiaoxin', expireTime) // jinzk
        window.sessionStorage.setItem('querystring', JSON.stringify(QueryString))
        resolve(QueryString)
      }
      else if (QueryString.corpid && QueryString.code) {  // 从微信中获取
        Store.set('appFrom', 'weixin', expireTime) // jinzk
        Vue.http.get('/qyapi/who?' + 'corpid=' + QueryString.corpid + '&code=' + QueryString.code + '&noCache=' + (new Date().getTime())).then((res) => {
          if (res && res.data && res.data.token && res.data.apiServer) {
            res.data.host = res.data.apiServer
            QueryString = res.data
            window.sessionStorage.setItem('querystring', QueryString)
            resolve(res.data)
          }
          else {
            reject({
              message: '你未获得授权，请联系管理员'
            })
          }
        }, (res) => {
          reject({
            message: '连接认证服务器失败，请稍后重试'
          })
        })
      }
      else {   // 如果URL上没有参数，从sessionStorage取初次进入app的参数。如果也没有，则表示是第一次进入app就没有带必要的参数
        let querystring = window.sessionStorage.getItem('querystring')
        try {
          querystring = JSON.parse(querystring)
          if (querystring && querystring.token) {
            resolve(querystring)
          }
          else {
            reject({
              message: '访问地址缺少必要参数'
            })
          }
        }
        catch (e) {
          reject({
            message: '访问地址缺少必要参数'
          })
        }
      }
    })
  },
  getUrlToken
}
/**
 * 将URL中的参数变成对象,存储在QueryString中,如果有token,则将token返回
 * @returns {*}
 */
function getUrlToken () {
  let QueryString = {}
  let search = window.location.search
  if (search) {
    search = search.substring(1)
    let a = search.split('&')
    for (let i = 0; i < a.length; i++) {
      var as = a[i].split('=')
      if (as.length > 1) {
        QueryString[as[0]] = as[1]
      }
    }
  }
  return QueryString
}
