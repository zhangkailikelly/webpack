<template>
  <div class="v-radio" :class="cls">
    <div class="colorRadio">
      <input type="checkbox" @change="doClick()" value="{{val}}" id="{{id}}" name="check" :disabled="db" v-model="model"/>
      <label for="{{id}}" class="icon xrkj xrkj-xuanze"></label>
    </div>
    <label for="{{id}}" class="v-label">{{lb}}</label>
  </div>
</template>
<script>
import * as Guid from '../util/guid.js'

export default {
  props: {
    db: {
      type: Boolean,
      default: false
    },
    lb: {
      type: String
    },
    val: {
      default: 'None'
    },
    // 加到select上的类
    cls: {
      type: String
    },
    model: {
      default: false
    },
    vData: {
      type: Object
    },
    cb: {
      type: Function,
      default: function () {
      }
    }
  },
  computed: {
    iconClass () {
      return `icon-${this.icon}`
    }
  },
  ready () {
    this.$on('props', function () {
      console.log('props', arguments)
    })
  },
  data () {
    return {
      id: 'checkbox' + Guid.newGUID()
    }
  },
  methods: {
    // 点击select,返回组件上绑定的数据vData
    doClick: function () {
      this.$dispatch('select change', this.vData)
    }
  },
  components: {
  }
}
</script>
<style scoped>
.v-radio {
  display: inline-block;
}
.v-radio .v-label{
  cursor: pointer;
}
.colorRadio {
  width: 1rem;
  height: 1rem;
  position: relative;
  display: inline-block;
  vertical-align: middle;
}
.colorRadio label.icon {
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  line-height: 1rem;
}
.colorRadio input[type=checkbox] {
  visibility: hidden;
}
.colorRadio input[type=checkbox] + label.icon:before{
  color: #999;
}
.colorRadio input[type=checkbox]:checked + label.icon:before {
  color: #0c9;
}

</style>
