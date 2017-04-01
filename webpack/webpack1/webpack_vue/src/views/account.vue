<template>
  <header class="bar bar-nav">
    <a class="button button-link button-nav pull-left" v-link="{path: '/about', replace: true}">
      <span class="icon icon-left"></span>
    </a>
    <h1 class="title">账号信息</h1>
  </header>

  <div class="content-padded">
    <div class="list-block">
      <ul>
        <li class="item-content">
          <div class="item-media"><i class="icon icon-f7"></i></div>
          <div class="item-inner">
            <div class="item-title">头像</div>
            <div class="item-after">
              <img v-bind:src="account.profile_image_url" alt="">
            </div>
          </div>
        </li>
        <li class="item-content">
          <div class="item-media"><i class="icon icon-f7"></i></div>
          <div class="item-inner">
            <div class="item-title">姓名</div>
            <div class="item-after">{{account.name}}</div>
          </div>
        </li>

        <li class="item-content">
          <div class="item-media"><i class="icon icon-f7"></i></div>
          <div class="item-inner">
            <div class="item-title">学校</div>
            <div class="item-after">{{account.school}}</div>
          </div>
        </li>


      </ul>
    </div>
  </div>
</template>

<style scoped>
  .page,
  .page-group {
    background-color: #fff;
  }
  .list-block {
    margin-top: 3rem;
  }
  .item-after img {
    width: 2.5rem;
    height: 2.5rem;
  }
  .list-block .item-after {
    max-height: inherit;
  }
  .title {
    background: #1cbd9d;
    color: #fff
  }
  .bar .button-link {
    color: #fff
  }
</style>

<script>

  import $ from 'zepto'

  export default {
    route: {
      data ({to, next}) {
        return this.$http.get('who').then(({data}) => {
          console.log(data.data)
          this.$set('account', data)
        })
      }
    },
    ready () {
      $.init()
    },
    data () {
      return {
        account: {}
      }
    },
    methods: {
    }
  }
</script>
