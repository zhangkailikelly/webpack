<!-- 话题详情页面 -->
<!-- 按照产品的要求，进入了话题详情的页面，查看话题下的发言，就没有必要进入动态详情的页面了，所以呢，点击查看全部就获取一下，不调转了 -->
<template>
  <v-header :title="header.title" :back="header.back" :option="header.option"></v-header>
  <bar style="z-index: 999999999;" v-if="user_role !== 4 && requestFlag">
    <bar-item label="发言" icon="icon-155" @click="newTopicFeed()" class="bg"></bar-item>
  </bar>
  <bar style="z-index: 999999999;" v-if="user_role === 4 && isSchool !== 1 && requestFlag">
    <bar-item label="申请入群" icon="icon-bianxie" class="green" :class="{'color-666': this.applyStatus === 1}" @click="apply(group_id)"></bar-item>
  </bar>
  <div class="container" v-show="showLoading">
    <div class="card" v-if="total_count > 0">
      <div class="card-content">
        <div class="card-content-inner">
          <div class="topic-title">#{{feeds.name}}#</div>
          <div>发言: {{feeds.speak}}</div>
          <div>
            发起人: {{feeds.user}}
            <span class="fr">{{feeds.created_at}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="index" v-if="total_count > 0">
      <div class="content card-container"  v-infinite-scroll="loadMore">
        <!-- distance="55" v-pull-to-refresh="refresh -->
        <!-- <V-layer></V-layer> -->
        <div v-if="feeds.speak">
          <div class="card facebook-card" v-for="feed in feeds.data" track-by="$index">

            <div class="card-header clearfix">
              <div class="facebook-avatar">
                <a v-link="{ name: 'profile', params: { id: feed.user.id }}">
                  <img v-bind:src="feed.user.profile_image_url">
                </a>
              </div>

              <div v-if="feed.group">
                <div class="facebook-name">{{feed.user.name}}
                  <div class="group-feeds-date">{{feed.created_at.replace('T',' ').replace('Z','')}}</div>
                </div>
                <div class="facebook-date"><span style="color: #5f646e;">发表于: </span><a href="javascript:void(0);">{{feed.group}}</a></div>
              </div>

              <div v-else>
                <div class="facebook-name">{{feed.user.name}}</div>
                <div class="facebook-date">{{feed.created_at.replace('T',' ').replace('Z','')}}</div>
              </div>

              <!-- <a href="javascript:void(0);">
                <div class="facebook-name">{{feed.user.name}}
                  <div class="group-feeds-date">{{feed.created_at.replace('T',' ').replace('Z','')}}</div>
                </div>
                <div class="facebook-date"><span style="color: #5f646e;">发表于: </span><a href="javascript:void(0);">{{feed.group}}</a></div>
              </a> -->



            </div>
            <div class="card-content">

              <a v-show="feed.text && feed.text !== ''" href="javascript:void(0);">
                <!-- v-link="{ name: 'detail', params: { id: feed.id }}" class="text-href" -->
                <div v-show="feed.text && feed.text !== ''" class="feed-text">
                  {{{feed.text}}}
                </div>
              </a>
              <div class="feed-retweeted" v-if="feed.retweeted">
                <div class="feed-retweeted-content">
                  <a href="javascript:void(0);" class="text-href">
                    <!-- v-link="{ name: 'detail', params: { id: feed.id }}" -->
                    <span class="feed-retweeted-name">{{feed.retweeted.user.name}}</span>：
                    <span v-show="feed.retweeted.text && feed.retweeted.text !== ''" class="feed-retweeted-text">{{{feed.retweeted.text}}}</span>
                  </a>
                </div>

                <div class="feed-retweeted-imgs row">
                  <div itemscope itemtype="http://schema.org/ImageGallery" v-photo-swipe>
                    <figure  class="thumb-img col-33" itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject"  v-for="album in feed.retweeted.pics" >
                      <a :href="album.original_url" itemprop="contentUrl" data-size="{{album.width}}x{{album.height}}">
                          <img :src="album.thumb_url" itemprop="thumbnail" :alt="album.name" />
                      </a>
                    </figure>
                  </div>
                </div>
                <div class="list-block">
                  <ul>
                    <li v-for="link in feed.retweeted.links"><a class="feed-link" href="{{link.url}}">{{link.name}}</a></li>
                  </ul>
                </div>
                <!-- 附件下载组件 -->
                <attach :files="feed.retweeted.others" :open-safari-modal-flag.sync="openSafariModalFlag" :is-retweeted="1"></attach>
                <!-- 视频连接跳出去吧 -->
                <!-- 上传视频调用vue-vedio 插件 -->
                <div class="no-line-vedio clearfix">
                  <div class="video-box fl" v-for="video in feed.retweeted.videos" @click="openVideo(video)">
                    <img class="video-cover" :src="video.cover"/>
                    <img class="video-cover-icon" src="./../../assets/img/icon_img/video.png"/>
                  </div>
                </div>
              </div>


              <div v-show="feed.pics && feed.pics.length > 0" class="feed-imgs row" type="caption" style="padding:.5rem">
                <div itemscope itemtype="http://schema.org/ImageGallery" v-photo-swipe>
                  <figure  class="thumb-img col-33" itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject"  v-for="album in feed.pics" >
                    <a :href="album.original_url" itemprop="contentUrl" data-size="{{album.width}}x{{album.height}}">
                        <img :src="album.thumb_url" itemprop="thumbnail" :alt="album.name" />
                    </a>
                  </figure>
                </div>
              </div>

              <!-- 连接 -->
              <div class="list-block feeds-attach">
                <ul>
                  <li v-for="link in feed.links"><a class="feed-link" target="_blank" href="{{link.url}}">{{link.name}}</a></li>
                </ul>
              </div>
              <!-- 附件下载组件 -->
              <attach :files="feed.others" :open-safari-modal-flag.sync="openSafariModalFlag"></attach>
              <!-- 视频连接跳出去吧 -->
              <!-- 上传视频调用vue-vedio 插件 -->
              <div class="no-line-vedio clearfix">
                <div class="video-box fl" v-for="video in feed.videos" @click="openVideo(video)">
                  <img class="video-cover" :src="video.cover"/>
                  <img class="video-cover-icon" src="./../../assets/img/icon_img/video.png"/>
                </div>
              </div>


              <div class="like-comment">

                <div class="clearfix" v-show="user_role !== 4">
                  <div class="pull-right like-comment-counts">
                    <a class="iconfont-jysq icon-zan1 text-href" v-bind:class="{ 'me-like': feed.likes.love}" @click="dolike(feed)">{{feed.likes.total_count}}</a>
                    <a class="iconfont-jysq icon-pinglun1 text-href" @click="showComment($index)">{{feed.comments.total_count}}</a>
                  </div>
                </div>

                <a href="javascript:void(0);" class="text-href">
                  <!-- v-link="{ name: 'detail', params: { id: feed.id }}" -->
                <div class="content-padded">
                   <span class="iconfont-jysq icon-zan1 who-like" v-if="feed.likes.data.length">
                      <template v-for="liker in feed.likes.data">
                          <span v-if="$index < 6">{{liker.name || liker}}
                            <template v-if="$index != 6 && $index != feed.likes.total_count-1">,
                            </template>
                          </span>
                      </template>
                      <span v-if="feed.likes.total_count>5">...</span>
                   </span>
                </div>

                <ul class="what-comment">

                  <template v-for="comment in feed.comments.data">
                    <li>
                      <span style="color:#6bba9c">{{comment.user.name}}</span>
                                  <span v-if="comment.reply">回复
                                    {{comment.reply.name}}
                                  </span>:
                      <span>{{comment.text}}</span>
                    </li>
                    <!-- jinzk 新增评论阅览图片 -->
                    <div v-if="comment.pic.original_url" class="feed-imgs row" type="caption" style="padding:.5rem">
                    <div itemscope itemtype="http://schema.org/ImageGallery" v-photo-swipe>
                      <figure  class="thumb-img col-33" itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject" >
                        <a :href="comment.pic.original_url" itemprop="contentUrl" data-size="{{comment.pic.width}}x{{comment.pic.height}}">
                            <img :src="comment.pic.thumb_url" itemprop="thumbnail" :alt="comment.pic.name" />
                        </a>
                      </figure>
                    </div>
                  </template>
                </ul>
                <div class="text-center pb-5 more-comments" v-if="feed.comments.total_count>3">
                  <!-- <a v-link="{ name: 'detail', params: { id: feed.id }}">查看全部评论（{{feed.comments.total_count}}）</a> -->
                  <a @click="allComments(feed.id, $index)">查看全部评论（{{feed.comments.total_count}}）</a>
                </div>
                </a>
              </div>


            </div>
          </div>

        </div>

        <div class="card facebook-card" v-else>
          <div class="card-header">数据正在加载中...</div>
        </div>

      </div>
    </div>
    </div>
    <div v-if="total_count <= 0">
      暂无数据
    </div>
  </div>
  <pswb></pswb>
  <!-- 评论pop -->
  <comment :data.sync="commentObj" :reply.sync="replyObj" :from="fromObj"></comment>
  <apply-pop :data="applyData" :status.sync="popApplyStatus"></apply-pop>
  <div class="open-safari-modal" v-show="openSafariModalFlag" @click="closeOpenSafariModal()">
    <img src="./../../assets/img/open-safari.png" alt="">
  </div>
  <div class="video-player-box" v-show="videoFlag">
    <span class="close-video" @click="closeVideo()">×</span>
    <div id="video-box"></div>
  </div>
</template>

<style scoped>
  @import './../../assets/js/zyMedia/zy.media.min.css';
  #video-box {
    height: 100%;
    width: 100%;
  }
  .color-666 {
    color: #e7e7e7 !important;
  }
  .bar-tab .me-like {
    color: #d84141;
  }
  .comments-area textarea {
    width: 100%;
    height: 6rem;
    padding: .5rem;
  }
  .push-comment-btn.disabled {
    color: rgba(68,68,68,.3);
  }
  .what-comment img {
    width: 2rem;
    height: 2rem;
    margin-right: .5rem;
  }
  .what-comment li {
    margin: .4rem 0;
  }

  .comments-area {
    position: absolute;
    bottom: 0;
    z-index: 11;
    left: 0;
    right: 0;
  }
  .comments-area .card-content {
    border: 2px solid #f9f9f9;
  }
  .who-like {
    white-space: nowrap;
    /* 先放着，测试提了统一改，不提就用原来的 */
    /*text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;*/
  }
  /* jinzk */
  .group-feeds-date {
    float: right;
    color: #ccc;
  }
  .buttons-tab {
    z-index: 999;
  }
  .buttons-tab .button.active {
    color: #1dbc97;
    border-color: #1dbc97;
  }
  .pull-left {
    padding-top: 0.35rem;
    margin-right: 10px;
  }
  .index {
    position: relative;
    height: 72%;
  }
  .topic-title {
    color: #1dbc97;
    word-wrap:break-word;
    word-break:break-all;
  }
  .container {
    top: 2.5rem;
    overflow: hidden;
  }
  .card-container {
    margin: 0 0;
  }
  .bg {
    color: #1dbc97;
  }
  .text-href {
    font-size: 0.9rem;
  }
  .tab-label {
  color: #1dbc97;
  display: inline-block;
  font-size: 0.85rem;
  border: 1px solid;
  padding: 0.2rem;
  }
