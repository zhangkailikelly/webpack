<!-- author:jinzk -->
<!-- 使用方法:
    1. import vPicker from '../common/picker'
    2. components: { vPicker }
    3. <v-picker v-if="types && types.length > 0" :values="types" placeholder="请选择类型" id="type" :result.sync="typeObj"></v-picker>
    注意: 传过来的values 必须是数组而且数据格式是:(只是适用于目前需求)
    [
      {
        id: '123123',
        name: 'xxx'
      }
    ]
 -->
<template>
  <input type="text" id="{{pickerId}}" placeholder="{{placeholder}}" @change="select(name)" v-model="name"/>
</template>
<style scoped>
  .list-block input {
    height: 1.4rem;
    text-align: right;
    color: #a7a7a7;
  }
</style>
<script>
  import $ from 'zepto'
  import * as guid from '../../util/guid'
  export default {
    props: {
      values: {
        type: Array,
        require: true,
        default: []
      },
      placeholder: {
        type: String,
        default: '请选择'
      },
      id: {
        type: String,
        default: 'default-id'
      },
      result: {
        type: Object,
        default: {
          id: '',
          name: ''
        }
      }
    },
    ready () {
      console.log(this.result)
      // 处理传过来的数据
      let value = []
      this.values.forEach(function (e) {
        value.push(e.name || e.text)
      })
      // 初始化picker
      $(`#${this.pickerId}`).picker({
        cols: [
          {
            textAlign: 'center',
            values: value
          }
        ]
      })
    },
    methods: {
      select (name) {
        console.log(this.values)
        let _this = this
        _this.values.forEach(function (e) {
          if (name === e.name) {
            _this.result = e
          }
        })
      }
    },
    data () {
      return {
        pickerId: 'picker-' + this.id + '-' + guid.newGUID(),
        name: ''
      }
    },
    components: {
      guid
    }
  }
</script>
