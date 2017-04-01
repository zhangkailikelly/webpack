<template>
  <v-header :title="header.title" :back="header.back" :option.sync
  ="header.option"></v-header>
  <div class="content">
    <div class="list-block ">
      <ul>
        <li class="item-content" :class="{'item-link': role === 1 ||role === 2}">
          <div class="item-inner">
            <div class="item-title">
              <!-- 如果上传完成（关闭）且已经生成非空的base64，则显示上传的这个图片 -->
              <img v-if="!uploadFlag && cover_image_base64 && cover_image_base64 !== ''" :src="cover_image_base64" class="item-media"/>
              <!-- 如果上传完成（关闭）但是还未生成base64或生成空的base64并且以前的图片还存在,则显示以前的图片 -->
              <img v-if="!uploadFlag && groupInfo.cover_image_url !== '' && (!cover_image_base64 || cover_image_base64 === '')" :src="groupInfo.cover_image_url" class="item-media">
              <!-- 如果上传完成（关闭）但是还未生成base64或生成空的base64,则显示默认图片 -->
              <img v-if="!uploadFlag && groupInfo.cover_image_url === '' && (!cover_image_base64 || cover_image_base64 === '')" src="../../assets/img/icon_img/create-subject.jpg" class="item-media">
              <!-- 如果图片未上传完成，则显示loading图片 -->
              <div class="item-media" v-show="uploadFlag" >
                <img style="margin: auto;" src="http://h5.sinaimg.cn/weibocn/v6/img/440/loading.96c5cf34.gif" alt="">
              </div>
            </div>
            <div class="gray size14 item-after" v-if="role === 1 || role === 2">
              <a href="javascript:void(0);" class="a-upload">
                <input type="file" name="" accept="image/*" id="file" @change="upload($event)">修改群头像
              </a>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="list-block">
      <ul>
        <li class="item-content">
          <div class="item-inner">
            <div class="item-title size14">群名称</div>
            <div class="group-name gray size14 item-after">
              <span v-if="role === 3 || role === 4">{{groupInfo.name}}</span>
              <input class="group-name-input" type="text" v-model="groupInfo.name" v-if="role === 1 || role === 2"/>
            </div>
          </div>
        </li>
        <li class="item-content">
          <div class="item-inner">
            <div class="item-title  size14">群简介</div>
            <div class="item-after gray"></div>
          </div>
        </li>
        <li class="item-content">
          <div class="gray description">
            <div class="show" v-if="role === 3 || role === 4">{{groupInfo.description}}</div>
            <textarea v-model="groupInfo.description" v-if="role === 1 || role === 2"></textarea>
          </div>
        </li>
      </ul>
    </div>
    <div class="list-block" v-if="groupInfo.new_gropu_type === 'subject'">
      <ul>
        <li class="item-content">
          <div class="item-inner">
            <div class="item-title size14">类型</div>
            <div class=" gray size14 item-after" style="font-size: 0.85rem">{{groupInfo.type.name}}</div>
          </div>
        </li>
        <li class="item-content" :class="{'item-link': !isDaXing || (isDaXing && go_type === 2)}">
          <div class="item-inner">
            <div class="item-title da-xing size14">学段</div>
            <v-picker v-if="levels && levels.length > 0 && ((isDaXing && go_type === 2) || !isDaXing)" :values="levels" :placeholder="groupInfo.level.name" id="levels" :result.sync="level"></v-picker>

            <div v-else class="item-after gray size14" style="font-size: 0.85rem" v-if="groupInfo.level">{{groupInfo.level.name}}</div>
          </div>
        </li>
        <li class="item-content" :class="{'item-link': !isDaXing || (isDaXing && go_type === 2)}">
          <div class="item-inner">
            <div class="item-title da-xing size14">学科</div>
             <v-picker v-if="subjects && subjects.length > 0 && ((isDaXing && go_type === 2) || !isDaXing)" :values="subjects" :placeholder="groupInfo.subject.name" id="subjects" :result.sync="subject"></v-picker>
            <div v-else class="item-after gray size14" style="font-size: 0.85rem" v-if="groupInfo.subject">{{groupInfo.subject.name}}</div>
          </div>
        </li>
      </ul>
    </div>
    <div class="content-block" v-show="groupType !== 'isSchool'">
      <p><a class="button button-fill button-warning"  @click='dissolve()' v-if="role === 1">解散该群</a></p>
      <p><a class="button button-fill button-warning" @click='quit()' v-if="role !== 4 && role !== 1">退群</a></p>
    </div>
  </div>

</template>
<style scoped>
  .da-xing {
    min-width: 2rem;
  }
  /* 上传样式美化开始 */
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
    height: 3rem;
    width: 3rem;
  }
  /*上传样式美化结束*/
  .list-block {
    background-color: #fff;
    margin: 0.75rem 0 0 0;
  }
  .list-block .size14 {
    font-size: 14px;
  }
  .list-block .gray {
    color: #a7a7a7;
    font-family: ' Microsoft YaHei';
  }
  .list-block ul:after {
    content: none;
  }
  .group-name-input {
    height: 1.4rem !important;
    text-align: right;
    padding-right: .5rem;
    color: #a7a7a7 !important;
  }
  .group-name .textarea {
    color: #a7a7a7;
  }
  .group-name-input:focus, .group-name-input:focus, textarea:focus {
    border: 1px solid #6bba9c;
    border-radius: 0.25rem;
  }
  .description {
    width: 100%;
    padding: 0.75rem .75rem .75rem 0;
  }
  .show {
    padding-left: 1rem;
    font-size: 0.75rem;
    color: #000;
  }
