<template>
  <v-header :title="header.title" :back="header.back" :option="header.option"></v-header>
  <div class="content">
      <div class="list-block">
        <ul>
          <li class="item-content item-link">
            <div class="item-inner">
              <div class="item-title">
                <img v-if="!uploadFlag && cover_image_base64 && cover_image_base64 !== ''" :src="cover_image_base64" class="item-media"/>
                <img v-if="!uploadFlag && (!cover_image_base64 || cover_image_base64 === '')" src="../../../assets/img/icon_img/create-subject.jpg" class="item-media">
                <div class="item-media" v-show="uploadFlag" >
                  <img style="margin: auto;" src="http://h5.sinaimg.cn/weibocn/v6/img/440/loading.96c5cf34.gif" alt="">
                </div>
              </div>
              <div class="item-after">
                <a href="javascript:void(0);" class="a-upload">
                  <input type="file" name="" accept="image/*" id="file" @change="upload($event)">上传群头像
                </a>
              </div>
            </div>
          </li>
          <li class="item-content">
            <div class="item-inner-line">
                <div class="item-title-line">群名称</div>
                <input class="item-input-create" type="text" placeholder="请输入群名称" v-model="groupName">
            </div>
          </li>
          <li class="item-content">
            <div class="item-inner-line">
                <div class="item-title-line">群简介</div>
                <textarea class="item-input-create" type="text" placeholder="请输入群简介..." v-model="discript"></textarea>
            </div>
          </li>
          <li class="item-content " v-if="groupType == 'subject'">
            <div class="item-inner">
              <div class="item-title">类型</div>
              <div class="item-after gray">
                <span v-if="user_type == 3 || user_type == '3'">校级</span>
                <span v-if="user_type == 2 || user_type == '2'">区级</span>
              </div>
            </div>
          </li>
          <li class="item-content item-link" v-if="groupType == 'subject'">
            <div class="item-inner">
              <div class="item-title">学段</div>
              <div class="item-after gray">
                <v-picker v-if="levels && levels.length > 0" :values="levels" placeholder="请选择学段" id="levels" :result.sync="level"></v-picker>
              </div>
            </div>
          </li>
          <li class="item-content item-link" v-if="groupType == 'subject'">
            <div class="item-inner">
              <div class="item-title">学科</div>
              <div class="item-after gray">
                <v-picker v-if="subjects && subjects.length > 0" :values="subjects" placeholder="请选择学科" id="subjects" :result.sync="subject"></v-picker>
              </div>
            </div>
          </li>
          <li class="item-content item-link" v-if="groupType == 'subject'">
            <div class="item-inner">
              <div class="item-title min-width-6">选择群主</div>
              <div class="item-after gray" @click="selectLeader()">{{leaderName || '请选择群主'}}</div>
            </div>
          </li>
          <li class="item-content item-link">
            <div class="item-inner">
              <div class="item-title min-width-6">添加群成员</div>
              <div class="gray slh" @click="selectMember()">{{memberNames.substring(1) || '请选择成员'}}</div>
            </div>
          </li>
          <li class="item-content item-link" v-if="groupType == 'subject'">
            <div class="item-inner">
              <div class="item-title min-width-6">添加群管理员</div>
              <div class="gray slh" @click="selectAdmin()">{{adminNames.substring(1) || '选择管理员'}}</div>
            </div>
          </li>
        </ul>
      </div>
  </div>
</template>
<style scoped>
  .list-block {
    margin: 0.75rem 0 0 0;
  }
  .item-inner-line {
    width: 100%;
    padding-right: 0.75rem;
  }
  .item-title-line {
    margin: 0.75rem 0;
  }
  .list-block .item-input-create {
    border: 1px #ccc solid;
    width: 100%;
  }
  .gray {
    color: #a7a7a7;
  }
  /* 上传样式美化 */
  .a-upload {
    position: relative;
    cursor: pointer;
    color: #a7a7a7;
    overflow: hidden;
    display: inline-block;
    *display: inline;
    *zoom: 1
  }
  .a-upload  input {
    position: absolute;
    right: 0;
    top: 0;
    padding-top: 1.5rem;
  }
  .list-block .item-media {
    padding: 0 0;
    height: 4.65rem;
    width: 4.65rem;
  }
  .min-width-6 {
    min-width: 6rem;
  }
  .slh {
    white-space: nowrap;
    text-overflow:ellipsis;
    overflow:hidden;
  }
