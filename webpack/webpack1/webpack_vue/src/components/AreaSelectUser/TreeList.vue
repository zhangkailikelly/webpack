<template>
  <div>
    <tree-item v-for="tree in trees" :mode="mode" :model="tree"></tree-item>
  </div>
</template>
<script>
import TreeItem from './TreeItem'
export default {
  props: {
    trees: {
      type: Array
    },
    mode: {
      type: Number
    }
  },
  components: {
    TreeItem
  },
  ready () {
  }
}
</script>
<style>
.fade-transition {
  transition: opacity 3 ease;
}
.fade-enter .fade-leave {
  opacity: 0;
}
</style>