</style>
<script>
  import $ from 'zepto'
  import vHeader from '../common/header'
  import Store from '../../assets/js/store.js/src/store.js'
  import vPicker from '../common/picker'
  export default {
    ready () {
      $.init()
    },
    watch: {
      'level': 'settingLevelGroupName',
      'subject': 'settingSubjectGroupName'
    },
    route: {
      data ({to, next}) {
        this.groupInfo = Store.get('groupInfo')
        this.groupType = this.groupInfo.new_gropu_type
        this.level.name = this.groupInfo.level.name
        this.subject.name = this.groupInfo.subject.name
        this.userId = Store.get('userInfo').id
        this.userType = Store.get('userInfo').type
        this.isDaXing = Store.get('userInfo').isDaXing
        // 1:群主,2:管理员,3:普通成员,4:不是本群成员
        this.role = this.groupInfo.role
        this.groupId = to.query.group_id
        this.from = to.query.from
        // 如果是普通成员和非本群成员则不显示保存按钮
        if (this.role === 3 || this.role === 4) {
          this.header.option.text = ''
        }
        else {
          this.header.option.text = '保存'
        }
        // 判断是不是大兴,必须是区管理员 (可修改学科和学段)
        let user_type = Store.get('userInfo').type.join(',')
        this.go_type = 4
        if (user_type.indexOf('2') !== -1) {
          this.go_type = 2
        }
        else if (user_type.indexOf('3') !== -1) {
          this.go_type = 3
        }
        else if (user_type.indexOf('1') !== -1) {
          this.go_type = 1
        }
        else {
          this.go_type = 4
        }
        // 获取学段和学科
        if (!this.isDaXing || (this.isDaXing && this.go_type === 2)) { // 如果是新建学科群，则获取学段，学科
          return Promise.all([
            this.$http.get(`group_level`),
            this.$http.get(`group_subject`)
          ]).then(([levels, subjects]) => {
            this.levels = levels.data
            this.subjects = subjects.data
          })
        }
      }
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
      // 保存群修改
      setting () {
        if (this.groupInfo.name.length > 20) {
          $.toast('群名称不得超过20个字')
          return
        }
        if (this.groupInfo.description.length > 200) {
          $.toast('群简介不得超过200个字', 500)
          return
        }
        let obj = {}
        obj.postFile = this.postfile
        obj.name = this.groupInfo.name
        obj.description = this.groupInfo.description
        if (this.level && this.level.id !== '') {
          obj.level = this.level.id
        }
        if (this.subject && this.subject.id !== '') {
          obj.subject = this.subject.id
        }
        this.$http.post(`group_info/${this.groupId}`, obj).then(({data}) => {
          // 成功给予提示
          if (data.success) {
            $.toast(data.message, 500)
            let _this = this
            setTimeout(function () {
            // 修改成功跳转该群主页
              _this.$route.router.go({name: 'group_home', query: {group_id: _this.groupId, user_id: _this.userId, from: _this.from}})
            }, 1100)
          }
          if (!data.success) {
            $.toast(data.message)
          }
        }, ({data}) => {
          // 错误给予提示
          $.toast('请求失败')
        })
      },
      // 解散该群
      dissolve () {
        let _this = this
        $.confirm('确定解散本群？', function () {
          _this.$http.post(`group_disband/${_this.groupId}`).then(({data, status}) => {
            if (status === 204) {
              $.toast('成功解散本群', 500)
              setTimeout(() => {
                if (_this.from === 'list') {
                  _this.$route.router.go('/list')
                }
                if (_this.from === 'find') {
                  _this.$route.router.go('/group_f')
                }
              }, 530)
            }
          })
        })
      },
      // 退群
      quit () {
        let _this = this
        $.confirm('确定退出本群？', function () {
          var msg = {
            group_id: _this.groupId,
            user_id: _this.userId
          }
          _this.$http.post(`group_logout`, msg).then(({data, status}) => {
            if (status === 204) {
              $.toast(data.message || '已成功退群', 500)
              setTimeout(() => {
                if (_this.from === 'list') {
                  _this.$route.router.go('/list')
                }
                if (_this.from === 'find') {
                  _this.$route.router.go('/group_f')
                }
              }, 530)
            }
          }, ({data}) => {
            $.toast('请求失败', 500)
          })
        })
      },
      // 上传图片
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
            _this.postfile = `${data.id}:${data.name}.${data.type}|`
            _this.uploadFlag = false // close loading
          })
        }
      },
      // 上传图片
      dataURItoBlob (dataURI) { // 上传的二进制文件数据，处理方法
        var byteString = atob(dataURI.split(',')[1])
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
        var ab = new ArrayBuffer(byteString.length)
        var ia = new Uint8Array(ab)
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i)
        }
        return new Blob([ab], {type: mimeString})
      }
    },
    data () {
      return {
        // jinzk
        // header start
        header: {
          title: '群设置',
          back: () => {
            window.history.back()
          },
          option: {
            text: '保存',
            go: {
              route: ''
            },
            fn: function () {
              this.setting()
            }.bind(this),
            icon: ''
          }
        },
        // header end
        groupInfo: {},
        // settingObj: {},
        groupId: 1, // 群组id
        from: '',
        userId: 1, // 用户id
        // 上传图片
        cover_image_base64: '',
        uploadFlag: false,
        role: 0, // 用户在当前群中担任的角色
        postfile: '',
        userType: '', // 用户角色
        go_type: 4, // 用于判断
        isDaXing: false, // 是不是大兴
        levels: [],
        level: {
          id: '',
          name: ''
        },
        subjects: [],
        subject: {
          id: '',
          name: ''
        },
        groupType: ''
      }
    },
    components: {
      vHeader,
      Store,
      vPicker
    }
  }
</script>
