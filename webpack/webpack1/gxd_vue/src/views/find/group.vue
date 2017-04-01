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
    <div class="list-block">
      <ul>
        <li class="item-content " v-for="group in groups">
          <div class="item-inner">
            <div class="item-title" v-link="{name: 'group_home', query: { group_id: group.id, from: from}}">
              <img class="groupimg" :src="group.cover_image_url"/>
              <div class="group-name">
                <span class="name">{{group.name}}</span>
                <span class="num">{{group.member}}人</span>
              </div>
            </div>
            <div class="item-after">
              <!-- <div v-if="group.role === 4" class="apply-join" v-link="{name:'apply',query:{group_id:group.id}}">申请加入</div> -->
              <div v-if="group.role < 4" class="is-join group-join-type">已加入</div>
              <a @click="apply(group.id, group.apply, $index)">
                <div v-if="group.role === 4 && group.isSchool !== 1" class="apply-join group-join-type" :class="{'color-ccc': group.apply === 1}">申请加入</div>
              </a>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <!-- 主体部分结束 -->
  <apply-pop :data="applyData" :status.sync="applyStatus"></apply-pop>


</template>
<style scoped>
  /*头部样式*/
  .buttons-tab .button.active {
    color: #1dbc97;
    border-color: #1dbc97;
  }
  /*主体部分样式*/
  .content {
    /*margin-top: 8.85rem !important;*/
  }
  ul {
    background-color: initial;
    margin-top: 3rem;
  }
  li {
    margin-top: 1rem;
    background-color: #fff;
  }
  .list-block .item-inner {
    position: initial;
    height: 3rem;
  }
  .item-title {
    line-height: 0rem;
    width: 80%;
    margin-right: .25rem;
  }
  .buttons-tab {
    margin-top: 2.5rem;
    z-index: 100000;
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
    line-height: 1rem;
  }
  .name {
    display: block;
    font-size: 0.75rem;
    color: #1cbd9d;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .num {
    font-size: 0.55rem;
  }
  .item-after div {
    padding: 0.2rem;
    line-height: 1rem;
    font-size: 0.75rem;
  }
  .item-after .apply-join {
    border: 1px solid #1cbd9d;
    color: #1cbd9d;
  }
  .is-join {
    border: 1px solid #e7e7e7;
    color: #e7e7e7;
  }
  .color-ccc {
    color: #e7e7e7 !important;
    border: 1px #e7e7e7 solid !important;
  }
  .group-join-type {
    width: 3.8rem;
    text-align: center;
  }
</style>
<script>
  // import Store from '../../assets/js/store.js/src/store.js'
  import $ from 'zepto'
  import applyPop from '../common/applyPop'
  import vHeader from '../common/header'
  import {loader} from '../../util/util'
  import Store from '../../assets/js/store.js/src/store.js'
  export default {
    route: {
      data ({to, next}) {
        this.isRequest = false
        this.loading = false
        this.cur_page = 1
        // this.group_id = to.query.group_id
        this.user_id = Store.get('userInfo').id
        $.showPreloader('加载中')
        this.$http.get(`finds?type=forum&page=1&per_page=10`).then(({data}) => {
          this.groups = data.data
          this.total_count = data.total_count
          $.hidePreloader()
        }, ({data, status}) => {
          $.alert(data.message || '加载数据失败')
        })
      }
    },
    watch: {
      'applyStatus': 'changeApplyStatus'
    },
    ready () {
      $.init()
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
        groups: [],
        from: 'group_f',
        cur_page: 1,
        per_page: 10,
        loading: false,
        total_count: 0,
        user_id: '',
        applyData: { // 申请入群popdata
          show: false,
          group_id: ''
        },
        applyStatus: 0,
        statusIndex: 0,
        isRequest: false
      }
    },
    computed: {
    },
    methods: {
      changeApplyStatus () {
        console.log('???...')
        console.log(this.groups[this.statusIndex])
        this.groups[this.statusIndex].apply = 1
      },
      // 申请入群打开applypop组件
      apply (id, status, index) {
        if (status === 1) {
          return
        }
        this.statusIndex = index
        this.applyData.group_id = id
        this.applyData.show = true
        this.applyStatus = 0
      },
      loadMore () {
        if (this.loading || this.isRequest) {
          return
        }
        // 如果是最后一页就提醒下
        if (Math.ceil(this.total_count / this.per_page) <= this.cur_page) {
          $.toast('已经是最后一页了', 100)
          this.loading = true
          return
        }
        this.loading = true
        let scroller = $('.content')
        var that = this
        loader.show()
        setTimeout(() => {
          that.isRequest = true
          that.$http.get('finds?type=forum', {page: that.cur_page + 1, per_page: that.per_page})
          .then(function (data) {
            that.groups = [...that.groups, ...data.data.data]
            that.cur_page = that.cur_page + 1
            that.isRequest = false
          }, ({data, status}) => {
            $.alert(data.message || '加载数据失败')
          })
          let scrollTop = scroller[0].scrollHeight - scroller.height() - 20
          scroller.scrollTop(scrollTop)
          this.loading = false
          loader.hide()
        }, 500)
      }
    },
    components: {
      Store,
      applyPop,
      vHeader
    }
  }
</script>
