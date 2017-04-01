<template>
  <header class="bar bar-nav">
    <a class="button button-link button-nav pull-left" v-link="{path: '/feeds', replace: true}">
      <span class="icon icon-left"></span>
    </a>
    <h1 class="title">消息</h1>
  </header>
  <div class="content-padded">

    <div class="list-block content" v-infinite-scroll="loadMore" style="margin-top:2.3rem" >
      <div class="no-message" v-show="total_count <= 0">
        暂无消息
      </div>
      <div class="card" v-for="message in  messages">
        <div class="card-content" :class="{'is-read':message.status}" @click="read($index)">
          <div class="card-content-inner">
            <div class="msg-date">{{message.created_at}}</div>
            <div class="msg-content">{{message.info}}</div>
        </div>
      </div>


      <!--<ul>-->
        <!--<li v-for="message in  messages">-->
          <!--<div v-if="message.status">{{message.created_at}}  {{message.info}} </div>-->
          <!--<div v-else>{{message.created_at}}  {{message.info}} </div>-->
          <!--&lt;!&ndash; TODO 点击未读之后再发请求给服务器&ndash;&gt;-->
        <!--TODO 待测试分页 下拉刷新-->
        <!--</li>-->
      <!--</ul>-->
    </div>
  </div>
</template>

<style scoped>

  .card-content-inner {
      padding: .5rem;
  }
  .no-message {
    text-align: center;
    margin-top: 1rem;
  }
  .msg-date {
    font-size: .7rem;
    margin-bottom: .5rem;
  }
  .is-read  {
    color: #908E8E;
  }
</style>
<script>

  import {loader} from '../util/util'
  import $ from 'zepto'

  export default {
    route: {
      data ({to, next}) {
        return this.$http.get('messages', { page: 1, per_page: this.per_page}).then(({data}) => {
          console.log(data)
          if (data.success) {
            this.$set('messages', data.data)
            this.$set('total_count', data.total_count)
          }
          else {
            $.toast(data.msg)
          }
        })
      }
    },
    ready () {
      $.init()
    },
    data () {
      return {
        messages: {},
        total_count: 0,
        cur_page: 1,
        per_page: 10
      }
    },
    methods: {
      loadMore () {
        if (this.loading) {
          return
        }
        this.loading = true
        let scroller = $('.content-padded')
        var that = this
        loader.show()
        setTimeout(() => {
          that.$http.get('messages', {page: that.cur_page + 1, per_page: that.per_page})
          .then(function (data) {

            that.messages = [...that.messages, ...data.data.data]
            // 如果是最后一页就提醒下
            if (Math.ceil(data.data.total_count / that.per_page) === that.cur_page) {
              $.toast('已经是最后一页了')
            }
            else {
              that.cur_page = that.cur_page + 1
            }
          })
          let scrollTop = scroller[0].scrollHeight - scroller.height() - 20
          scroller.scrollTop(scrollTop)
          this.loading = false
          loader.hide()
        }, 1500)
      },
      read (index) {
        if (this.messages[index].status) {
          return
        }
        else {

          if (this.messages[index] === null) {
            $.toast('服务器出错')
            return
          }

          this.$http.post('messages/' + this.messages[index].id + '/read').then((data) => {
            console.log(data.data)
            if (data.data.success) {
              this.messages[index].status = true
            }
            $.toast(data.data.msg)
          })
        }
      }
    }
  }
</script>
