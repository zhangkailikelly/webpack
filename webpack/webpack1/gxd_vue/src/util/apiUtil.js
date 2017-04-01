/**
 * 取得 URL 地址上的 token & host（从四叶草APP）
 * 或 corpid & code (从微信)
 */

// import Vue from 'vue'
import $ from 'zepto'

// 获取 URL 地址所有参数
function QueryString () {
  var query_string = {}
  var query = window.location.search.substring(1)
  var vars = query.split('&')
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    if (typeof query_string[pair[0]] === 'undefined') {
      query_string[pair[0]] = decodeURIComponent(pair[1])
    }
    else if (typeof query_string[pair[0]] === 'string') {
      var arr = [query_string[pair[0]], decodeURIComponent(pair[1])]
      query_string[pair[0]] = arr
    }
    else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]))
    }
  }
  return query_string
}

function getUrlparams () {

  var queryString = QueryString()

  var host = queryString.host
  var token = queryString.token
  var corpid = queryString.corpid
  var code = queryString.code

  var api = {
    host: host,
    token: token,
    success: true
  }

  console.log(corpid)
  console.log(code)
  if (host && token) {
    return api
  }
  else if (code && corpid) {
    $.get('/qyapi/who?corpid=' + corpid + '&code=' + code + '&noCache=' + (new Date().getTime()), function (data) {
      console.log(data)
      api = data
      api.success = true
      return api
    })
    //   ).then((res) => {
    //   if (res && res.data && res.data.token) {
    //     api = res.data
    //   }
    //   else {
    //     $.alert('获得授权失败，请联系管理员。')
    //     api.success = false
    //   }
    // }).then(() => {
    //   $.alert('连接认证服务器失败，请重试。')
    //   api.success = false
    // })
  }
  else {
    $.alert('非法请求，请联系管理员。')
    api.success = false
    return api
  }
}

export default getUrlparams()
