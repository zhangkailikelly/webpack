<template>
  <v-header :title="header.title" :back="header.back" :option="header.option" :showleft="header.showleft"></v-header>
  <div class="buttons-tab">
    <a v-link="{name: 'group_f', activeClass: 'active', query: {group_id: this.group_id}}" class="button">群组</a>
    <a v-link="{name: 'topic_f', activeClass: 'active', query: {group_id: this.group_id}}" class="button">话题</a>
    <a v-link="{name: 'speak_f', activeClass: 'active', query: {group_id: this.group_id}}" class="button">发言</a>
    <a v-link="{name: 'teacher_f', activeClass: 'active', query: {group_id: this.group_id}}" class="button">教师</a>
  </div>
  <div class="card-container content" style="bottom: 0rem; margin-top: 2.2rem;"  v-infinite-scroll="loadMore" distance="55" v-pull-to-refresh="refresh">
    <V-layer></V-layer>
    <div v-if="feeds.total_count">
      <div class="card facebook-card" v-for="feed in feeds.data" track-by="$index">
        <div class="card-header clearfix">
          <div class="facebook-avatar">
            <a v-link="{ name: 'profile', params: { id: feed.user.id }}">
              <img v-bind:src="feed.user.profile_image_url">
            </a>
          </div>
          <a v-link="{ name: 'feeds', params: { id: feed.id}}">
            <div class="facebook-name">{{feed.user.name}}</div>
            <div class="facebook-date">{{feed.created_at.replace('T',' ').replace('Z','')}}</div>
          </a>
        </div>
        <div class="card-content">

          <!-- <a v-show="feed.text && feed.text == '' && feed.text.substr(0, feed.text.length - 6) != ''" v-link="{ name: 'feeds', params: { id: feed.id }}" class="text-href">
            <div class="feed-text">
              {{{feed.text}}}
            </div>
          </a> -->
          <a v-show="feed.text && feed.text !== ''" v-link="{ name: 'feeds', params: { id: feed.id }}" class="text-href">
            <div class="feed-text">
              {{{feed.text}}}
            </div>
          </a>
          <div class="feed-retweeted" v-if="feed.retweeted">
            <div class="feed-retweeted-content">
              <a v-link="{ name: 'feeds', params: { id: feed.id }}" class="text-href">
                <span class="feed-retweeted-name">{{feed.retweeted.user.name}}</span>：
                <span v-show="feed.retweeted.text && feed.retweeted.text !== ''" class="feed-retweeted-text">{{{feed.retweeted.text}}}</span>
              </a>
            </div>

            <div v-show="feed.retweeted.pics.length && feed.retweeted.pics.length > 0" class="feed-retweeted-imgs row">
              <div itemscope itemtype="http://schema.org/ImageGallery" v-photo-swipe>
                <figure  class="thumb-img col-33" itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject"  v-for="album in feed.retweeted.pics" >
                  <a :href="album.original_url" itemprop="contentUrl" data-size="{{album.width}}x{{album.height}}">
                      <img :src="album.thumb_url" itemprop="thumbnail" :alt="album.name" />
                  </a>
                </figure>
              </div>
            </div>
            <div class="list-block" v-show="feed.retweeted.links && feed.retweeted.links.length > 0">
              <ul>
                <li v-for="link in feed.retweeted.links"><a class="feed-link" href="{{link.url}}">{{link.name}}</a></li>
              </ul>
            </div>
            <!-- 附件下载组件 -->
            <attach :files="feed.retweeted.others" :open-safari-modal-flag.sync="openSafariModalFlag" :is-retweeted="1"></attach>
            <!-- 视频连接跳出去吧 -->
            <!-- 上传视频调用vue-vedio 插件 -->
            <div v-show="feed.retweeted.videos && feed.retweeted.videos.length > 0" class="no-line-vedio clearfix">
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
          <div class="list-block feeds-attach" v-show="feed.links && feed.links.length > 0" >
            <ul>
              <li v-for="link in feed.links"><a class="feed-link" target="_blank" href="{{link.url}}">{{link.name}}</a></li>
            </ul>
          </div>
          <!-- 附件下载组件 -->
          <attach :files="feed.others" :open-safari-modal-flag.sync="openSafariModalFlag"></attach>
          <!-- 视频连接跳出去吧 -->
          <!-- 上传视频调用vue-vedio 插件 -->
          <div v-show="feed.videos && feed.videos.length > 0" class="no-line-vedio clearfix">
            <div class="video-box fl" v-for="video in feed.videos" @click="openVideo(video)">
              <img class="video-cover" :src="video.cover"/>
              <img class="video-cover-icon" src="./../../assets/img/icon_img/video.png"/>
            </div>
          </div>

          <div class="like-comment">
            <div class="clearfix">
              <div class="pull-right like-comment-counts">
                <a class="iconfont-jysq icon-zan1 text-href" :class="{ 'me-like': feed.likes.love}" @click="dolike(feed, feed.role)">{{feed.likes.total_count}}</a>
                <a class="iconfont-jysq icon-pinglun1 text-href" :class="{ 'me-like': feed.likes.comments.total_count}" @click="showComment($index)">{{feed.comments.total_count}}</a>
              </div>
            </div>
            <a v-link="{ name: 'feeds', params: { id: feed.id }}" class="text-href">
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
                <!-- <img style="width:5rem;" src="../assets/img/adv.jpg"/> -->
                <div v-if="comment.pic.original_url" class="feed-imgs row" type="caption" style="padding:.5rem">
                  <div itemscope itemtype="http://schema.org/ImageGallery" v-photo-swipe>
                    <figure  class="thumb-img col-33" itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject" >
                      <a :href="comment.pic.original_url" itemprop="contentUrl" data-size="{{comment.pic.width}}x{{comment.pic.height}}">
                          <img :src="comment.pic.thumb_url" itemprop="thumbnail" :alt="comment.pic.name" />
                      </a>
                    </figure>
                  </div>
                </div>
              </template>
            </ul>
            <div class="text-center pb-5 more-comments" v-if="feed.comments.total_count>3">
              <a v-link="{ name: 'feeds', params: { id: feed.id }}">查看全部评论（{{feed.comments.total_count}}）</a>
            </div>
            </a>
          </div>
        </div>
      </div>

    </div>
  </div>
   <!-- 评论pop -->
  <comment :data.sync="commentObj" :reply.sync="replyObj" :from="fromObj"></comment>
  <pswb></pswb>
  <div class="open-safari-modal" v-show="openSafariModalFlag" @click="closeOpenSafariModal()">
    <img src="./../../assets/img/open-safari.png" alt="">
  </div>
  <div class="video-player-box" v-show="videoFlag">
    <span class="close-video" @click="closeVideo()">×</span>
    <div id="video-box"></div>
  </div>