</style>
<script>
  // import VLayer from '../../components/PullToRefreshLayer'
  import Pswb from '../../components/Pswb'
  import {loader} from '../../util/util'
  import Store from '../../assets/js/store.js/src/store.js'
  import vHeader from '../common/header'
  import $ from 'zepto'
  import Bar from '../../components/Bar'
  import BarItem from '../../components/BarItem'
  // jinzk 修改评论家图片
  import Comment from '../../components/Comment'
  import applyPop from '../common/applyPop'
  import Attach from '../common/Attach'
  require('./../../assets/js/zyMedia/zy.media.min.js') // eslint-disabled-line
  export default {
    route: {
      data ({to, next}) {
        $('#video-box').empty()
        this.videoFlag = false
        this.isRequest = false
        this.loading = false
        this.cur_page = 1
        // 获取话题的详情
        this.topic_id = to.query.topic_id
        // this.group_id = to.query.group_id
        this.userInfo = Store.get('userInfo')
        this.user_id = Store.get('userInfo').id
        this.user_type = Store.get('userInfo').type
        this.$set('commentFlag', false)
        // 话题详情呀大概??????哦擦擦擦哦ss
        $.showPreloader('加载中')
        this.$http.get(`group_topic_detail`, {
          topic_id: this.topic_id,
          page: 1,
          per_page: this.per_page
        }).then(({data}) => {
          $($('.tab-item')[1]).addClass('active')
          this.$set('feeds', data)
          this.$set('group_id', data.group_id)
          this.total_count = data.speak
          this.showLoading = true
          // 他妈的我错了。
          if (data.group_id) {
            this.$http.get(`group_info?group_id=${data.group_id}`).then(({data}) => {
              this.user_role = data.role
              this.applyStatus = data.apply
              this.isSchool = data.new_gropu_type === 'isSchool' ? 1 : 0
              this.requestFlag = true
              // (1: 提交申请了，未审批，2: 拒绝申请(或之前都没有提交过申请)，3: 同意申请
            })
          }
          $.hidePreloader()
        }, ({data, status}) => {
          $.alert(data.message || '加载数据出错')
        })
      }
    },
    ready () {
      $.init()
    },
    data () {
      return {
        loading: false,
        feeds: {},
        total_count: 0,
        cur_page: 1,
        user_role: 0,
        group_id: 0,
        applyData: {
          show: false,
          group_id: ''
        },
        popApplyStatus: 0,
        per_page: 10,
        commentFlag: false,
        willCommentFeedId: undefined,
        commentText: undefined,
        // jinzk
        header: {
          title: '话题详情',
          back: function () {
            window.history.back()
          },
          option: {
            text: '',
            go: {
              route: ''
            },
            fn: () => {},
            icon: ''
          }
        },
        topic_id: '',
        user_id: 1,
        user_type: 1,
        commentObj: {
          show: false,
          curFeed: {},
          placeholder: '发评论...'
        },
        replyObj: {
        },
        fromObj: {
          from: 'group_feeds',
          id: ''
        },
        showLoading: false,
        isRequest: false,
        applyStatus: 0,
        isSchool: 0,
        requestFlag: false,
        videoFlag: false,
        openSafariModalFlag: false
      }
    },
    computed: {
      length () {
        return this.feeds.length
      }
    },
    watch: {
      'popApplyStatus': 'changeApplyStatus'
    },
    methods: {
      openVideo (video) {
        console.log('什么意思')
        console.log(video)
        if (video.isLine === 0) {
          console.log(111)
          let videoDom = $('<video width="100" webkit-playsinline  controls loop="loop" autoplay="true" poster="' + video.cover + '" preload="none" src="' + video.url + '"></video>')
          let dataConfig = {
            'mediaTitle': video.name,
            'autoplay': true
          }
          let dataConfigStr = JSON.stringify(dataConfig)
          videoDom.attr('data-config', dataConfigStr)
          videoDom.appendTo('#video-box')
          console.log(videoDom)
          /*eslint-disable */
          zymedia('video')
          /*eslint-enable */
          this.videoFlag = true
        }
        else {
          window.open(video.url)
        }
      },
      closeVideo () {
        $('#video-box').empty()
        this.videoFlag = false
      },
      closeOpenSafariModal () {
        this.openSafariModalFlag = false
      },
      changeApplyStatus () {
        this.applyStatus = 1
      },
      apply (id) {
        if (this.applyStatus === 1) {
          return
        }
        this.applyData.group_id = id
        this.applyData.show = true
      },
      // 点赞取消赞
      dolike (feed) {
        this.$http.post('feeds/' + feed.id + '/likes').then(function (data) {
          if (data.data.success) {
            if (feed.likes.love) { // 已经赞了的
              feed.likes.total_count = feed.likes.total_count - 1
            }
            else {  // 没赞的
              feed.likes.total_count = feed.likes.total_count + 1
            }
            feed.likes.data = data.data.likeUsers && data.data.likeUsers.split(',') || []
            feed.likes.love = !feed.likes.love
            $.toast(data.data.message)
          }
          else {
            $.toast('操作未成功,请稍后再试。')
          }
        })
      },
      // 滚动加载更多
      loadMore () {
        if (this.loading) {
          return
        }
        if (Math.ceil(this.feeds.speak / this.per_page) === this.cur_page) {
          $.toast('已经是最后一页了', 500)
          this.loading = true
          return
        }
        this.loading = true
        let scroller = $('.card-container')
        var that = this
        loader.show()
        setTimeout(() => {
          that.isRequest = true
          that.$http.get('group_topic_detail', {topic_id: that.topic_id, page: that.cur_page + 1, per_page: that.per_page})
          .then(function (data) {
            that.feeds.data = [...that.feeds.data, ...data.data.data]
            that.cur_page = that.cur_page + 1
            that.isRequest = false
            let scrollTop = scroller[0].scrollHeight - scroller.height() - 20
            scroller.scrollTop(scrollTop)
            that.loading = false
            loader.hide()
          })
        }, 1000)
      },
      showComment (index) {
        this.commentObj.show = true
        this.commentObj.curFeed = this.feeds.data[index]
        this.commentObj.reply = false
      },
      newTopicFeed () {
        this.$route.router.go({name: 'push', query: {group_id: this.feeds.group_id, topic_name: this.feeds.name}})
      },
      allComments (id, index) {
        // 话题详情, 获取指定的发言的评论
        this.$http.get(`feeds/${id}/comments`).then(({data}) => {
          this.feeds.data[index].comments.data = data
          // this.data.curFeed.comments.data = data
        })
      }
    },
    components: {
      // VLayer,
      Pswb,
      Store,
      Comment,
      vHeader,
      BarItem,
      Bar,
      applyPop,
      Attach
    }
  }
</script>
