<!-- author:jinzk -->
<!-- 申请入群pop -->
<!-- 使用方法:
  1. import applyPop from './commom/applyPop' // 路径请自己配
  2. components: {applyPop}
  3. <apply-pop :data="data"></apply-pop> // data是传过来的数据，有group_id,user_id和show(显示和关闭pop)
 -->
<template>
  <div class="popup" style="display:block;" :class="{'modal-in': data.show, 'modal-out': !data.show}">
    <v-header :title="header.title" :back="header.back" :option="header.option"></v-header>
    <div class="content-block">
      <textarea v-model="reason" placeholder="填写申请理由更容易通过呦~"></textarea>
    </div>
  </div>
</template>
<style scoped>
  .content-block {
    margin-top: 3.25rem;
  }
  .popup {
    background-color: #efeff4;
    z-index: 9999999;
  }
  textarea {
    border: 1px #ccc solid;
    width: 100%;
    min-height: 5rem;
  }
</style>
<script>
  import $ from 'zepto'
  import vHeader from './header'
  export default {
    props: {
      data: {
        show: false,
        group_id: ''
      },
      status: {
        type: Number,
        default: 0
      }
    },
    ready () {
      $.init()
    },
    methods: {
      apply () {
        if (!this.reason) {
          $.alert('请填写申请理由')
          return
        }
        // 发送请求后调用close事件关闭pop
        let param = {
          text: this.reason,
          group_id: this.data.group_id
          // user_id: this.user_id
        }
        this.$http.post('group_apply', param).then(({data}) => {
          this.status = 1
          $.toast('提交成功', 500)
        }, ({data}) => {
          $.alert(data.message || '请求失败')
        })
        setTimeout(() => {
          this.close()
          this.reason = ''
        }, 550)
      },
      close () {
        this.data.show = false
      }
    },
    data () {
      return {
        header: {
          title: '申请理由',
          back: function () {
            this.close()
          }.bind(this),
          option: {
            text: '提交',
            go: {
              route: ''
            },
            fn: function () {
              this.apply()
            }.bind(this),
            icon: ''
          }
        },
        reason: ''
      }
    },
    components: {
      vHeader
    }
  }
</script>