</template>
<style scoped>
  /*jinzk*/
  @import './../../assets/js/zyMedia/zy.media.min.css';
  #video-box {
    height: 100%;
    width: 100%;
  }
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
    max-height: 4rem;
    width: 100%;
    margin-top: 2.5rem;
  }
  .buttons-tab {
    margin-top: 2.5rem;
    z-index: 100000;
  }
  .buttons-tab .button.active {
    color: #1dbc97;
    border-color: #1dbc97;
  }
  ul {
    margin-top: 0rem;
  }
  .l-icon:before {
    margin-right: .2rem;
  }
  .comments-area {
    position: absolute;
    bottom: 0;
    z-index: 11;
    left: 0;
    right: 0;
  }
  .comments-area textarea {
    width: 100%;
    height: 6rem;
    padding: .5rem;
  }
  .comments-area .card-content {
    border: 2px solid #f9f9f9;
  }
  .text-href {
    font-size: 0.9rem;
  }
</style>
<script>
  import Store from '../../assets/js/store.js/src/store.js'
  import $ from 'zepto'
  import applyPop from '../common/applyPop'
  import vHeader from '../common/header'
  import VLayer from '../../components/PullToRefreshLayer'
  import Pswb from '../../components/Pswb'
  import {loader} from '../../util/util'
  import Comment from '../../components/Comment'
  import Attach from '../common/Attach'
  require('./../../assets/js/zyMedia/zy.media.min.js') // eslint-disabled-line
  export default {
    route: {
      data ({to, next}) {
        this.isRequest = false
        this.loading = false
        this.cur_page = 1
        this.group_id = to.query.group_id
        this.$set('commentFlag', false)
        $.showPreloader('加载中')
        this.$http.get('finds?type=essay', {page: 1, per_page: this.per_page})
            .then(({data}) => {
              this.$set('feeds', data)
              this.total_count = data.total_count
              $.hidePreloader()
              $($('.tab-item')[3]).addClass('active')
            }, ({data, status}) => {
              $.alert(data.message || '加载数据失败')
            })
      }
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
        // header end
        feeds: {},
        cur_page: 1,
        per_page: 10,
        total_count: 0,
        loading: false,
        commentFlag: false,
        unread: false,
        willCommentFeedId: undefined,
        commentText: undefined,
        // jinzk
        commentObj: {
          show: false,
          curFeed: {},
          id: 0,
          total: 0,
          placeholder: '发评论...'
        },
        replyObj: {
        },
        fromObj: {
          from: 'index',
          id: ''
        },
        isRequest: false,
        openSafariModalFlag: false,
        videoFlag: false
      }
    },
    computed: {
      length () {
        return this.feeds.length
      }
    },
    methods: {
      openVideo (video) {
        if (video.isLine === 0) {
          let videoDom = $('<video width="100" webkit-playsinline  controls loop="loop" autoplay="true" poster="' + video.cover + '" preload="none" src="' + video.url + '"></video>')
          let dataConfig = {
            'mediaTitle': video.name,
            'autoplay': true
          }
          let dataConfigStr = JSON.stringify(dataConfig)
          videoDom.attr('data-config', dataConfigStr)
          videoDom.appendTo('#video-box')
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
      // 上拉刷新
      refresh () {
        setTimeout(() => {
          $('.card-container').scrollTop(0)
          $.pullToRefreshDone('.pull-to-refresh-content')
          this.$http.get('feeds', {page: 1, per_page: this.per_page})
            .then(function (data) {
              this.feeds = data.data
            })
        }, 1500)
      },
      // 点赞取消赞
      dolike (feed, role, id) {
        // 如果不是群组发言或者是群组发言并且是群成员
        if (!role || role !== 4) {
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
              $.toast('操作未成功,请稍后再试。', 100)
            }
          })
        }
        else if (role === 4) {
          $.toast('请先加入本群', 100)
        }
      },
      // 滚动加载更多
      loadMore () {
        if (this.loading || this.isRequest) {
          return
        }
        if (Math.ceil(this.total_count / this.per_page) <= this.cur_page) {
          $.toast('已经是最后一页了', 100)
          this.loading = true
          return
        }
        this.loading = true
        let scroller = $('.card-container')
        var that = this
        loader.show()
        setTimeout(() => {
          that.isRequest = true
          that.$http.get('finds?type=essay', {page: that.cur_page + 1, per_page: that.per_page})
              .then(function (data) {
                that.feeds.data = [...that.feeds.data, ...data.data.data]
                that.cur_page = that.cur_page + 1
                that.isRequest = false
                let scrollTop = scroller[0].scrollHeight - scroller.height() - 20
                scroller.scrollTop(scrollTop)
                this.loading = false
                loader.hide()
              }, ({data, status}) => {
                $.alert(data.message || '加载数据失败')
              })
        }, 1000)
      },
      showComment (index) {
        this.commentObj.show = true
        this.commentObj.curFeed = this.feeds.data[index]
        this.commentObj.reply = false
      }
    },
    components: {
      Store,
      applyPop,
      vHeader,
      VLayer,
      Pswb,
      Comment,
      Attach
    }
  }
</script>
