<template>
  <v-header :title="header.title" :back="header.back" :option="header.option" :showleft="header.showleft"></v-header>
  <div class="buttons-tab">
    <a v-link="{name: 'group_f', activeClass: 'active', query: {group_id: this.group_id}}" class="button">群组</a>
    <a v-link="{name: 'topic_f', activeClass: 'active', query: {group_id: this.group_id}}" class="button">话题</a>
    <a v-link="{name: 'speak_f', activeClass: 'active', query: {group_id: this.group_id}}" class="button">发言</a>
    <a v-link="{name: 'teacher_f', activeClass: 'active', query: {group_id: this.group_id}}" class="button">教师</a>
  </div>
  <!-- 下面是话题内容部分 -->
  <div class="content" v-infinite-scroll="loadMore">
    <div class="card" v-for="topic in topics" v-link="{name: 'topics', query: {topic_id: topic.id}}">
      <div class="card-content">
        <div class="card-content-inner">
          <div>
            <span class="topic-title">#{{topic.name}}#</span>
          </div>
          <div class="topic-speak">
            发言: {{topic.speak}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
  /*jinzk*/
  .icon {
    color: #ccc;
  }
  .group-info {
    position: fixed;
    width: 100%;
    z-index: 999;
  }
  .group-bg {
    max-height: 4rem;
    width: 100%;
    margin-top: 2.5rem;
  }
  .buttons-tab .button.active {
    color: #1dbc97;
    border-color: #1dbc97;
  }
  ul {
    margin-top: 3rem;
  }
  .buttons-tab {
    margin-top: 2.5rem;
    z-index: 100000;
  }
  .content {
    margin-top: 2.5rem !important;
  }
  .topic-title {
    color: #1dbc97;
    word-wrap:break-word;
    word-break:break-all;
  }
  .topic-speak {
    margin-top: 0.5rem;
  }
</style>
<script>
  import Store from '../../assets/js/store.js/src/store.js'
  import $ from 'zepto'
  import applyPop from '../common/applyPop'
  import vHeader from '../common/header'
  import {loader} from '../../util/util'

  export default {
    route: {
      data ({to, next}) {
        this.isRequest = false
        this.loading = false
        this.cur_page = 1
        this.group_id = to.query.group_id
        this.topic(this.group_id)
      }
    },
    watch: {
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
          title: '发现',
          back: function () {},
          option: {
            text: '',
            go: {},
            fn: () => {},
            icon: ''
          },
          showleft: 'no'
        },
        per_page: 10,
        cur_page: 1,
        loading: false,
        group_id: '',
        topics: [],
        total_count: 0
      }
    },
    computed: {
    },
    methods: {
      topic (group_id) {
        $.showPreloader('加载中')
        this.$http.get(`finds?type=topic&page=1&per_page=10`).then(({data}) => {
          this.topics = data.data
          this.total_count = data.total_count
          $.hidePreloader()
          $($('.tab-item')[3]).addClass('active')
        }, ({data, status}) => {
          $.alert(data.message || '加载数据失败')
        })
      },
      newTopic () {
        this.$route.router.go({name: 'push', query: {group_id: this.group_id, type: 'topic'}})
      },
      loadMore () {
        if (this.loading) {
          return
        }
        // 如果是最后一页就提醒下
        if (Math.ceil(this.total_count / this.per_page) <= this.cur_page) {
          $.toast('已经是最后一页了')
          this.loading = true
          return
        }
        this.loading = true // 限制无限加载
        let scroller = $('.content')
        var that = this
        loader.show()
        setTimeout(() => {
          that.$http.get('finds?type=topic', {page: that.cur_page + 1, per_page: that.per_page})
          .then(function (data) {
            that.topics = [...that.topics, ...data.data.data]
            that.cur_page = that.cur_page + 1
          }, ({data, status}) => {
            $.alert(data.message || '加载数据失败')
          })
          let scrollTop = scroller[0].scrollHeight - scroller.height() - 20
          scroller.scrollTop(scrollTop)
          this.loading = false
          loader.hide()
        }, 1500)
      }
    },
    components: {
      Store,
      applyPop,
      vHeader
    }
  }
</script>
