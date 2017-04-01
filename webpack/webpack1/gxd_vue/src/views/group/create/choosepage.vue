<template>
  <header class="bar bar-nav">
    <button class="button button-link button-nav pull-left"  v-link="{path: '/list'}">
      <span class="icon icon-left"></span>
    </button>
    <h1 class="title">创建群</h1>
  </header>
  <!-- 群选项部分 -->
  <div class="content">
    <div class="list-block">
      <ul>
        <li class="item-content item-link" v-link="{name: 'create', query: {type: 'subject',user_type: user_type}}">
          <div class="item-inner">
            <div class="item-title">
              <img class="fl" src="../../../assets/img/icon_img/create-subject.jpg">
              <!-- <span class="fl type-name">创建学科群</span> -->
            </div>
            <div class="item-after">创建学科群</div>
          </div>
        </li>
        <li class="item-content item-link" v-link="{name: 'create', query: {type: 'ordinary'}}">
          <div class="item-inner">
            <div class="item-title">
              <img class="fl" src="../../../assets/img/icon_img/create-normal.jpg">
              <!-- <span class="fl type-name">创建普通群</span> -->
            </div>
            <div class="item-after">创建普通群</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
  .icon-left {
    color: #a7a7a7;
  }
  .list-block {
    margin-top: 0.75rem;
    /* 之下的可以不要，看测试，需要就要不需要就删了 */
    /*height: 100%;
    background-color: #fff;*/
  }
  /*.item-title {
    line-height: 4rem;
  }*/
  .type-name {
    margin-left: 1rem;
  }
</style>
<script>
  import $ from 'zepto'
  export default {
    ready () {
      $($('.tab-item')[1]).addClass('active')
    },
    route: {
      data ({to}) {
        this.user_type = to.query.user_type
      }
    },
    data () {
      return {
        user_type: 4
      }
    },
    methods: {
    },
    components: {
    }
  }
</script>
