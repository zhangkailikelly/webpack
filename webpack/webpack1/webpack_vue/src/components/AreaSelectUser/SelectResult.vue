<template>
  <div class="select-result-wrapper">
    <span class="select-result-item" :class="{'deleted': result.deleted}" v-touch:tap="removeUser($index)" v-for="result in selectedUsers">{{result.name || result.text}}</span>
  </div>
</template>
<script>
import Vue from 'vue'
export default {
  props: {
    selectedUsers: {
      type: Array
    }
  },
  methods: {
    removeUser (idx) {
      Vue.set(this.selectedUsers[idx], 'deleted', !this.selectedUsers[idx].deleted)
      // 留下300s作为动画延迟时间
      setTimeout(() => {
        this.$dispatch('select:user:delete', this.selectedUsers[idx])
      }, 500)
    }
  }
}
</script>
<style scoped>
.select-result-wrapper {
  /*margin-top: 0.5rem;*/
}
.select-result-item {
  padding: 0rem 0.5rem;
  background: #0c9;
  color: #fff;
  border-radius: 1rem;
  font-size: 0.7rem;
  margin-top: 0.5rem;
  margin-right: 0.3rem;
  margin-left: 0.5rem;
  display: inline-block;
  position: relative;
}
.select-result-item:after {
  content: "";
  position: absolute;
  display: block;
  width: 0;
  height: 0.1rem;
  background: #9a9a9a;
  top: 49%;
  left: 0;
  transition: width .4s ease-in-out;
}
.select-result-item.deleted:after{
  width: 100%;
  transition: width .4s ease-in-out;
}
</style>
