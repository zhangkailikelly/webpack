<template>
  <div class="list-select">
    <div class="list-wrapper">
      <div v-touch:tap="openSelect()" class="select-box">
        <span>{{mySchool.text}}</span>
        <span class="list-arrow-down"></span>
      </div>
      <select-list class="select-option"></select-list>
    </div>
  </div>
</template>
<script>
import SelectList from './List'
import sstore from '../../../util/sessionStoreUtil'
export default {
  props: {
    permissions: {
      type: Number
    }
  },
  ready () {
    this.getMySchool()
    this.$on('select:user', (data) => {
      this.isOpenList = false
      this.mySchool = data
      this.sendCurrentSchool()
      this.$dispatch('app:main', {
        toName: 'select:user:schoolchange',
        data: data
      })
    })
  },
  data () {
    return {
      mySchool: {
        text: '学校'
      },
      schoolList: [],
      isOpenList: false
    }
  },
  methods: {
    getMySchool () {
      let url = `/cloudlexueserver/dept/querySchoolInfo.do`
      this.$http.get(url)
          .then(function (res) {
            this.mySchool = res.data
            this.sendCurrentSchool()
          }, function (res) {
          })
    },
    // 告诉搜索栏当前学校信息
    sendCurrentSchool () {
      this.$dispatch('app:main', {
        toName: 'select:search:school',
        data: this.mySchool
      })
    },
    openSelect () {
      if (this.isOpenList) {
        this.isOpenList = false
        this.$broadcast('search:list:end')
      }
      else {
        this.isOpenList = true
        this.broadcastSearch()
      }

    },
    broadcastSearch () {
      let object = {
        selectResults: [this.mySchool],
        list: this.schoolList
      }
      let url = `/cloudlexueserver/department/myschools.do`
      if (this.permissions === 2) {
        url = url + `?rolemarks=CLOUD_ADMIN`
      }
      let schools = sstore.get(url)
      if (schools) {
        this.schoolList = schools
        object.list = schools
        this.$broadcast('search:result', object)
        return
      }
      if (this.schoolList.length === 0) {
        this.$broadcast('search:list:searching')
        this.$http.get({
          url: url
        })
        .then(function (res) {
          this.schoolList = res.data.rootNode.children
          object.list = res.data.rootNode.children
          sstore.set(url, res.data.rootNode.children)
          this.$broadcast('search:result', object)
        }, function (res) {
          this.$broadcast('search:result', object)
        })
      }
      else {
        this.$broadcast('search:result', object)
      }
    }
  },
  components: {
    SelectList
  }
}
</script>
<style scoped>
.list-select{
  position: relative;
  height: 3rem;
}
.list-wrapper{
  position: absolute;
  top: 0;
  width: 100%;
  border: 1px solid #efefef;
  background: #fff;
  line-height: 1.5rem;
  z-index: 1;
}
.select-box{
  margin: 0.5rem;
}
.list-arrow-down:before{
  content: '';
  display: block;
  position: absolute;
  width: 0;
  height: 0;
  top: 1rem;
  right: 0.7rem;
  vertical-align: middle;
  border-top: 0.6rem solid;
  border-right: 0.4rem solid transparent;
  border-left: 0.4rem solid transparent;
  border-color: #999 transparent transparent transparent;
  /*transform: rotate(-90deg);*/
  transition: height 0.4s ease-in-out;
}
</style>
