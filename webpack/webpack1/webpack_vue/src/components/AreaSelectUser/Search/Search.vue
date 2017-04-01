<template>
  <div class="search bar">
    <search-area :permissions="permissions" :search-selected-user="searchSelectedUser"></search-area>
    <result-list :mode="mode" :search-selected-user="searchSelectedUser"></result-list>
  </div>
</template>
<script>
import searchArea from './SearchArea'
import resultList from './ResultList'
export default {
  props: {
    mode: {
      type: Number
    },
    permissions: {
      type: Number
    },
    searchSelectedUser: {
      type: Array
    }
  },
  ready () {
    this.$on('search', data =>{
      this.$broadcast(data.toName, data.data)
    })
  },
  data () {
    return {
      listData: null
    }
  },
  components: {
    searchArea,
    resultList
  }
}
</script>
<style scoped>
.bar.search {
  /*margin-top: 2.2rem;*/
  height: auto;
  background: #eaeaea;
  position: relative;
}
.bar.search .searchbar {
  background: #eaeaea;
}
</style>
