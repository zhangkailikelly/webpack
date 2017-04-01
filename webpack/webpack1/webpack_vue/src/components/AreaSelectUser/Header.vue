<template>
  <header class="bar bar-nav header-nav">
    <a class="icon icon-left pull-left" v-touch:tap="headerOption.goBack()" v-if="headerOption.goBack"></a>
    <slot></slot>
    <h1 class="title">{{headerOption.title}}</h1>
  </header>
</template>
<script>
export default {
  props: {
    // 导航条右边的控制
    headerOption: {
      type: Object
    }
  }
}
</script>
<style scoped>
  .header-nav{
    background: #00cc99;
  }
  .header-nav .title{
    color: #fff;
  }
  .header-nav .icon{
    color: #fff;
  }
  .bar .button-link{
    color: #fff;
  }
  .bar.header-nav .button-nav.pull-right{
    margin-right: 0;
  }
</style>
