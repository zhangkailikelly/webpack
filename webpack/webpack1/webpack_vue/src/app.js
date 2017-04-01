import Vue from 'vue'
import $ from 'zepto'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VueTouch from 'vue-touch'
import pullToRefresh from './directives/pullToRefresh'
import infiniteScroll from './directives/infiniteScroll'
import photoSwipe from './directives/photoSwipe'
import routerConfig from './router'
import * as filters from './filters'
import tokenUtil from './util/tokenUtil'
import app from './main'
import Store from './assets/js/store.js/src/store.js'
// import VideoPlayer from 'vue-video-player' // 视频播放

Vue.directive('pullToRefresh', pullToRefresh)
Vue.directive('infiniteScroll', infiniteScroll)
Vue.directive('photoSwipe', photoSwipe)
// Router
Vue.use(VueRouter)
// Vue.use(VideoPlayer)
// filter
Vue.filter('date', filters.dateFilter)
// 判断IOS还是Android
var u = navigator.userAgent
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端

Store.set('isAndroid', isAndroid)
Store.set('isiOS', isiOS)

const router = new VueRouter({
  mode: 'hash',
  hashbang: true,
  // history: true,
  saveScrollPosition: true,
  suppressTransitionError: true,
  root: '/district_jysq/'
})
routerConfig(router)
// Resource
Vue.use(VueResource)
Vue.use(VueTouch)
Vue.http.options.root = '/jssq/api'
Vue.http.options.emulateJSON = true

/**
 * HTTP 拦截器 get 请求加入时间戳, 所有请求加入 api version
 */
Vue.http.interceptors.push((request, next) => {
  let separator = request.url.indexOf('?') === -1 ? '?' : '&'
  if (request.method === 'get') {
    request.url = request.url + separator + 'noCache=' + new Date().getTime() + '&version=1.0'
  }
  else if (request.method === 'delete') {
    request.url = request.url
  }
  else {
    request.url = request.url + separator + 'version=1.0'
  }
  next()
})

$.showPreloader()
tokenUtil.getToken()
.then(res => {
  $.hidePreloader()

  var fuckthings = JSON.parse(window.sessionStorage.getItem('fuckthings'))

  if (!res.token) {
    res.token = fuckthings.token
  }
  if (!res.host && !res.apiServer) {
    res.host = fuckthings.apiServer
  }

  Vue.http.headers.common['authorization'] = 'Bearer ' + res.token  // 如果url中直接存在token,则在初始化的时候就加上.如果是在微信企业号里面,则为了加载友好,在第一个页面中设置token
  Vue.http.headers.common['x-api-server'] = res.host || res.apiServer  // api server
  router.start(app, '#app')
  window.router = router
})
.catch(res => {
  $.hidePreloader()
  $.alert(res.message, '提示')
})
