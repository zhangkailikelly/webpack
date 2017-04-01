<template>
  <div class="searchbar" :class="{'show-option': showOption}">
    <a class="searchbar-sure" v-touch:tap="sureSearch()">确定</a>
    <!-- <a class="searchbar-clear" @click="clearSearch()">取消</a> -->
    <div class="search-input">
      <label class="icon icon-search" for="search"></label>
      <input type="search" v-model="keywords" @keyup="search()" placeholder='搜索'/>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    permissions: {
      type: Number
    },
    searchSelectedUser: {
      type: Array
    }
  },
  ready () {
    // 监听学校变化
    this.$on('select:search:school', (data) => {
      this.mySchool = data
    })
  },
  data () {
    return {
      mySchool: {},
      keywords: '',
      showOption: false,
      searchResult: []
    }
  },
  methods: {
    // 输入搜索
    search () {
      if (this.keywords) {
        this.showOption = true
        this.searching()
        let url = `/cloudlexueserver/dept/queryteacher.do`
        if (this.permissions === 1) {
          url = `${url}?schoolId=${this.mySchool.id}`
        }
        setTimeout(() => {
          this.$http.get({
            url: url,
            params: {
              name: encodeURIComponent(this.keywords)
            }
          })
          .then(function (res) {
            this.$dispatch('search', {
              toName: 'search:result',
              data: res.data.rows || []
            })
          }, function (res) {
            this.$dispatch('search', {
              toName: 'search:result',
              data: []
            })
          })
        }, 300)
      }
      else {
        this.$dispatch('search', {
          toName: 'search:end'
        })
      }
    },
    // 开始搜索，发送加载状态
    searching () {
      if (this.keywords && this.searchResult.length === 0) {
        this.$dispatch('search', {
          toName: 'search:searching'
        })
      }
    },
    // 点击确定
    sureSearch () {
      this.keywords = ''
      this.showOption = false
      this.$dispatch('search', {
        toName: 'search:end'
      })
    }
    // TODO: 获取已经选中的用户.将搜索出来的用户是否选择显示出来
    // 如果要做到在搜索出来的时候，把已经选中的用户都设置为选中状态，那么就要同时做把选中的用户点击取消的时候，把这个用户删除。
    // 但是假如这个用户是选中的部门中的呢？ 如果取消选择这个用户，不论是同时取消选择的部门还是不取消，都会出现逻辑的混乱。
    // 注意，很可能这个时候没有加载出部门中的所有人。
  }
}
</script>
<style scoped>
.searchbar .searchbar-sure {
  margin-right: -3rem;
  width: 2.2rem;
  float: right;
  height: 1.4rem;
  line-height: 1.4rem;
  text-align: center;
  -webkit-transition: all .3s;
  transition: all .3s;
  opacity: 0;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
  color: #5f646e;
}
.searchbar {
  height: auto;
}
.searchbar.show-option .search-input{
  margin-right: 2.5rem;
}
.searchbar.show-option .searchbar-sure{
  opacity: 1;
  margin-right: 0;
}
</style>
