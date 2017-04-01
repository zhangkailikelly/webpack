<template>

  <div class="page page-current">
      <bar v-if="isIndex">
        <bar-item path="/feeds" label="首页" icon="icon-iconfont-home" boxclass=""></bar-item>
        <!-- icon-friends -->
        <bar-item path="/list" label="群组" icon="icon-yonghu" boxclass=""></bar-item>

        <bar-item path="/push" label="" icon="icon-xie" boxclass="push"></bar-item>
        <!--todo 待修改图标-->
        <bar-item path="/group_f" label="发现" icon="icon-faxian" boxclass=""></bar-item>
        <bar-item path="/about" label="我" icon="icon-icon1" boxclass=""></bar-item>
      </bar>



      <router-view></router-view>
      <area-select-user></area-select-user>
  </div>
</template>




<script>
import Bar from './components/Bar'
import BarItem from './components/BarItem'
import areaSelectUser from './components/AreaSelectUser/AreaSelectUser'
// import {wxShareConfig} from './util/util'
// import $ from 'zepto'
// import wx from 'wx'

export default {

  ready () {
    // 全局监听事件，广播给所有子组件。
    // data.toName 表示广播的名字
    this.$on('app:main', (data) => {
      console.log(`listen event from children,to ${data.toName}`)
      if (data.toName) {
        this.$broadcast(data.toName, data.data)
      }
    })
  },
  data () {
    return {
      isIndex: true,
      isPush: false
      // who: {}
    }
  },
  components: {
    Bar,
    BarItem,
    areaSelectUser
  }
}
</script>

<style>
@import './assets/css/sm.css';
@import './assets/css/main.css';
@import './assets/js/photoswipe/photoswipe.css';
@import './assets/js/photoswipe/default-skin/default-skin.css';
[v-cloak] {
  display: none;
}
.fade-transition {
  transition: opacity .3s ease;
}
.fade-enter, .fade-leave {
  opacity: 0;
}
</style>
