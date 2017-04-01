<template>
  <div v-if="total_count === 0" class="no-content">暂无话题</div>
  <bar v-if="user_role !== 4 && requestFlag">
    <bar-item label="发表话题" icon="icon-155" @click="newTopic()" class="bg"></bar-item>
  </bar>
  <bar v-if="user_role === 4 && isSchool !== 1 && requestFlag">
    <bar-item label="申请入群" icon="icon-bianxie" class="green" @click="apply(group_id)" :class="{'color-666': this.applyStatus === 1}"></bar-item>
  </bar>
  <div class="content"  v-infinite-scroll="loadMore">
    <div class="card" v-for="topic in topics" v-link="{name: 'topics', query: {topic_id: topic.id, group_id: group_id}}">
      <div class="card-content">
        <div class="card-content-inner">
          <div>
            <span class="top" v-if="topic.isTop === 1">置顶</span>
            <span class="topic-title">#{{topic.name}}#</span>
            <div class="topic-handle" v-if="user_role === 1 || user_role === 2">
              <span v-if="topic.isTop === 1" @click.stop="top(0, topic.id)">取消置顶 |</span>
              <span v-else @click.stop="top(1, topic.id)">置顶 |</span>
              <span @click.stop="deleteTopic($index, topic.id)">删除</span>
            </div>
          </div>
          <div class="topic-speak">
            发言: {{topic.speak}}
          </div>
        </div>
      </div>
    </div>
  </div>
  <apply-pop :data="applyData"></apply-pop>
</template>

<script>
  import Store from '../../../assets/js/store.js/src/store.js'
  import $ from 'zepto'
  import Bar from '../../../components/Bar'
  import BarItem from '../../../components/BarItem'
  import {loader} from '../../../util/util'
  import applyPop from '../../common/applyPop'
  export default {
    ready () {
    },
    route: {
      data ({to}) {
        this.isRequest = false
        this.loading = false
        this.cur_page = 1
        this.group_id = to.query.group_id
        let groupInfo = Store.get('groupInfo')
        this.user_role = groupInfo.role
        this.applyStatus = groupInfo.apply
        this.isSchool = groupInfo.new_gropu_type === 'isSchool' ? 1 : 0
        this.requestFlag = true
        this.topic(this.group_id)
        // this.$http.get(`group_info?group_id=${this.group_id}&user_id=${this.user_id}`).then(({data}) => {
        //   this.user_role = data.role
        //   this.applyStatus = data.apply
        //   this.isSchool = data.new_gropu_type === 'isSchool' ? 1 : 0
        //   this.requestFlag = true
        // })
      }
    },
    data () {
      return {
        per_page: 10,
        cur_page: 1,
        group_id: '',
        topics: [],
        total_count: 0,
        loading: false,
        user_role: 0,
        applyData: {
          show: false,
          group_id: ''
        },
        isRequest: false,
        applyStatus: 1,
        isSchool: 1,
        requestFlag: false
      }
    },
    methods: {
      // 申请入群
      apply (id) {
        if (this.applyStatus === 1 || this.applyStatus === '1') {
          return
        }
        this.applyData.group_id = id
        this.applyData.show = true
      },
      topic (group_id) {
        $.showPreloader('加载中')
        this.$http.get(`group_topic?group_id=${group_id}&page=1&per_page=${this.per_page}`).then(({data}) => {
          this.topics = data.data
          this.total_count = data.total_count
          $.hidePreloader()
        }, ({data, status}) => {
          $.alert(data.message)
        })
      },
      newTopic () {
        this.$route.router.go({name: 'push', query: {group_id: this.group_id, type: 'topic'}})
      },
      top (action, topic_id) {
        this.$http.post(`group_topic_top/${topic_id}`, {action: action}).then(({data}) => {
          if (data.success) {
            let message = action === 0 ? '取消置顶成功' : '置顶成功'
            $.toast(message, 500)
            let _this = this
            setTimeout(() => {
              _this.topic(_this.group_id)
            }, 550)
          }
        }, ({data, status}) => {
          $.alert(data.message)
        })
      },
      deleteTopic (index, topic_id) {
        this.$http.delete(`group_topic/${topic_id}`).then(({data}) => {
          $.toast('删除成功', 500)
          let _this = this
          setTimeout(() => {
            _this.topics.splice(index, 1)
          }, 550)
        }, ({data, status}) => {
          $.alert(data.message)
        })
      },
      loadMore () {
        if (this.loading || this.isRequest) {
          return
        }
        if (Math.ceil(this.total_count / this.per_page) <= this.cur_page) {
          $.toast('已经是最后一页了', 500)
          this.loading = true
          return
        }
        this.loading = true
        let scroller = $('.content')
        var that = this
        loader.show()
        setTimeout(() => {
          that.isRequest = true
          that.$http.get('group_topic', {group_id: that.group_id, page: that.cur_page + 1, per_page: that.per_page})
          .then(function (data) {
            that.topics = [...that.topics, ...data.data.data]
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
      Bar,
      BarItem,
      Store,
      applyPop
    }
  }
</script>

<style scoped>
  /* 拉之前的页面结构有点恶心 */
  .content {
    margin-top: 8.3rem !important;
  }
  .top {
    background-color: red;
    color: #fff;
    padding: 0 0.1rem;
    border-radius: .15rem;
  }
  .topic-title {
    color: #1dbc97;
    word-wrap:break-word;
    word-break:break-all;
  }
  .topic-speak {
    margin-top: 0.5rem;
  }
  .topic-handle {
    float: right;
    color: #aaa;
  }
  .bg {
    color: #1dbc97;
  }
  .card-content {
    margin-top: .75rem;
  }
  .tab-label {
  color: #1dbc97;
  display: inline-block;
  font-size: 0.85rem;
  border: 1px solid;
  padding: 0.1rem;
  }
  .no-content {
    margin-top: 14rem;
    text-align: center;
  }
  .color-666 {
    color: #e7e7e7 !important;
  }
</style>
