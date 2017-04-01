<template>
  <header>
    <div class="header-wrapper">
      <h3 style="text-align:center;padding-top: .5rem">
        我
      </h3>
      <div class="clearfix">
        <a  v-link="{ name: 'homepage', params: { id: user.id }}">
          <img :src="user.profile_image_url" alt="" class="pull-left">
        </a>
        <h4 class="pull-left">{{user.name}}</h4>
        <span class="icon icon-right  pull-right"  v-link="{ path: '/account', replace: true}"></span>
      </div>
    </div>

  </header>

  <div class="content-padded">
    <div class="list-block">
      <ul>
        <li class="item-content item-link">
          <a v-link="{path: '/followers', replace: true}" class="li-href">
          <div class="item-media"><i class="icon icon-f7"></i></div>
          <div class="item-inner">

            <div class="item-title l-icon l-icon-followers pr-5">我的关注</div>
            <div class="item-after"></div>
          </div>
          </a>
        </li>
        <li class="item-content item-link">
          <a v-link="{path: '/followings', replace: true}" class="li-href">
          <div class="item-media"><i class="icon icon-f7"></i></div>
          <div class="item-inner">
            <div class="item-title  l-icon l-icon-following  pr-5">我的粉丝</div>
            <div class="item-after"></div>
          </div>
            </a>
        </li>
        <li class="item-content item-link">
          <a v-link="{path: '/albums', replace: true}" class="li-href">
          <div class="item-media"><i class="icon icon-f7"></i></div>
          <div class="item-inner">
            <div class="item-title  l-icon l-icon-xiangce  pr-5">我的相册</div>
            <div class="item-after"></div>
          </div>
            </a>
        </li>
      </ul>
    </div>
  </div>
</template>


<style scoped>
  header {
    background-color: #1cbd9d;
    color: #fff;
  }
  .header-wrapper {
    padding:  0 1rem;
  }
  .header-wrapper img {
    width: 2.5rem;
    height: 2.5rem;
    margin-right: 1rem;
  }
  .l-icon-next {
    font-size: 1.5rem;
    color: #fff;
    /*padding-left: 8rem;*/
    padding-top: .5rem;
  }
  .list-block .item-content {
    padding-left: 0;
  }
  .pr-5:before{
    padding-right: .5rem;
  }
  .li-href {
    color: inherit;
    width: 95%;
  }

  h3 {
    margin-top: 0;
  }

  .list-block ul {
    color: #5f646e;
  }
</style>
<script>

  export default {
    route: {
      data ({to, next}) {
        return this.$http.get('who').then(({data}) => {
          console.log(data)
          this.$set('user', data)
        })
      }
    },
    data () {
      return {
        user: {}
      }
    },
    methods: {
    }
  }
</script>
