<template>
  <div>
    <div class="depart" @click.stop="toggleChildren()">
      <div :class="{'has-children': model.type === 'department','opened':isOpenChildren}">
        <span>{{model.text || model.name}}</span>
        <d-select class="pull-right" v-if="!(mode === 2 && model.type === 'department')" :model.sync="model.isSelected" :v-data="model" @click.stop=""></d-select>
      </div>
      <loading v-show="model.isLoading" v-if="model.type === 'department'"></loading>
      <div class="depart-children" id="{{id}}">
      </div>
    </div>
  </div>
</template>
<script>
import DSelect from '../Select'
import * as Guid from '../../util/guid.js'
import util from '../../util/arrayUtil.js'
import Loading from './Loading'
import Vue from 'vue'
export default {
  props: {
    model: {
      type: Object,
      require: true
    },
    mode: { // 选人控件的模式
      type: Number
    }
  },
  methods: {
    toggleChildren () {
      // 如果这个节点在加载中，那么就不处理
      if (this.model.isLoading) {
        return
      }
      // 如果这个节点是展开的，那么就关闭这个节点。并销毁这个节点的子节点实例
      if (this.isOpenChildren) {
        this.isOpenChildren = false
        this.destoryChild(this.$refs.item)
        return
      }
      // 如果这个节点类型是组节点，那么向上广播，要求打开这个节点的子节点
      if (this.model.type === 'department') {
        this.isOpenChildren = !this.isOpenChildren
        this.$dispatch('depart:open', this)
      }
    },
    destoryChild (vm) {
      vm.$destroy(true)
    },
    // 向上发送事件，告诉自己状态发生变化
    dispatchStatus (data) {
      if (!data) {
        data = this.model
      }
      data.startId = this.model.id // 还是由于dispatch导致需要判断这个事件是否来自自己的
      this.$dispatch('treenode:status:change', data)
    },
    // 深度遍历一个对象数组，将其所有的child设置为false
    iteratorChildren (children) {
      for (let i = 0; i < children.length; i++) {
        Vue.set(children[i], 'isSelected', this.model.isSelected)
        if (children[i].children && children[i].children.length > 0) {
          this.iteratorChildren(children[i].children)
        }
      }
    }
    // broadcastStatus (data) {
    //   if (!data) {
    //     data = this.model
    //   }
    //   data.startId = this.model.id
    //   this.$broadcast('treebranch:status:change', data)
    // }
  },
  data () {
    return {
      id: 'depart' + Guid.newGUID(),
      isOpenChildren: false
    }
  },
  ready () {
    // 拦截select change事件。只有自己的select才会触发。
    this.$on('select change', data => {
      if (data.type === 'department') {
        // 将所有子节点的isSelected设置为与自己相同的
        this.iteratorChildren(this.model.children)
        // this.broadcastStatus()
      }
      this.dispatchStatus()
    })
    // 如果自己的父节点状态改变了，那么同时该变自己的状态。只有在点击分支节点时触发。
    // FIX:但是由于如果子节点在js对象中，但是没有在DOM中，此时无法监听到这个事件。所以，改用js处理.
    // this.$on('treebranch:status:change', data => {
    //   if (data.startId !== this.model.id) {
    //     this.$set('model.isSelected', data.isSelected)
    //     return true
    //   }
    // })
    if (this.mode !== 2) {
      // 判断自己的所有子节点是否都是选中了，如果是，将自己也设置为选中了。
      this.$on('treenode:status:change', data => {
        // $dispatch能收到自己发出的。
        if (data.startId !== this.model.id) {
          // 如果自己的选中状态和子节点的选中状态不一样
          if (this.model.isSelected !== data.isSelected) {
            if (util.isArrayObjectSameAttribute(this.model.children, 'isSelected', true)) {
              this.$set('model.isSelected', true)
            }
            else {
              this.$set('model.isSelected', false)
            }
            // 广播自己的状态已经发生变化
          }
          return true // 强制冒泡
        }
      })
    }
  },
  components: {
    DSelect,
    Loading
  }
}
</script>
<style scoped>
.has-children{
  padding-left: 1rem;
}
.has-children:before{
  content: '';
  display: block;
  position: absolute;
  width: 0;
  height: 0;
  top: 0.7rem;
  left: 0;
  vertical-align: middle;
  border-top: 0.6rem solid;
  border-right: 0.4rem solid transparent;
  border-left: 0.4rem solid transparent;
  border-color: #999 transparent transparent transparent;
  transform: rotate(-90deg);
  transition: 0.4s ease-in-out;
}
.has-children.opened:before{
  transition: 0.4s ease-in-out;
  transform: rotate(0);
}
.depart{
  position: relative;
  line-height: 2rem;
}
.depart-children{
  padding-left: 1rem;
  overflow: hidden;
  /*max-height: 0;*/
  transition: 0.4s ease-in-out;
}
.depart-children.show{
  max-height: 100%;
}
</style>
