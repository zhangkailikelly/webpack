<template>
  <!-- <div class="container"> -->
    <div class="buttons-tab">
      <a class="button" v-link="{path: '/list', replace: true}">我的群</a>
      <a class="button active">群动态</a>
      <span class="group-feeds-icon fl" @click="buildGroup()">+</span>
    </div>
    <div class="content" v-infinite-scroll="loadMore" distance="55" v-pull-to-refresh="refresh">
      <!-- <div class="card-container"> -->
        <V-layer></V-layer>
        <div v-if="feeds.total_count">
          <div class="card facebook-card" v-for="feed in feeds.data" track-by="$index">
            <div class="card-header clearfix">
              <div class="facebook-avatar">
                <a v-link="{ name: 'profile', params: { id: feed.user.id }}">
                  <img v-bind:src="feed.user.profile_image_url">
                </a>
              </div>
              <a v-link="{ name: 'detail', params: { id: feed.id}}">
                <div class="facebook-name">{{feed.user.name}}
                  <div class="group-feeds-date">{{feed.created_at.replace('T',' ').replace('Z','')}}</div>
                </div>
                <div class="facebook-date"><span style="color: #5f646e;">发表于: </span><a href="javascript:void(0);">{{feed.group}}</a></div>
              </a>
            </div>
            <div class="card-content">

              <a v-show="feed.text && feed.text !== ''" v-link="{ name: 'detail', params: { id: feed.id }}" class="text-href">
                <div class="feed-text">
                  {{{feed.text}}}
                </div>
              </a>
              <div class="feed-retweeted" v-if="feed.retweeted">
                <div class="feed-retweeted-content">
                  <a v-link="{ name: 'detail', params: { id: feed.id }}" class="text-href">
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
                <div class="clearfix">
                  <div class="pull-right like-comment-counts">
                    <a class="iconfont-jysq icon-zan1 text-href" :class="{'me-like': feed.likes.love}" @click="dolike(feed)">{{feed.likes.total_count}}</a>
                    <a class="iconfont-jysq icon-pinglun1 text-href" :class="{'me-like': feed.comments.total_count > 0}" @click="showComment($index)">{{feed.comments.total_count}}</a>
                  </div>
                </div>
                <a v-link="{ name: 'detail', params: { id: feed.id }}" class="text-href">
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
                  <a v-link="{ name: 'detail', params: { id: feed.id }}">查看全部评论（{{feed.comments.total_count}}）</a>
                </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
  <pswb></pswb>
  <!-- 评论pop -->
  <comment :data.sync="commentObj" :reply.sync="replyObj" :from="fromObj"></comment>
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
  .me-like {
    color: #6BBA9C;
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
  }
  /* jinzk */
  .group-feeds-date {
    float: right;
    color: #ccc;
  }
  .index {
    margin-top: -0.75rem;
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
  .text-href {
    font-size: 0.9rem;
  }
  .feed-imgs {
    margin-left: 0rem;
  }
</style>
<script>
  import VLayer from '../../components/PullToRefreshLayer'
  import Pswb from '../../components/Pswb'
  import {loader} from '../../util/util'
  import Store from '../../assets/js/store.js/src/store.js'
  import Attach from '../common/Attach'
  require('./../../assets/js/zyMedia/zy.media.min.js') // eslint-disabled-line
  import $ from 'zepto'

  // jinzk 修改评论家图片
  import Comment from '../../components/Comment'
  export default {
    route: {
      data ({to, next}) {
        $('#video-box').empty()
        this.videoFlag = false
        this.isRequest = false
        this.loading = false
        this.cur_page = 1
        this.group_id = to.query.group_id
        this.userInfo = Store.get('userInfo')
        this.user_id = Store.get('userInfo').id
        this.user_type = Store.get('userInfo').type
        this.$set('commentFlag', false)
        $.showPreloader('加载中')
        this.$http.get(`all_group_feeds`, {
          group_id: this.group_id,
          page: 1,
          per_page: this.per_page
        }).then(({data}) => {
          $($('.tab-item')[1]).addClass('active')
          this.$set('feeds', data)
          this.total_count = data.total_count
          $.hidePreloader()
        })
      }
    },
    ready () {
      $.init()
      $($('.tab-item')[1]).addClass('active')
    },
    data () {
      return {
        feeds: {},
        cur_page: 1,
        per_page: 10,
        total_count: 0,
        loading: false,
        commentFlag: false,
        // unread: false,
        willCommentFeedId: undefined,
        commentText: undefined,
        // jinzk
        group_id: '',
        user_id: 1,
        user_type: [],
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
          from: 'group_feeds',
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
      // 上拉刷新
      refresh () {
        setTimeout(() => {
          $('.card-container').scrollTop(0)
          $.pullToRefreshDone('.pull-to-refresh-content')
          this.$http.get('all_group_feeds', {page: 1, per_page: this.per_page})
            .then(function (data) {
              this.feeds = data.data
            })
        }, 1500)
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
          that.$http.get('all_group_feeds', {group_id: that.group_id, page: that.cur_page + 1, per_page: that.per_page})
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
      }
    },
    components: {
      VLayer,
      Pswb,
      Store,
      Comment,
      Attach
    }
  }
</script>
