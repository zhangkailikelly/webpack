<template>
  <div class="rl-list" :class="{'show': hasData}" :style="{'height': mxh + 'rem'}">
    <ul class="ul-list">
      <li class="rl-empty" v-show="isSearching && results.length === 0">
        <span class="loading xrkj icon xrkj-jiazai"></span>
      </li>
      <li v-for="result in results" v-touch:tap="selectThis($index)">
        <!-- <span class="rl-name">{{result.name || result.text}}</span> -->
        <span class="rl-name-warp"><span class="rl-name">{{result.name || result.text}}</span></span>
        <span class="rl-depart-name" v-show="result.departName">（{{result.departName}}）</span>
        <rl-select class="pull-right" :model.sync="result.isSelect"><rl-select>
      </li>
    </ul>
  </div>
</template>
<script>
import rlSelect from '../../Select'
import util from '../../../util/arrayUtil'
export default {
  ready () {
    this.$on('search:result', (listObject) => {
      // 如果已经打开了，那么就关闭
      if (this.mxh > 0 && !this.isSearching) {
        this.closeList()
        return
      }
      if (this.isSearching && listObject.list.length === 0) {
        this.closeList()
        return
      }
      // 关闭搜索状态
      this.isSearching = false
      // 默认选择模型
      this.selectResults = listObject.selectResults || []
      // 将获取的data中的数据比较是否存在selectResults中，如果存在，则将其isSelect设置为true,否则设置为false
      listObject.list = util.transArrayFlagByArray(this.selectResults, listObject.list, 'id', 'isSelect', true)
      this.results = listObject.list
      // DOM显示
      this.hasData = true
      // 计算高度
      this.caluHeight()
    })
    this.$on('search:list:end', ()=> {
      this.closeList()
    })
    this.$on('search:list:searching', ()=> {
      this.hasData = true
      this.caluHeight()
      this.isSearching = true
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
    dispatchSearchResult (idx) {
      // 取出所有的选中的人的数据
      // 将所有的设置设置为未选中，然后设置当前的为选中。以实现模拟radio效果
      util.setObjectAttribute(this.results, 'isSelect', false)
      this.results[idx].isSelect = true
      this.closeList()
      this.$dispatch('select:user', this.results[idx])
      this.results = []
    },
    caluHeight () {
      if (this.results && this.results.length) {
        this.mxh = this.results.length * 2
      }
      else {
        this.mxh = 2
      }
    },
    closeList () {
      this.hasData = false
      this.mxh = 0
    },
    selectThis (idx) {
      this.dispatchSearchResult(idx)
    }
  },
  components: {
    rlSelect
  }
}
</script>
<style scoped>
.rl-list{
  display: none;
  overflow: hidden;
  transition: height 0.4s ease-in-out;
  border-top: 1px solid #eaeaea;
}
.rl-list.show{
  display: block;
  margin-top: -0.3rem;
}
.ul-list{
  padding: 0;
  margin: 0;
  background: #fff;
  border-radius: 0.2rem;
}
.ul-list li {
  list-style: none;
  padding: 0 0.5rem;
  line-height: 2rem;
  position: relative;
  background: #fafafa;
}
.ul-list li .rl-name-warp{
  width: 90%;
  overflow-y: hidden;
  display: inline-block;
  line-height: 1rem;
  vertical-align: middle;
}
.ul-list li .rl-name{
  white-space: nowrap;
}
.ul-list li:after{
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
.ul-list li:last-child:after {
  display: none;
}
.rl-depart-name{
  color: #9e9e9e;
  font-size: 0.7rem;
}
.rl-empty{
  font-size: 0.7rem;
  color: #999;
  text-align: center;
}
.ul-list li.rl-empty:after{
  display: none;
}
.rl-empty .loading{
  text-align: center;
  float: none;
  padding: 0;
}
</style>
