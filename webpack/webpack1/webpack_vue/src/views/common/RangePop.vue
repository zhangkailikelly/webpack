<!-- author:jinzk -->
<!-- 申请入群pop -->
<!-- 使用方法:
  1. import applyPop from './commom/applyPop' // 路径请自己配
  2. components: {applyPop}
  3. <apply-pop :data="data"></apply-pop> // data是传过来的数据，有group_id,user_id和show(显示和关闭pop)
 -->
 <!--
 <span v-show="permission == 0" class="permission-text permission-text-open iconfont-jysq icon-earth">公开</span>
 <span v-show="permission == 1" class="permission-text iconfont-jysq icon-qunzuduoren">粉丝可见</span>
 <span v-show="permission == 2" class="permission-text iconfont-jysq icon-qunzuyidong">群组可见</span>
 <span v-show="permission == 3" class="permission-text iconfont-jysq icon-aiziji">仅自己可见</span>
 -->
 <!-- (-1: 公开 0: 粉丝可见 1: 群组可见 2: 仅自己可见) -->
<template>
  <div class="popup" style="display:block;" :class="{'modal-in': data.show, 'modal-out': !data.show}">
    <v-header :title="header.title" :back="header.back" :option="header.option"></v-header>
    <div class="list-block">
      <ul>
        <li class="item-content">
          <div class="item-inner">
            <div class="item-title">公开</div>
            <div class="item-after"><input name="rangePop" checked type="radio" @click="selectPermission(-1, '公开')" /></div>
          </div>
        </li>
        <li class="item-content">
          <div class="item-inner">
            <div class="item-title">粉丝可见</div>
            <div class="item-after"><input name="rangePop" type="radio" @click="selectPermission(0, '粉丝可见')"/></div>
          </div>
        </li>
        <li class="item-content">
          <div class="item-inner">
            <div class="item-title">仅自己可见</div>
            <div class="item-after"><input name="rangePop" type="radio" @click="selectPermission(2, '仅自己可见')"/></div>
          </div>
        </li>
        <li class="item-content">
          <div class="item-inner">
            <div class="item-title">群组可见</div>
            <div class="item-after"><input name="rangePop" type="radio" @click="selectPermission(1, '群组可见')"/></div>
          </div>
        </li>
      </ul>
    </div>
    <div class="content" v-show="data.permission === 1" v-infinite-scroll="loadMore">
      <div class="list-block permission-list">
        <ul>
          <li class="item-content" v-for="group in groups">
            <div class="item-inner">
              <div class="item-title">{{group.name}}</div>
              <div class="item-after"><input name="rangePop" type="radio" @click="selectGroup(group)" /></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<style scoped>
.list-block {
  margin-top: 2.5rem;
}
.content {
  /*border: 1px red solid;*/
  top: 11.3rem;
  margin-left: 1rem;
}
.permission-list {
  margin: 0rem;
}
/*美化radio*/
.radio-box {
  color: #999;
}
input[type=radio]{
  font-size:1em;
  visibility: hidden;
  position: relative;
  display: inline-block;
  width: 1em;
  height: 1em;
  margin-right: 10px;
}
input[type=radio]:before{
  font-size:1em;
  top:12%;
  display: inline-block;
  position: absolute;
  content:' ';
  visibility: visible;
  height: 1em;
  width: 1em;
  display: block;
  background: url("../../assets/img/radio-no-icon.png") no-repeat;
  background-size: 1em 1em;
}
input[type=radio]:checked:before{
  font-size:1em;
  content:' ';
  visibility: visible;
  height: 1em;
  width: 1em;
  background: url("../../assets/img/radio-yes-icon.png") no-repeat;
  background-size: 1em 1em;
}
</style>
<script>
  import $ from 'zepto'
  import vHeader from './header'
  import {loader} from '../../util/util'
  export default {
    props: {
      data: {
        show: false,
        group_id: '',
        permission: 0,
        permissionName: '公开'
      }
    },
    ready () {
      $.init()
    },
    methods: {
      // <!-- (-1: 公开 0: 粉丝可见 1: 群组可见 2: 仅自己可见) -->
      selectPermission (permission, permissionName) {
        this.data.permission = permission
        if (permission === 1) { // 群组可见, 获取我的群
          $.showPreloader('加载中')
          this.$http.get('my_group', {page: 1, per_page: this.per_page}).then(({data}) => {
            this.groups = data.data
            this.total_count = data.total_count
            $.hidePreloader()
          })
        }
        else {
          this.close()
          this.data.permissionName = permissionName
        }
      },
      selectGroup (group) {
        this.data.group_id = group.id
        this.data.permissionName = group.name
        this.close()
      },
      close () {
        this.data.show = false
      },
      loadMore () {
        if (this.loading || this.isRequest) {
          return
        }
        // 如果是最后一页就提醒下
        if (Math.ceil(this.total_count / this.per_page) <= this.cur_page) {
          $.toast('已经是最后一页了', 500)
          this.loading = true
          return
        }
        let scroller = $('.content')
        var that = this
        this.loading = true
        loader.show()
        // 别玩了, 一直请求咋办
        setTimeout(() => {
          that.isRequest = true
          that.$http.get('my_group', {page: that.cur_page + 1, per_page: that.per_page})
          .then(function (data) {
            that.groups = [...that.groups, ...data.data.data]
            that.cur_page = that.cur_page + 1
            that.isRequest = false
            let scrollTop = scroller[0].scrollHeight - scroller.height() - 20
            scroller.scrollTop(scrollTop)
            that.loading = false
            loader.hide()
          })
        }, 1500)
      }
    },
    data () {
      return {
        header: {
          title: '选择可见范围',
          back: function () {
            this.close()
          }.bind(this),
          option: {
            text: '',
            go: {
              route: ''
            },
            fn: function () {
            },
            icon: ''
          }
        },
        groups: [],
        per_page: 20,
        cur_page: 1
      }
    },
    components: {
      vHeader
    }
  }
</script>
