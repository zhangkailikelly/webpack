<template>
  <!-- 申请理由 -->
  <apply-pop :data="popObj"></apply-pop>
  <div class="group-info">
    <v-header :title="header.title" :back="header.back" :option="header.option"></v-header>
    <!-- 群组背景图 -->
    <img class="group-bg" :src="groupInfo.cover_bg_url" />
    <!-- 群组tab切换 -->
    <div class="buttons-tab">
      <a v-link="{name: 'group_home', query: {group_id: this.group_id, from: this.from}}" class="button" :class="{'active': isFeeds}">动态</a>
      <a v-link="{name: 'topic', activeClass: 'active', query: {group_id: this.group_id, from: this.from}}" class="button">话题</a>
      <a v-link="{name: 'resource', activeClass: 'active', query: {group_id: this.group_id, from: this.from}}" class="button">资源</a>
      <a v-link="{name: 'member', activeClass: 'active', query: {group_id: this.group_id, from: this.from}}" class="button">成员</a>
    </div>
  </div>
  <!-- 群组子路由 -->
  <router-view v-if="groupInfo !== ''"></router-view>
</template>

<style scoped>
  /*jinzk*/
  .bar .button-nav.pull-right {
    margin-right: 0rem;
  }
  .icon {
    color: #ccc;
  }
  .group-info {
    position: fixed;
    width: 100%;
    z-index: 999;
  }
  .group-bg {
    height: 4rem;
    width: 100%;
    margin-top: 2.5rem;
  }
  .buttons-tab {
    top: -0.4rem;
  }
  .buttons-tab .button.active {
    color: #1dbc97;
    border-color: #1dbc97;
  }
</style>
<script>
  import Store from '../../../assets/js/store.js/src/store.js'
  import $ from 'zepto'
  import applyPop from '../../common/applyPop'
  import vHeader from '../../common/header'

  export default {
    route: {
      data ({to, next}) {
        console.log('什么Giuseppe啊啊啊a')
        this.group_id = to.query.group_id
        this.from = to.query.from
        this.header.option.go.query = {
          group_id: this.group_id,
          from: this.from
        }
        // 醉了，嵌套路由指定默认默认页面路由为'/',添加activeClass时默认路由active清不了，个人感觉'/'所有的子路由都在'/'之下
        // 要是谁找到解决办法了，求指导...目前就粗暴的添加样式吧
        let path = to.path
        if (path.split('?')[0] === '/group_home') {
          // this.groupInfoFn()
          this.isFeeds = true
        }
        else {
          this.isFeeds = false
        }
      }
    },
    watch: {
      'group_id': 'groupInfoFn' // 检测group_id的变化，group_id变化了才需要重新获取群组信息
    },
    ready () {
      $.init()
      this.user_id = Store.get('userInfo').id
    },
    data () {
      return {
        // jinzk
        // header start
        header: {
          title: '群组名称',
          back: function () {
            this.groupInfo = ''
            this.$route.router.go({name: this.from})
          }.bind(this),
          option: {
            text: '',
            go: {
              route: 'setting',
              query: {
                group_id: '',
                from: ''
              }
            },
            fn: () => {},
            icon: 'icon-settings'
          }
        },
        // header end
        isFeeds: false, // 粗暴的添加active
        group_id: '',
        user_id: '',
        from: '',
        groupInfo: '',
        popObj: {
          show: false,
          group_id: '',
          user_id: ''
        }
      }
    },
    computed: {
    },
    methods: {
      showApplyPop () {
        this.popObj.show = true
        this.popObj.group_id = this.group_id
        this.popObj.user_id = this.user_id
      },
      groupInfoFn () {
        this.$http.get(`group_info?group_id=${this.group_id}&user_id=${this.user_id}`).then(({data}) => {
          this.groupInfo = data
          if (data.role === 4) {
            this.header.option.icon = ''
          }
          else if (data.role !== 4) {
            this.header.option.icon = 'icon-settings'
          }
          // 存入缓存, 群设置调用
          Store.set('groupInfo', data)
          this.header.title = this.groupInfo.name
        })
      }
    },
    components: {
      Store,
      applyPop,
      vHeader
    }
  }
</script>
