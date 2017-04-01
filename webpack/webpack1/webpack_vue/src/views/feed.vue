<template>


  <bar v-if="user_role !== 4 && requestFlag">
    <bar-item path="" label="赞" icon="icon-zan" @click="dolike(feed.id)"  :class="{ 'me-like': feed.likes && feed.likes.love}"></bar-item>
    <bar-item path="" label="评论" icon="icon-pinglun" @click="showComment()"></bar-item>
    <bar-item path="" label="转发" icon="icon-zhuanfa" @click="showRetweet()"></bar-item>
  </bar>
  <bar v-if="user_role === 4 && isSchool !== 1 && requestFlag">
    <bar-item label="申请入群" icon="icon-bianxie" class="green" :class="{'color-666': applyStatus === 1}" @click="apply(group_id)"></bar-item>
  </bar>
  <!-- <v-header :title="header.title" :back="header.back" :option="header.option"></v-header> -->
  <header class="bar bar-nav" style="z-index: 99;">
    <a class="button button-link button-nav pull-left" @click="gowhere()">
      <span class="icon icon-left"></span>
    </a>
    <h1 class="title">动态详情</h1>
  </header>
  <div class="container">
    <div class="content">


      <div class="card-container">
        <div class="card facebook-card" v-if="feed.user">

          <div class="card-header clearfix">
            <div class="facebook-avatar">
              <a v-link="{ name: 'profile', params: { id: feed.user.id }}">
                <img v-bind:src="feed.user.profile_image_url">
              </a>
            </div>


            <!-- <div class="facebook-name">{{feed.user.name}}</div>
            <div class="facebook-date">{{feed.created_at.replace('T',' ').replace('Z','')}}</div> -->

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

          </div>


          <div class="card-content">

            <div v-show="feed.text && feed.text !== ''" class="feed-text">
              {{{feed.text}}}
            </div>

            <div class="feed-retweeted" v-if="feed.retweeted">
              <div class="feed-retweeted-content">

                <span class="feed-retweeted-name">{{feed.retweeted.user.name}}</span>：
                <span v-show="feed.retweeted.text && feed.retweeted.text !== ''" class="feed-retweeted-text">{{{feed.retweeted.text}}}</span>

              </div>

              <div class="feed-retweeted-imgs">
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
                  <img class="video-cover-icon" src="../assets/img/icon_img/video.png"/>
                </div>
              </div>
            </div>

            <div v-show="feed.pics && feed.pics.length > 0" class="feed-imgs row" type="caption" style="padding:.5rem; margin-left: 0px;">
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
                <li v-for="link in feed.links"><a class="feed-link" href="{{link.url}}">{{link.name}}</a></li>
              </ul>
            </div>
            <!-- 附件下载组件 -->
            <attach :files="feed.others" :open-safari-modal-flag.sync="openSafariModalFlag"></attach>
            <!-- 上传视频调用vue-vedio 插件 -->
            <div class="no-line-vedio clearfix">
              <div class="video-box fl" v-for="video in feed.videos" @click="openVideo(video)">
                <img class="video-cover" :src="video.cover"/>
                <img class="video-cover-icon" src="../assets/img/icon_img/video.png"/>
              </div>
            </div>

            <div class="like-comment">

              <div class="clearfix" v-show="feed.role !== 4">
                <div class="pull-right like-comment-counts">
                  <a class="iconfont-jysq icon-zan1 text-href" :class="{ 'me-like': feed.likes.love}" @click="dolike(feed)">{{feed.likes.total_count}}</a>
                  <a class="iconfont-jysq icon-pinglun1 text-href" :class="{'me-like': feed.comments.total_count > 0}" @click="showComment()">{{feed.comments.total_count}}</a>
                </div>
              </div>


              <div class="content-padded">
               <span class="iconfont-jysq icon-zan1 who-like" v-if="feed.likes.total_count">
                  <template v-for="liker in feed.likes.data">
                    <span><a href="">{{liker.name || liker}}</a></span>
                     <template v-if="$index != feed.likes.data.length-1">,</template>
                  </template>
               </span>
              </div>

              <ul class="what-comment">

                <template v-for="comment in feed.comments.data">
                  <li class="clearfix">
                    <a v-link="{ name: 'profile', params: { id: comment.user.id }}"><img :src="comment.user.profile_image_url" alt="" class="pull-left"></a>
                    <div style="margin-left:3rem" @click="showComment(comment)">
                      <div class="active-color">{{comment.user.name}}<span class="fr feed-detail-connemt-date">{{comment.created_at}}</span></div>
                      <div class="comment-text2">{{comment.text}}</div>
                      <div><span v-if="comment.reply">回复:{{comment.reply.name}}</span></div>
                    </div>
                  </li>
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
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
  <div class="retweet-area card comments-area" v-show="retweetFlag">
    <div class="card-content"><textarea placeholder="转发留下你的评论" v-model="retweetText"></textarea></div>
    <div class="card-footer">
      <a href="javascript:void(0)" @click="showRetweet()">取消</a>
      <a class="push-comment-btn"   href="javascript:void(0)" @click="pushRetweet()">转发</a></div>
  </div>
  <div class="open-safari-modal" v-show="openSafariModalFlag" @click="closeOpenSafariModal()">
    <img src="../assets/img/open-safari.png" alt="">
  </div>

  <!-- jinzk 修改评论页 -->
  <comment :data.sync="commentObj" :reply.sync="replyObj" :from="fromObj"></comment>
  <pswb></pswb>
  <apply-pop :data="applyData" :status.sync="applyStatus"></apply-pop>
  <div class="video-player-box" v-show="videoFlag">
    <span class="close-video" @click="closeVideo()">×</span>
    <div id="video-box"></div>
  </div>
