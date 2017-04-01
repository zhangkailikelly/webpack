<template>
  <div class="select-user" v-if="isShow" :class="{'slide-in':slideIn}">
    <su-header :header-option="headerOption">
      <span class="su-finish" v-touch:tap="selected()">
        完成<span v-show="selectedUserNum > 0">({{selectedUserNum}})</span>
      </span>
    </su-header>
    <div class="content select-user-content">
      <search :mode="mode" :permissions="permissions" :search-selected-user="searchSelectedUser"></search>
      <select-result :selected-users.sync="selectedUsers"></select-result>
      <div class="su-tree">
        <list-select :permissions="permissions"></list-select>
        <tree-list :trees="trees" :mode="mode"></tree-list>
        <loading v-show="isLoadingTree"><loading>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import $ from 'zepto'
import suHeader from './Header'
import search from './Search/Search'
import util from '../../util/arrayUtil'
import TreeList from './TreeList'
import sstore from '../../util/sessionStoreUtil'
import Loading from './Loading'
import ListSelect from './ListSelect/ListSelect'
import SelectResult from './SelectResult'
export default {
  ready () {
    /**
     * 监听打开选人控件
     * data.callback 完成的回调函数
     * data.mode 模式：选人控件回调返回值的格式。默认为1。也就是返回的是对象数组，部门的人在members属性中。2表示只能选择一个人。
     * data.permissions 获取学校列表权限接口 rolemarks=CLOUD_ADMIN：返回用户所属机构下的所有学校
     * data.users 默认选中的用户组
     */
    this.$on('common:areaSelectUser', data => {
      this.isShow = true
      this.trees = []
      this.initSelectedUser = data.users || []
      this.searchSelectedUser = []
      this.listSelectedUser = []
      this.callback = data.callback
      this.mode = data.mode || 1
      this.permissions = data.permissions || 0
      // this.mode = 2
      if (data.title) this.headerOption.title = data.title
      // 我还是很奇怪为什么this.$nextTick不行
      setTimeout(()=>{
        this.slideIn = true
        this.loadTree()
      }, 300)
    })
    // 接收选择的人
    // data.status number 选择的方式。0表示删除某个选择；1表示增加某个选择
    // data.type number 选择的类型。1表示选择人
    // data.data array 选择的对象数组。
    this.$on('select:user', data => {
      if (data.status) {
        // 去掉重复的选择
        if (this.mode === 2) { // 模式2，只能选择一个人
          if (this.selectedUsers && this.selectedUsers.length > 0) { // 删除已经选中的用户
            this.deleteUser(this.selectedUsers[0].id)
          }
          this.searchSelectedUser = data.data // 设置选择的用户
        }
        else {
          this.searchSelectedUser = util.uniqueArrayObjectByKey(this.searchSelectedUser.concat(data.data), 'id')
        }
        // this.searchSelectedUser = data.data
      }
    })
    // 监听部门点击事件
    this.$on('depart:open', data => {
      if (!data.loaded) {
        this.loadChildrenData(data)
      }
      else {
        this.appendNode(data)
      }
    })
    this.$on('treenode:status:change', data => {
      // 如果是模式二，只能选择一个人
      if (this.mode === 2) {
        if (this.selectedUsers && this.selectedUsers.length > 0) { // 删除已经选中的用户
          this.deleteUser(this.selectedUsers[0].id)
        }
        this.listSelectedUser = util.getSelectObjectArray(this.trees, 'isSelected', true)
      }
      else {
        this.listSelectedUser = util.getSelectObjectArray(this.trees, 'isSelected', true)
      }
    })
    // 监听学校切换事件
    this.$on('select:user:schoolchange', data => {
      this.mySchool = data
      this.loadTree(data.id)
      // 告诉搜索当前学校
    })
    /**
     * 监听删除选择的用户.
     */
    this.$on('select:user:delete', user => {
      if (user) {
        this.deleteUser(user.id)
        user.deleted = false
      }
    })
    $.init()
  },
  data () {
    return {
      isShow: false, // 控制组件dom是否显示
      slideIn: false, // slide动画
      isLoadingTree: false,
      headerOption: {
        title: '选择联系人',
        goBack: () => {
          this.close()
        }
      },
      mode: 1, // 模式
      initSelectedUser: [], // 外部传入的用户
      searchSelectedUser: [], // 搜索中的用户
      listSelectedUser: [], // 部门中的用户
      trees: [],
      mySchool: {}
    }
  },
  computed: {
    // 选择的用户对象数组
    selectedUsers () {
      return util.uniqueArrayObjectByKey(this.listSelectedUser.concat(this.searchSelectedUser).concat(this.initSelectedUser), 'id')
    },
    // 显示选择的用户数
    selectedUserNum () {
      let selectUsers = util.uniqueArrayObjectByKey(this.listSelectedUser.concat(this.searchSelectedUser).concat(this.initSelectedUser), 'id')
      return this.cacuChildren(selectUsers, true)
    }
  },
  methods: {
    // 计算所有的人的数目
    cacuChildren (children, isAddMember) {
      let totalCount = 0
      for (let item of children) {
        if (item.type === 'department') {
          if (item.attributes && item.attributes.teacherCount) {
            totalCount = totalCount + Number(item.attributes.teacherCount)
          }
        }
        else {
          if (isAddMember) {
            totalCount = totalCount + 1
          }
        }
        if (item.children && item.children.length > 0) {
          totalCount = totalCount + this.cacuChildren(item.children)
        }
      }
      return totalCount
    },
    /**
     * 1）将遍历trees，将其selected设置为false
     * 2) 将这个用户从initSelectedUser中删除
     * 3）将这个用户从searchSelectedUser中删除
     * 4）将这个用户从listSelectedUser中删除
     */
    deleteUser (userId) {
      // 1
      let arr = util.getSelectObjectArray(this.trees, 'id', userId)
      if (arr.length > 0) {
        // util.setObjectAttribute(arr, 'isSelected', false)
        // 将所有的子节点都设置为false
        util.setObjectArrayAttributeDeep(arr, 'isSelected', false)
      }
      // 2
      util.deleteObjectFromArray(this.initSelectedUser, 'id', userId)
      // 3
      util.deleteObjectFromArray(this.searchSelectedUser, 'id', userId)
      // 4
      util.deleteObjectFromArray(this.listSelectedUser, 'id', userId)
    },
    close () {
      this.slideIn = false
      setTimeout(() => {
        this.isShow = false
      }, 400)
    },
    // 将数组中所有id取出来
    getIds (array) {
      let ids = []
      for (let item of array) {
        if (item.type === 'department') { // 获取数组的类型
          ids.push(item.id)
          if (item.children && item.children.length > 0) {
            ids = ids.concat(this.getIds(item.children))
          }
        }
      }
      return ids
    },
    // 完成选择
    selected () {
      this.close()
      // 如果是模式1，那么要求返回的部门中带有members属性，表示该部门下所有的人。
      if (this.mode === 1) {
        let promiseArray = []
        for (let i = 0; i < this.selectedUsers.length; i++) {
          let suser = this.selectedUsers[i]
          if (suser.type === 'department') {
            let us = []
            us.push(suser)
            let suserId = this.getIds(us).join(',')
            let p = this.loadAllMember(suserId, i)
            promiseArray.push(p)
          }
        }
        $.showPreloader()
        Promise.all(promiseArray).then((res) => {
          for (let i = 0; i < res.length; i++) {
            let obj = res[i]
            this.selectedUsers[obj.idx].members = obj.data
          }
          this.callback(this.selectedUsers)
          $.hidePreloader()
        }).catch((res) => {
          $.hidePreloader()
          $.alert('加载数据出错，请稍后重试', '提示')
        })
      }
      else {
        this.callback(this.selectedUsers)
      }
    },
    /**
     * 在获取树的数据的时候，从this.initSelectedUser中获取选中同步状态
     * 1）设置listTreeObject的isSelected为true
     * 2) 将匹配的对象加入listSelectedUser
     * 3）删除initSelectedUser中匹配的对象
     */
    getInitUserToShow (listTreeObject) {
      let initSelectedUser = this.initSelectedUser
      for (let obj of listTreeObject) {
        for (var i = 0, length = initSelectedUser.length; i < length; i++) {
          let obj2 = initSelectedUser[i]
          if (obj.id === obj2.id && obj.id !== undefined) {
            obj['isSelected'] = true // 步骤1
            this.listSelectedUser.push(obj2) // 步骤2
            initSelectedUser.splice(i, 1) // 步骤3
            i = i - 1
            length = length - 1
          }
        }
      }
      return listTreeObject
    },
    // 获取部门组织架构
    loadTree (schoolId) {
      this.trees = []
      $('.content.select-user-content').scrollTop(0)
      let url = `/cloudlexueserver/dept/list.do`
      if (schoolId) url = url + `?schoolId=${schoolId}`
      let trees = sstore.get(url)
      if (trees) {
        this.trees = this.getInitUserToShow(trees)
        return
      }
      this.isLoadingTree = true
      this.$http.get(url)
          .then(function (res) {
            this.isLoadingTree = false
            if (res.data && res.data.children) {
              util.setObjectAttribute(res.data.children, 'isLoading', false)  // 初始化组件isLoading属性
              sstore.set(url, res.data.children)
              this.trees = this.getInitUserToShow(res.data.children)
            }
            else {
              $.alert('加载数据出错，请稍后重试', '提示')
            }
          }, function (res) {
            this.isLoadingTree = false
            $.alert('加载数据出错，请稍后重试', '提示')
          })
    },
    // 发起请求，加载数据部门下的人员数据
    loadChildrenData (vm) {
      let url = `/cloudlexueserver/dept/queryDeptTeacher.do?nodeId=${vm.model.id}`
      if (this.mySchool.id) url = url + `&schoolId=${this.mySchool.id}`
      let data = sstore.get(url)
      if (data) {
        this.renderMember(vm, data)
        return
      }
      vm.$set('model.isLoading', true)
      this.$http.get(url)
          .then(function (res) {
            vm.$set('model.isLoading', false)
            if (res.data) {
              sstore.set(url, res.data)
              this.renderMember(vm, res.data)
            }
            else {
              $.alert('加载数据出错，请稍后重试', '提示')
            }
          }, function (res) {
            vm.model.isLoading = false
            // $.hidePreloader()
            $.alert('加载数据出错，请稍后重试', '提示')
          })
    },
    // 发起请求，加载部门下所有的人（这个方法包括了子部门，loadChildrenData则不会）
    loadAllMember (id, idx) {
      let p = new Promise((resolve, reject) => {
        let url = `/cloudlexueserver/dept/queryDeptTeacher.do?nodeId=${id}`
        let data = sstore.get(url)
        if (data) {
          resolve({id, data, idx})
        }
        else {
          this.$http.get(url)
              .then(function (res) {
                if (res.data) {
                  sstore.set(url, res.data)
                  resolve({id, data: res.data, idx})
                }
                else {
                  reject()
                }
              }, function (res) {
                reject()
              })
        }
      })
      return p
    },
    renderMember (vm, data) {
      vm.loaded = true
      vm.model.children = vm.model.children || []
      data = data.concat(vm.model.children)
      // 将初始化中的member对象加入视图模型中。
      for (let i = 0; i < data.length; i++) {
        Vue.set(data[i], 'isSelected', false)
      }
      this.getInitUserToShow(data)
      vm.model.children = data
      this.appendNode(vm)
    },
    renderAllMember (id, data) {
      this.$emit('this:resolve', {
        id,
        data
      })
    },
    // 渲染组件，使用动态渲染实现无限级子部门。
    appendNode (vm) {
      let treeModel = new Vue(TreeList)
      // 如果父级节点被选中，那么就将全部子节点设置为选中。
      if (vm.model.isSelected) {
        util.setObjectAttribute(vm.model.children, 'isSelected', true)
      }
      treeModel.trees = vm.model.children
      treeModel.mode = this.mode
      treeModel.$parent = vm // 指定这个组件的父组件，这样才能将treeModel的$dispatch向上冒泡
      vm.$children.push(treeModel) // 将这个组件加入父组件的列表，才能收到来到父组件的$broadcast
      vm.$refs.item = treeModel // 用于控制子模块
      treeModel.$mount().$appendTo(`#${vm.id}`)
    }
  },
  components: {
    suHeader,
    search,
    TreeList,
    ListSelect,
    Loading,
    SelectResult
  }
}
</script>
<style scoped>
.select-user{
  width: 100%;
  height: 100%;
  background: #fff;
  position: absolute;
  top: 0;
  left: 100%;
  z-index: 2999;
  -webkit-overflow-scrolling: touch;
  -webkit-transition-property: -webkit-transform;
  transition-property: transform;
  -webkit-transition-duration: 400ms;
  transition-duration: 400ms;
}
.select-user.slide-in{
  -webkit-transform: translate3d(-100%, 0, 0);
  transform: translate3d(-100%, 0, 0);
  -webkit-transition-duration: 400ms;
  transition-duration: 600ms;
}
.select-user.slide-out{
  -webkit-transform: translate3d(0, 100%, 0);
  transform: translate3d(0, 100%, 0);
  -webkit-transition-duration: 400ms;
  transition-duration: 400ms;
}
.su-cancel{
  float: left;
}
.su-finish{
  color: #fff;
  line-height: 2.2rem;
  position: absolute;
  right: 1rem;
  z-index: 1;
}
.su-title{
  font-size: 1rem;
  font-weight: 500;
  display: inline;
  margin: 0;
}
.su-tree {
  /*margin-top: 2.2rem;*/
  padding: 0.5rem;
}
</style>
