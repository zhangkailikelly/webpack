<template>

  <v-header :title="header.title" :back="header.back" :option="header.option" :showleft="header.showleft"></v-header>
    <!-- 导航开始 -->
  <div class="buttons-tab">
    <a v-link="{name: 'group_f', activeClass: 'active', query: {group_id: this.group_id}}" class="button">群组</a>
    <a v-link="{name: 'topic_f', activeClass: 'active', query: {group_id: this.group_id}}" class="button">话题</a>
    <a v-link="{name: 'speak_f', activeClass: 'active', query: {group_id: this.group_id}}" class="button">发言</a>
    <a v-link="{name: 'teacher_f', activeClass: 'active', query: {group_id: this.group_id}}" class="button">教师</a>
  </div>
  <!-- 导航结束 -->
  <div class="content" v-infinite-scroll="loadMore">

    <!-- 主体部分开始 -->
    <div class="content-block-title">成员</div>
    <!-- 这里是展示教师成员列表 -->
    <div class="list-block">
      <ul>
        <li class="item-content " v-for="teacher in teachers">
          <div class="item-inner">
            <div class="item-title" v-link="{ name: 'homepage', params: { id: teacher.id }}">
              <img class="groupimg" :src="teacher.cover_image_url"/>
              <div class="group-name">
                <span class="name">{{teacher.name}}</span>
              </div>
            </div>
            <div class="item-after">
              <div class="follow-box" v-show="myId !== teacher.id">
              <!-- 这里是关注与取消关注图标 -->
                <span class="iconfont-jysq icon-guanzhu follow" v-if="teacher.isFollow === 2" @click="follow(teacher.id, 2, $index)">
                  <span class="follow-text">关注</span>
                </span>
                <span class="iconfont-jysq icon-quxiaoguanzhu not-follow" v-if="teacher.isFollow === 1" @click="follow(teacher.id, 1, $index)">
                  <span class="follow-text not-follow-text">取消关注</span>
                </span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- 主体部分结束 -->
  </div>



</template>
<style scoped>
  /*头部样式*/
  .buttons-tab .button.active {
    color: #1dbc97;
    border-color: #1dbc97;
  }
  /*主体部分样式*/
  .content-block-title {
    margin-top: 3rem;
  }
  ul {
    background-color: initial;
  }
  li {
    background-color: #fff;
  }
  .list-block .item-inner {
    position: initial;
    height: 3rem;
  }
  .list-block {
    margin-bottom: 0rem;
  }
  .groupimg {
    position: absolute;
    width: 2rem;
    height: 2rem;
    display: block;
  }
  .group-name {
    padding-left: 2.5rem;
    height: 2rem;
    line-height: 2rem;
  }
  .name {
    display: block;
    font-size: 0.75rem;
  }
  .iconfont-jysq {
    position: relative;
    font-size: 1.2rem;
    line-height: 1.5rem;
    width: 1.2rem;
    display: block;
    height: 1.2rem;
    top: -.5rem;
  }
  .iconfont-jysq::before {
    display: block;
    height: 1.2rem;
  }
  .follow {
    color: #1dbc97;
  }
  .not-follow {
    color: #e7e7e7;
  }
  .buttons-tab {
    margin-top: 2.5rem;
    z-index: 100000;
  }
  .follow-text {
    font-size: 0.4rem;
    position: relative;
    top: -.5rem;
    left: 0.1rem;
  }
  .icon-quxiaoguanzhu:before {
    left: 1.2rem
  }
  .not-follow-text {
    left: -0.2rem;
  }
  .follow-box {
    width: 3rem;
  }
  .item-content {
    border-bottom: 1px #eee solid;
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
        // this.group_id = to.query.group_id
        $.showPreloader('加载中')
        this.$http.get(`finds?type=teacher`, {page: 1, per_page: this.per_page}).then(({data}) => {
          this.teachers = data.data
          this.total_count = data.total_count
          $.hidePreloader()
          $($('.tab-item')[3]).addClass('active')
        }, ({data, status}) => {
          $.alert(data.message || '加载数据失败')
        })
      }
    },
    watch: {
    },
    ready () {
      $.init()
      this.myId = Store.get('userInfo').id
    },
    data () {
      return {
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
        // header end
        teachers: [],
        cur_page: 1,
        per_page: 10,
        loading: false,
        total_count: 0,
        myId: ''
      }
    },
    computed: {
    },
    methods: {
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
          that.$http.get('finds?type=teacher', {page: that.cur_page + 1, per_page: that.per_page})
          .then(function (data) {
            that.teachers = [...that.teachers, ...data.data.data]
            that.cur_page = that.cur_page + 1
          })
          let scrollTop = scroller[0].scrollHeight - scroller.height() - 20
          scroller.scrollTop(scrollTop)
          this.loading = false
          loader.hide()
        }, 1500)
      },
      follow (id, type, index) { // 这里后台应该把以前api里传的true/false改成1/2
        this.$http.post('following/' + id).then(({data}) => {
          if (data.success) {
            this.teachers[index].isFollow = 3 - type
          }
          $.toast(data.message, 1000)
        })
      }
    },
    components: {
      // Store,
      applyPop,
      vHeader
    }
  }
</script>