</template>

<style scoped>
  @import '../assets/js/zyMedia/zy.media.min.css';
  #video-box {
    height: 100%;
    width: 100%;
  }
  .color-666 {
    color: #e7e7e7 !important;
  }
  /* jinzk */
  .group-feeds-date {
    float: right;
    color: #ccc;
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
    white-space: normal;
  }
  .text-href {
    font-size: 0.9rem;
  }
  .feed-detail-connemt-date {
    padding-right: 1rem;
    color: #666;
  }
</style>

<script>

  import Bar from './../components/Bar'
  import BarItem from './../components/BarItem'
  import Pswb from '../components/Pswb'
  import Comment from '../components/Comment'
  import Vheader from './common/header'
  import Store from '../assets/js/store.js/src/store.js'
  import applyPop from './common/applyPop'
  import Attach from './common/Attach'
  require('../assets/js/zyMedia/zy.media.min.js') // eslint-disabled-line
  import $ from 'zepto'

  export default {
    route: {
      data ({to, next}) {
        $('#video-box').empty()
        this.videoFlag = false
        this.group_id = to.query.group_id
        this.user_role = -1
        if (Store.get('groupInfo')) {
          this.applyStatus = Store.get('groupInfo').apply
          this.isSchool = Store.get('groupInfo').new_gropu_type === 'isSchool' ? 1 : 0
        }
        let fid = to.params.id
        $.showPreloader('加载中')
        return this.$http.get('feeds/' + fid)
            .then(({data}) => {
              this.$set('feed', data)
              this.$set('fid', fid)
              this.$set('retweetFlag', false)
              this.$set('user_role', data.role)
              this.requestFlag = true
              $.hidePreloader()
            })
      }
    },
    ready () {
      $.init()
    },
    data () {
      return {
        header: {
          title: '动态详情',
          back: function () {
            this.$route.router.go({path: '/feeds', replace: true})
          }.bind(this),
          option: {
            text: '',
            go: {
              route: ''
            },
            fn: () => {},
            icon: ''
          }
        },
        feed: {},
        fid: {},
        user_role: 1,
        commentText: undefined,
        retweetFlag: false,
        retweetText: undefined,
        group_id: '',
        applyData: {
          show: false,
          group_id: ''
        },
        curcomment: {},
        // jinzk
        commentObj: {
          show: false,
          curFeed: {},
          placeholder: '',
          reply: false
        },
        replyObj: {},
        fromObj: {
          from: 'feed',
          id: ''
        },
        applyStatus: 0,
        isSchool: 0,
        requestFlag: false,
        openSafariModalFlag: false,
        videoFlag: false
      }
    },
    watch: {
      'applyStatus': 'changeApplyStatus'
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
      changeApplyStatus () {
        this.applyStatus = 1
      },
      // 申请入群
      apply (id) {
        if (this.applyStatus === 1) {
          return
        }
        this.applyData.group_id = id
        this.applyData.show = true
      },
      gowhere () {
        window.history.back()
      },
      dolike (feed) {
        this.$http.post('feeds/' + this.fid + '/likes?state=detail').then(function (data) {
          if (data.data.success) {
            if (this.feed.likes.love) { // 已经赞了的
              this.feed.likes.total_count = this.feed.likes.total_count - 1
            }
            else {  // 没赞的
              this.feed.likes.total_count = this.feed.likes.total_count + 1
            }
            this.feed.likes.data = data.data.likeUsers && data.data.likeUsers.split(',') || []
            this.feed.likes.love = !this.feed.likes.love
            $.toast(data.data.message)
          }
          else {
            $.toast('操作未成功,请稍后再试。')
          }
        })
      },
      showComment (curcomment) {
        // jinzk 修改
        this.commentObj.show = true
        this.commentObj.curFeed = this.feed
        this.fromObj.id = this.fid
        // 判断是不是回复，是回复带去回复的obj
        if (curcomment) {
          this.replyObj = curcomment
          this.commentObj.placeholder = `回复:${curcomment.user.name}`
          this.commentObj.reply = true
        }
        else {
          this.replyObj = {}
          this.commentObj.placeholder = `发评论...`
          this.commentObj.reply = false
        }
      },
      showRetweet () {
        this.retweetFlag = !this.retweetFlag
      },
      pushRetweet () {
        this.$http.post('feeds/' + this.fid + '/repost', { text: this.retweetText}).then(({data}) => {
          if (data.success) {
            $.toast(data.message, 900)
            setTimeout(() => {
              this.retweetText = undefined
              this.$route.router.go('/feeds')
            }, 1000)
            this.retweetFlag = false
          }
          else {
            $.toast('转发失败,请稍后再试')
          }

        })
      }
    },
    components: {
      Bar,
      BarItem,
      Pswb,
      Comment,
      Vheader,
      Store,
      applyPop,
      Attach
    }
  }
</script>
