<template>
  <div class="buttons-tab">
    <a class="active button">我的群</a>
    <a class="button" v-link="{name: 'group_feeds'}">群动态</a>
    <span class="fl group-feeds-icon" @click="buildGroup()">+</span>
  </div>
  <div class="content" v-infinite-scroll="loadMore">
    <div class="card">
      <div class="card-content">
        <div class="card-content-inner">
          <div class="list-block">
            <ul>
              <li class="item-content item-link" v-for="group in groups" v-link="{name: 'group_home', query: { group_id: group.id, from: from}}">
                <div class="item-inner">
                  <div class="item-title">
                    <img class="groupimg" :src="group.cover_image_url"/>
                    <span class="group-name">{{group.name}}</span>
                  </div>
                  <div class="item-after">{{group.created_at}}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .buttons-tab {
    z-index: 999999;
  }
  .buttons-tab .button.active {
    color: #1dbc97;
    border-color: #1dbc97;
  }
  .content {
    padding: 2.5rem 0 0.5rem 0;
  }
  .card {
    min-height: 100%;
    margin: 0 0.5rem;
  }
  .item-title {
    line-height: 0rem;
    margin-right: .25rem;
  }
  .groupimg {
    position: absolute;
    width: 3rem;
    height: 3rem;
    top: 0.45rem;
  }
  .group-name {
    width: 100%;
    padding-left: 3.5rem;
    display: inline-block;
    height: 4rem;
    line-height: 4rem;
    white-space: nowrap;
    text-overflow:ellipsis;
    overflow:hidden;
  }
  .item-after {
    font-size: 0.7rem !important;
  }
</style>
<script>
  import Store from '../../assets/js/store.js/src/store.js'
  import {loader} from '../../util/util'
  import $ from 'zepto'
  export default {
    route: {
      data ({to, next}) {
        this.isRequest = false
        this.loading = false
        this.cur_page = 1
        this.userInfo = Store.get('userInfo')
        this.user_id = Store.get('userInfo').id
        this.user_type = Store.get('userInfo').type
        $.showPreloader('加载中')
        this.$http.get('my_group', {page: 1, per_page: this.per_page}).then(({data}) => {
          this.groups = data.data
          this.total_count = data.total_count
          $.hidePreloader()
        })
      }
    },
    ready () {
      $.init()
    },
    data () {
      return {
        groups: [],
        total_count: 0,
        cur_page: 1,
        per_page: 10,
        from: 'list',
        userInfo: {},
        user_id: 1,
        user_type: [],
        loading: false,
        isRequest: false
      }
    },
    methods: {
      // 如果是管理员则进入 创建群选择页，是普通教师直接进入创建群页面
      buildGroup () {
        let user_type = this.user_type.join(',')
        let go_type = 4
        if (user_type.indexOf('2') !== -1) {
          go_type = 2
        }
        else if (user_type.indexOf('3') !== -1) {
          go_type = 3
        }
        else if (user_type.indexOf('1') !== -1) {
          go_type = 1
        }
        else {
          go_type = 4
        }
        if (go_type !== 4) {
          this.$route.router.go({path: '/choosepage', query: {user_type: go_type}})
        }
        if (go_type === 4) {
          this.$route.router.go({path: '/create', query: {type: 'ordinary'}})
        }
      },
      loadMore () {
        if (this.loading || this.isRequest) {
          return
        }
        // 如果是最后一页就提醒下
        if (Math.ceil(this.total_count / this.per_page) <= this.cur_page) {
          $.toast('已经是最后一页了')
          this.loading = true
          return
        }
        let scroller = $('.content')
        var that = this
        this.loading = true
        loader.show()
        // 别玩了, 一直请求咋办
        setTimeout(() => {
          that.isRequest = true
          that.$http.get('my_group', {page: that.cur_page + 1, per_page: that.per_page})
          .then(function (data) {
            that.groups = [...that.groups, ...data.data.data]
            that.cur_page = that.cur_page + 1
            that.isRequest = false
            let scrollTop = scroller[0].scrollHeight - scroller.height() - 20
            scroller.scrollTop(scrollTop)
            that.loading = false
            loader.hide()
          })
        }, 1500)
      }
    },
    components: {
      Store
    }
  }
</script>
