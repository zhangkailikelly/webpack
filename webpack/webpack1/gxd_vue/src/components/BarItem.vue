<!-- 为了满足教研社区的效果图，对此进行了修改，出现问题请还原到原来的 -->
<template>
  <a class="tab-item" v-link="{path: path, activeClass: 'active'}">
    <div :class="boxClass">
      <span class="iconfont-jysq icon " :class="iconClass"></span>
      <span class="tab-label" v-text="label"></span>
    </div>
  </a>
</template>

<script>
export default {
  props: {
    path: '',
    icon: '',
    label: '',
    iconfont: '', // jinzk new
    boxclass: '' // jinzk new
  },
  computed: {
    iconClass () {
      // return `l-icon-${this.icon}`
      // jinzk edit
      return `${this.icon}`
    },
    boxClass () { // jinzk new
      return `${this.boxclass}`
    }
  }
}
</script>
<style scoped>
/* jinzk new start */
.push {
  width: 2rem;
  height: 2rem;
  background-color: #6BBA9C;
  border-radius: 0.25rem;
  margin: 0 auto;
  line-height: 1.7rem;
}
.push .icon-xie {
  color: #fff;
}
.jysq-font {
  font-size: 1rem !important;
}
/* jinzk new end */
.tab-label {
  display: block;
  font-size: 0.55rem;
}
</style>
