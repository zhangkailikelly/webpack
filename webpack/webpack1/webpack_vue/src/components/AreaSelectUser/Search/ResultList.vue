<template>
  <div class="area-select rl-list" :class="{'show': hasData}" :style="{'height': mxh + 'rem'}">
    <ul class="ul-list">
      <li class="rl-empty" v-show="!isSearching && results.length === 0">
        没有搜索到合适的结果
      </li>
      <li class="rl-empty" v-show="isSearching && results.length === 0">
        <span class="loading xrkj icon xrkj-jiazai"></span>
      </li>
      <li v-for="result in results">
        <span class="rl-name">{{result.name}}</span>
        <span class="rl-depart-name">{{result.schoolName}}<span v-show="result.ssbmmc">{{'（' + result.ssbmmc+'）'}}</span></span>
        <rl-select class="select-icon" :v-data="{idx:$index}" :model.sync="result.isSelect"><rl-select>
      </li>
    </ul>
  </div>
</template>
<script>
import rlSelect from '../../Select'
import util from '../../../util/arrayUtil'
export default {
  props: {
    mode: {
      type: Number
    },
    searchSelectedUser: {
      type: Array
    }
  },
  ready () {
    this.$on('search:result', data=> {
      // 给data设置isSelect
      util.setObjectAttribute(data, 'isSelect', false)
      // 将获取的data中的数据比较是否存在selectResults中，如果存在，则将其isSelect设置为true
      data = util.transArrayAttributeByArray(this.searchSelectedUser, data, 'id', 'isSelect', true)
      this.isSearching = false
      this.results = data
      this.hasData = true
      this.caluHeight()
    })
    this.$on('search:end', ()=> {
      this.closeList()
    })
    this.$on('search:searching', ()=> {
      this.hasData = true
      this.caluHeight()
      this.isSearching = true
    })
    // 监听选择了某个人
    this.$on('select change', data => {
      if (this.mode === 2) { // 模式2，单选
        util.setObjectAttribute(this.results, 'isSelect', false)
        this.results[data.idx].isSelect = true
      }
      this.dispatchSearchResult()
    })
  },
  data () {
    return {
      hasData: false,
      isSearching: false,
      results: [],
      selectResults: [],
      mxh: 0
    }
  },
  methods: {
    // 发送搜索的选择结果
    dispatchSearchResult () {
      // 取出所有的选中的人的数据
      this.$dispatch('select:user', {
        status: 1,
        type: 1,
        data: util.getArrayObjectByAttribute(this.results, 'isSelect', true)
      })
    },
    caluHeight () {
      let mxh = 2
      if (this.results.length > 1) {
        mxh = mxh + this.results.length * 1.7
      }
      else {
        mxh = 3.5
      }
      this.mxh = mxh
    },
    closeList () {
      this.hasData = false
      this.mxh = 0
      setTimeout(()=>{
        this.results = []
      }, 400)
    }
  },
  components: {
    rlSelect
  }
}
</script>
<style scoped>
.area-select.rl-list {
  position: absolute;
  top: 2.2rem;
  height: 0;
  width: 100%;
  margin: -0.5rem;
  z-index: 22;
  /*opacity: 0.5;*/
  overflow: hidden;
  transition: height 0.4s ease-in-out;
  background: #eaeaea;
}
.area-select.rl-list.show {
  opacity: 1;
  margin-top: -0.3rem;
}
.area-select .ul-list {
  padding: 0.5rem 1.5rem;
  margin: 0.5rem;
  background: #fff;
  border-radius: 0.2rem;
}
.area-select .ul-list li {
  list-style: none;
  line-height: 1.5rem;
  position: relative;
}
.area-select .ul-list li:after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  right: auto;
  top: auto;
  height: 1px;
  width: 100%;
  background-color: #e7e7e7;
  display: block;
  z-index: 15;
  -webkit-transform-origin: 50% 100%;
  transform-origin: 50% 100%;
}
.area-select  .ul-list li:last-child:after {
  display: none;
}
.area-select .rl-depart-name {
  display: inline-block;
  color: #9e9e9e;
  font-size: 0.7rem;
  text-overflow: ellipsis;
  word-wrap: break-word;
  white-space: nowrap;
  max-width: 75%;
  overflow: hidden;
  vertical-align: middle;
}
.area-select .rl-empty {
  font-size: 0.7rem;
  color: #999;
  text-align: center;
}
.area-select .ul-list li.rl-empty:after {
  display: none;
}
.area-select .rl-empty .loading {
  text-align: center;
  float: none;
  padding: 0;
}
.select-icon{
  position: absolute;
  right: 0;
  top: 0;
  line-height: 1.2rem;
}
</style>
