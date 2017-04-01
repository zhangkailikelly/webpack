<template>
      <header class="bar bar-nav pro-header">
        <a class="button button-link button-nav pull-left" v-link="{path: '/about', replace: true}">
          <span class="icon icon-left"></span>
        </a>
        <h1>个人资料 </h1>

        <a @click="follow(profile.id)" :class="{'x-hidden':isSelf}">
          <span v-if="profile.isfollow">取消关注</span>
          <span v-else>加关注</span>
        </a>

      </header>

      <section class="profile-wrapper" :style="{backgroundImage: 'url('+profile.profile_back_url +')'}" >
          <div class="clearfix profile-content">
            <img :src="profile.profile_image_url" alt="" class="pro-avatar pull-left">
            <div class="pro-info">{{profile.name}}<br><span class="pro-school">{{profile.school}}</span></div>
          </div>
      </section>

      <section class="do-shit">
        <a  class="to-timeline" v-link="{ name: 'homepage', params: { id: profile.id }}">
        个人主页: <span class="newest-post">{{profile.newest_post && profile.newest_post.split('').slice('0',7).join('')}}
        <template v-if="profile.newest_post && profile.newest_post.length>7">
        ...
        </template>
        <template v-if="!profile.newest_post>7">
        暂无动态
        </template>
        </span>
          <span class="icon icon-right pull-right"></span>
        </a>

      </section>
</template>


<style>
  .page, .page-group {
    background: #fff;
  }
  .pro-header {
    display: flex;
    justify-content: space-between;
    height: 2rem;
    background: #1cbd9d;
    color: #fff;
  }
  .pro-header::after {
    height: 0;
  }
  .pro-header .l-icon-prev {
    color: #fff;
  }
  .pro-header h1 {
    margin: 0;
    font-size: 1rem;
    font-weight: 500;
    line-height: 2.2rem;
    margin-left: 2rem
  }
  .pro-header a {
    color: #fff;
    line-height: 2.2rem;
  }
  .pro-avatar {
    width: 3rem;
    height: 3rem;
    margin-right: 1rem;
  }

  .profile-wrapper {
    position: relative;
    background-color: #1cbd9d;
    color:#fff;
    height: 10rem;
    margin-top: -.1rem;
  }
  .pro-info {
    height: 3rem;
    line-height: 1.5rem;
  }
  .pro-school {
    color: #3d4145;
  }
  .profile-content {
    position: absolute;
    bottom: -1.5rem;
    left: 1.5rem;
    width: 100%;
  }

  .do-shit {
    margin-top: 3rem;
    margin-left: 1rem;
  }
  .to-timeline {
    color: #3d4145;
  }
  .to-timeline  .l-icon-next {
    float: right;
    margin-right: 1rem;
    font-size: 1rem;
    color: #9a9696;
    margin-top: -.2rem;
  }
  .newest-post {
    margin-left: 1rem;
  }
  .x-hidden {
    opacity: 0;
  }
</style>

<script>

  import $ from 'zepto'

  export default {
    route: {
      data ({to, next}) {
        this.$set('isSelf', false)
        return this.$http.get('profile/' + to.params.id).then(({data}) => {
          console.log(11111)
          if (!data.newest_post) {
            data.newest_post = '暂无动态'
          }
          this.$set('profile', data)
          // 处理得不好，暂时先这样
          this.$http.get('who').then(({data}) => {
            if (data.id === this.profile.id) {
              this.$set('isSelf', true)
            }
          })
        })
      }
    },
    ready () {
      $.init()
    },
    data () {
      return {
        profile: {},
        isSelf: false
      }
    },
    methods: {
      follow: function (id) {
        this.$http.post('following/' + id).then(({data}) => {
          console.log(data)
          console.log
          if (data.success) {
            this.profile.isfollow = !this.profile.isfollow
          }
          $.toast(data.message)
        })
      }
    }
  }
</script>