</style>
<script>
  import vPicker from '../../common/picker'
  import vHeader from '../../common/header'
  import Store from '../../../assets/js/store.js/src/store.js'
  import $ from 'zepto'
  export default {
    ready () {
      $($('.tab-item')[1]).addClass('active')
    },
    route: {
      data ({to}) {
        $($('.tab-item')[1]).addClass('active')
        console.log($('.tab-item')[1])
        // $('.tab-item')[1].addClass('active')
        this.groupType = to.query.type
        this.user_type = to.query.user_type
        this.userInfo = Store.get('userInfo')
        this.userId = Store.get('userInfo').id
        this.isDaXing = Store.get('userInfo').isDaXing
        if (this.groupType === 'subject') { // 如果是新建学科群，则获取学段，学科
          this.header.title = '创建学科群' // 这里是用来添加头部标题的
          return Promise.all([
            this.$http.get(`group_level`),
            this.$http.get(`group_subject`)
          ]).then(([levels, subjects]) => {
            this.levels = levels.data
            this.subjects = subjects.data
          })
        }
        else {
          this.header.title = '创建普通群' // 这里是用来添加头部标题的
        }
      }
    },
    data () {
      return {
        // header start
        header: {
          title: '',
          back: function () {
            window.history.back()
          },
          option: {
            text: '创建',
            go: {
              route: ''
            },
            fn: function () {
              this.create()
            }.bind(this),
            icon: ''
          }
        },
        // header end
        groupType: '',
        groupName: '',
        discript: '',
        userInfo: '',
        types: [
          {
            name: '区级',
            id: 'district'
          },
          {
            name: '校级',
            id: 'school'
          }
        ], // 创建学科群的类型
        type: '', // 选择的类型的obj
        levels: [], // 学段
        level: {
          id: '',
          name: ''
        }, // 选择的学段的obj
        subjects: [], // 学科
        subject: {
          id: '',
          name: ''
        }, // 选择的学科的obj
        cover_image_base64: '', // 上传图片
        uploadFlag: false, // 上传图片
        postFile: '',
        member: [], // 成员
        admin: [], // 管理员
        leader: [], // 群主
        adminNames: '',
        memberNames: '',
        leaderName: '',
        admins: '',
        members: '',
        leaderId: '',
        user_type: 4,
        userId: '',
        isDaXing: false
      }
    },
    watch: {
      'level': 'settingLevelGroupName',
      'subject': 'settingSubjectGroupName'
    },
    methods: {
      settingLevelGroupName () {
        // 大兴独有
        if (this.isDaXing) {
          this.groupName = `${this.level.name}${this.subject.name}`
        }
      },
      settingSubjectGroupName () {
        // 大兴独有
        if (this.isDaXing) {
          this.groupName = `${this.level.name}${this.subject.name}`
        }
      },
      upload (e) {
        this.uploadFlag = true // open loading
        let _this = this
        let reader = new FileReader()
        let file = e.target.files[0]
        reader.readAsDataURL(file)
        reader.onload = function (e) {
          // this.result 拿到图片的base64字符串
          _this.cover_image_base64 = this.result
          let fd = new FormData()
          let blob = _this.dataURItoBlob(this.result) // 构造 FormData 填充二进制文件数据
          fd.append('attach', blob, file.name)
          _this.$http.post(`upload/avatar`, fd).then(({data}) => {
            _this.postFile = `${data.id}:${data.name}.${data.type}|`
            _this.uploadFlag = false // close loading
          })
        }
      },
      dataURItoBlob (dataURI) { // 上传的二进制文件数据，处理方法
        var byteString = atob(dataURI.split(',')[1])
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
        var ab = new ArrayBuffer(byteString.length)
        var ia = new Uint8Array(ab)
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i)
        }
        return new Blob([ab], {type: mimeString})
      },
      // 点击创建
      create () {
        if (this.groupName === '') {
          $.toast('请填写完整信息', 500)
          return
        }
        if (this.groupType === 'subject') {
          if (!this.level.id || !this.subject.id) {
            $.toast('请填写完整信息', 500)
            return
          }
        }
        if (this.user_type === '2') { // 如果是区级管理员，则只能创建区级群
          this.type = -1
        }
        if (this.user_type === '3') {
          this.type = this.userInfo.school_id
        }
        if (this.groupName.length > 20) {
          $.toast('群名称不得超过20个字', 500)
          return
        }
        if (this.discript.length > 200) {
          $.toast('群简介不得超过200个字', 500)
          return
        }
        let messages = {
          new_gropu_type: this.groupType, // 学科还是普通
          cover_image: this.postFile, // 上传的头像
          name: this.groupName,
          description: this.discript,
          type: this.type,
          level: this.level.id,
          subject: this.subject.id,
          member: this.members,
          admin: this.admins,
          leader: this.leaderId
        }
        this.$http.post('group', messages).then(({data, status}) => {
          if (data.success) {
            $.toast('创建成功', 500)
            let _this = this
            setTimeout(function () {
              this.postFile = ''
              this.groupName = ''
              this.discript = ''
              this.type = ''
              this.level = {
                id: '',
                name: ''
              }
              this.subject = {
                id: '',
                name: ''
              }
              this.adminNames = ''
              this.memberNames = ''
              this.leaderName = ''
              this.subjects = ''
              this.levels = ''
              _this.$route.router.go({name: 'group_home', query: { group_id: data.forumId, from: 'list'}})
            }, 510)
          }
          if (!data.success) {
            $.toast(data.message, 500)
          }
        }, ({data}) => {
          $.toast(data.message, 500)
        })
      },
      // 选人控件
      selectMember () { // 选择群成员
        this.$dispatch('app:main', {
          toName: 'common:areaSelectUser',
          data: {
            users: this.member,
            title: '区级选人',
            permissions: 2, // 获取全区的学校
            callback: (member) => {
              let allMembers = ''
              let _this = this
              this.member = member
              this.memberNames = ''
              this.member.forEach(function (e) {
                _this.memberNames = `${_this.memberNames},${e.name || e.text}`
                if (!e.type) {
                  allMembers = allMembers + e.id + ','
                }
                if (e.type === 'department') {
                  e.members.forEach(function (item) {
                    allMembers = allMembers + item.id + ','
                  })
                }
              })
              this.members = allMembers.substring(0, allMembers.length - 1)
            }
          }
        })
      },
      selectAdmin () { // 选择群管理员
        this.$dispatch('app:main', {
          toName: 'common:areaSelectUser',
          data: {
            users: this.admin,
            title: '区级选人',
            permissions: 2, // 获取全区的学校
            callback: (admin) => {
              let allAdmins = ''
              this.admin = admin
              this.adminNames = ''
              let _this = this
              this.admin.forEach(function (e) {
                _this.adminNames = `${_this.adminNames},${e.name || e.text}`
                if (!e.type) {
                  allAdmins = allAdmins + e.id + ','
                }
                if (e.type === 'department') {
                  e.members.forEach(function (item) {
                    allAdmins = allAdmins + item.id + ','
                  })
                }
              })
              this.admins = allAdmins.substring(0, allAdmins.length - 1)
            }
          }
        })
      }, // selectLeader
      selectLeader () { // 选择群主
        this.$dispatch('app:main', {
          toName: 'common:areaSelectUser',
          data: {
            users: this.leader,
            title: '区级选人',
            mode: 2, // 只选择一个人
            permissions: 2, // 获取全区的学校
            callback: (leader) => {
              console.log('啥意思')
              console.log(leader)
              this.leader = leader
              this.leaderName = leader[0].name || leader[0].text
              this.leaderId = leader[0].id
            }
          }
        })
      }
    },
    components: {
      vPicker,
      vHeader,
      Store
    }
  }
</script>
