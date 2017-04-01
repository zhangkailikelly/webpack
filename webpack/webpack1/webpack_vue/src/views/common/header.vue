<!-- author:jinzk -->
<!-- header -->
<!-- 使用方法:
  1. import vHeader form './commom/header' // 路径请自己配
  2. components: {applyPop}
  3. <v-header :title="header.title" :back="header.back" :option="header.option"></v-header>
  4. 初始化所传数据
  header: {
    title: '群组名称',
    back: { // 返回路由，有指定返回的路由，则返回该路由，没有指定，则window.history.back()
      route: 'list',
      params: {},
      query: {}
    }, // 不传执行 window.history.back() 在header中限制
    option: { // 右边操作，有可能是一个方法，也有可能是一个路由跳转，也有可能没有，按情况调用
      text: '',
      go: {
        route: 'setting',
        params: {},
        query: {}
      },
      fn: () => {},
      icon: 'icon-settings'
    }
  }
 -->
<template>
  <header class="bar bar-nav">
    <a class="button button-link button-nav pull-left" @click="back" v-show="showleft === 'yes'">
      <span class="icon icon-left"></span>
    </a>
    <h1 class="title not-too-long">{{title}}</h1>
    <a class="button button-link button-nav pull-right" @click="gonext()" v-show="option.text || option.icon">{{option.text}}
      <span class="icon" :class="option.icon"></span>
    </a>
  </header>
</template>
<style scoped>
  .not-too-long {
    width: 50%;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0 25%;
  }
</style>
<script>
  import $ from 'zepto'
  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      back: {
        type: Function,
        default: () => {
          window.history.back()
        }
      },
      option: {
        text: '',
        go: {
          route: '',
          params: {},
          query: {}
        },
        fn: {
          type: Function
        },
        icon: ''
      },
      showleft: {
        type: String,
        default: 'yes'
      }
    },
    ready () {
      $.init()
    },
    methods: {
      gonext () {
        if (this.option.go.route) {
          this.$route.router.go({name: this.option.go.route, params: this.option.go.params, query: this.option.go.query})
        }
        else {
          this.option.fn()
        }
      }
    },
    data () {
      return {
      }
    },
    components: {
    }
  }
</script>
