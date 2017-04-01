<template>
  <header class="bar bar-nav">
    <a class="button button-link button-nav pull-left" v-link="{path: '/about', replace: true}">
      <span class="icon icon-left"></span>
    </a>
    <h1 class="title">我的关注</h1>
  </header>
  <div class="content-padded">
    <div class="list-block content" v-infinite-scroll="loadMore" style="margin-top:3rem" >
      <ul>
        <li v-for="user in  users">
          <a v-link="{ name: 'profile', params: { id: user.id }}" class="clearfix">
            <img v-bind:src="user.profile_image_url" alt="" class="avatar">
            <div class="item-name">{{user.name}}</div>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>

  .item-name {
    float: left;
    margin-left: 2rem;
    margin-top: .5rem;
  }
  .avatar {
    float: left;
  }
  .list-block li {
    padding: .5rem;
    border-bottom: 1px solid #e7e7e7;
  }
</style>
<script>

  import {loader} from '../util/util'
  import $ from 'zepto'

  export default {
    route: {
      data ({to, next}) {
        return this.$http.get('following', { page: 1, per_page: this.per_page}).then(({data}) => {
          console.log(data.data)
          this.$set('users', data.data)
          this.$set('total_count', data.total_count)
        })
      }
    },
    ready () {
      $.init()
    },
    data () {
      return {
        users: {},
        total_count: 0,
        cur_page: 1,
        per_page: 5
      }
    },
    methods: {
      loadMore () {
        if (this.loading) {
          return
        }
        // 如果是最后一页就提醒下
        if (Math.ceil(this.total_count / this.per_page) === this.cur_page - 1) {
          $.toast('已经是最后一页了')
          return false
        }
        this.loading = true
        let scroller = $('.content-padded')
        var that = this
        loader.show()
        setTimeout(() => {
          that.$http.get('following', {page: that.cur_page + 1, per_page: that.per_page})
          .then(function (data) {
            that.users = [...that.users, ...data.data.data]
            that.cur_page = that.cur_page + 1
          })
          let scrollTop = scroller[0].scrollHeight - scroller.height() - 20
          scroller.scrollTop(scrollTop)
          this.loading = false
          loader.hide()
        }, 1500)
      }
    }
  }
</script>
