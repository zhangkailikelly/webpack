<template>
  <header class="bar bar-nav">
    <!-- jinzk  修改 -->
    <a class="button button-link button-nav pull-left" @click="goback()">
      <!-- v-link="{path: '/feeds', replace: true}" -->
      <span class="icon icon-left"></span>
    </a>
    <h1 class="title">发言</h1>
    <a class="button button-link button-nav pull-right push-button" @click="push()">
      发布
    </a>
  </header>
  <div class="content">
    <div class="publisher-wrapper">
      <textarea class="publisher" placeholder="说点什么..." v-model="text"></textarea>
    </div>

    <div class="publisher-tools row">

      <div class="col-20">
        <a href="javascript:void(0);" class="a-upload">
          <input type="file" name="" accept="image/*" id="file" @change="upload(file, $event)">
          <span class="iconfont-jysq icon-comiistupian font1"></span>
        </a>
      </div>

      <!--<div class="col-20"><span class="l-icon l-icon-aiziji"></span></div>-->
      <!--<div class="col-20"><span class="l-icon l-icon-10"></span></div>-->
      <!--<div class="pull-right permission"><span class="l-icon l-icon-fensi"></span></div>-->
      <div v-if="!group_id || group_id === ''" class="pull-right permission" @click="changePermission()">
        <!-- <span class="l-icon" :class="'l-icon-' + icons[permission]"></span>
        <span v-show="permission == 0" class="permission-text permission-text-open iconfont-jysq icon-earth">公开</span>
        <span v-show="permission == 1" class="permission-text iconfont-jysq icon-qunzuduoren">粉丝可见</span>
        <span v-show="permission == 2" class="permission-text iconfont-jysq icon-qunzuyidong">群组可见</span>
        <span v-show="permission == 3" class="permission-text iconfont-jysq icon-aiziji">仅自己可见</span> -->
        <span style="padding-top: 0.1rem;" class="permission-text permission-text-open" @click="openRangePop()">{{rangePopData.permissionName}}</span>
        <span class="icon icon-right"></span>
      </div>

      <!-- jinzk 群组动态需要选择是否发送到个人动态 -->
      <div v-if="group_id" class="pull-right permission" @click="changeMyFeeds()">
        <span class="l-icon" :class="'l-icon-' + icons[isMyFeeds]"></span>
        <span v-show="isMyFeeds == 1" class="permission-text permission-text-open">
        <span class="iconfont-jysq icon-iconfont93 font1"></span>&nbsp;发送到个人动态</span>
        <span v-show="isMyFeeds == 2" class="permission-text">
        <span class="iconfont-jysq icon-iconfont92 font1"></span>&nbsp;发送到个人动态</span>
        <!-- <span v-show="isMyFeeds == 2" class="permission-text">仅自己可见</span> -->
      </div>
     </div>
    <div class="img-preview row" >
      <div class="col-33 img-preview-container" v-for="r in rst" :class="{'x-hidden': $index+1===rst.length && !isDone}">
        <span class="l-icon l-icon-close photo-close" @click="removeFile($index)">×</span>
        <img  :src="r.base64" alt="">
        <img src="http://h5.sinaimg.cn/weibocn/v6/img/440/loading.96c5cf34.gif" alt="" class="loading">
         <!-- {{progress}} -->
      </div>
      <div class="col-33 img-preview-container l-icon l-icon-shangchuantupian" v-show="rst.length">
        <input  id="file" type="file" accept="image/*"  @change="upload(file, $event)"  class="upload-more"/>
      </div>

    </div>
 </div>
 <range-pop :data.sync="rangePopData"></range-pop>
</template>

<style scoped>
  .content {
    top: 2.5rem;
  }
  .a-upload {
      position: relative;
      margin-left: 0.75rem;
      cursor: pointer;
      color: #a7a7a7;
      overflow: hidden;
      display: inline-block;
      margin-top: 0.5rem;
      *display: inline;
      *zoom: 1
    }
    .a-upload  input {
      position: absolute;
      right: 0;
      top: 0;
      padding-top: 2rem;
      z-index: 1000;
    }
    .font1 {
      font-size: 1rem;
    }
    .icon-iconfont93 {
      color: #1dbc97;
    }
    .bar-nav h1,
    .bar-nav a {
      color: #fff;
    }
    .bar-nav .push-button {
      font-size: .8rem;
      margin-right: .1rem;
    }
    .bar-nav {
      background-color: #1cbd9d;
    }
    .publisher {
      width: 100%;
      height: 8rem;
      padding: .2rem;
      border: none;
      background-image: -webkit-gradient(linear,left top,left bottom,color-stop(50%,#dadada),color-stop(50%,#dadada),color-stop(100%,#fff));
      background-image: -webkit-linear-gradient(top,#dadada 50%,#dadada 50%,#fff 100%);
      background-image: inear-gradient(to bottom,#dadada 50%,#dadada 50%,#fff 100%);
      background-size: 100% 1px;
      background-repeat: no-repeat;
      background-position: bottom;
    }
    .publisher-tools .l-icon  {
      padding: .5rem
    }
    .publisher-tools {
        background: #f9f9f9;
        margin-top: -.4rem;
        border: none;
        background-image: -webkit-gradient(linear,left top,left bottom,color-stop(50%,transparent),color-stop(50%,transparent),color-stop(100%,#dadada));
        background-image: -webkit-linear-gradient(top,transparent 50%,#dadada 50%,#dadada 100%);
        background-image: linear-gradient(to bottom,transparent 50%,#dadada 50%,#dadada 100%);
        background-size: 100% 1px;
        background-repeat: no-repeat;
        background-position: bottom;
    }
    .publisher-tools .permission {
        margin-right: 1rem;
      }
    .publisher-tools .l-icon-hdcx  {
      padding-top: .3rem;
      padding-bottom: 0;
      white-space: nowrap;
      width: 1.5rem;
      font-size: 1.1rem;
    }
    .publisher-tools .l-icon-aiziji:before {
      font-size:1.4rem;
    }
    .publisher-tools .l-icon-aiziji {
      margin-top: -.5rem;
      padding-bottom: 0;
    }
    .publisher-tools .l-icon-10:before {
      font-size:1.2rem;
    }
    .publisher-tools .l-icon-10 {
      margin-top: -.3rem;
      padding-bottom: 0;
    }
    .permission-text {
      display: inline-block;
      font-size: .75rem;
      margin-left: -.5rem;
      margin-top: 0.5rem;
    }
  /*  .permission-text-open {
      position: relative;
      top: .2rem;
    }*/
    .img-preview img {
      max-width: 100%;
      width: 100%;
      height: 4.9rem;
    }
    .l-icon-close {
      position: absolute;
      right: 0;
      top: 0;
    }
    .img-preview-container {
      position: relative;
    }
    .l-icon-shangchuantupian:before {
      line-height: initial;
      font-size: 4.4rem;
      color: #cbcbcb;
    }
    .upload-more {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
    .x-hidden img,
    .x-hidden span {
      display: none;
    }
    .x-hidden .loading{
      display: inline;
      height: auto;
      width: auto;
    }
    .x-hidden {
      height: 4.9rem;
      /*outline: .1rem solid #ccc;*/
      text-align: center;
      line-height: 5.4rem;
      margin-bottom: .4rem;
    }
    .loading {
      display: none;
    }
    .photo-close {
      width: .75rem;
      height: .75rem;
      background-color: #ccc;
      color: #fff;
      line-height: 0.6rem;
      text-align: center;
      border-radius: 50%;
    }
</style>


<script>

  import $ from 'zepto'
  import RangePop from './common/RangePop'
  export default {
    // jinzk edit
    route: {
      data ({to, next}) {
        this.rangePopData.permission = -1
        this.rangePopData.permissionName = '公开'
        this.rangePopData.group_id = ''
        // 如果路由带了group_id 则代表发表的是群组的动态或者话题，负责就是个人的了
        // type来区分发表的是啥。动态，话题,话题下的发言，决定有没有#
        if (to.query.topic_name) {
          this.topic_name = to.query.topic_name
        }
        else {
          this.topic_name = ''
        }
        if (to.query.type) {
          this.type = to.query.type
        }
        else {
          this.type = ''
        }
        if (to.query.group_id) { //
          this.group_id = to.query.group_id
        }
        else {
          this.group_id = ''
        }
      }
    },
    data () {
      return {
        icons: [ '10', 'fensi', 'aiziji'],
        // TODO 需要修改
// 0 公开 1 粉丝可见 2仅自己可见
//       (-1: 公开 0: 粉丝可见 1: 群组可见 2: 仅自己可见)
        permission: 0,
        feed: {
        },
        files: [],
        rst: [],
        progress: 0,
        isDone: true,
        group_id: '',
        isMyFeeds: 2,
        type: '',
        text: '',
        topic_name: '',
        rangePopData: {
          show: false,
          permission: -1,
          group_id: '',
          permissionName: '公开'
        }
      }
    },
    methods: {
      changePermission () {
        this.permission = (this.permission + 1) % 4
      },
      push () { // 目前只是把html上加了群组可见标签
        this.feed.postFile = ''
        this.files.forEach((ele, index) => {
          this.feed.postFile = this.feed.postFile + ele.id + ':' + ele.name + '.' + ele.type + '|'
        })
        if (this.text || this.files.length) {
          if (this.group_id || this.rangePopData.permission === 1) {
            this.feed.forumId = this.group_id || this.rangePopData.group_id
            this.feed.isMyFeeds = this.isMyFeeds
            this.feed.permission = 1 // 群组动态写死
            this.feed.text = this.text
            if (this.type === 'topic') {
              this.feed.text = `#${this.feed.text}#`
              // 后台说不能有英文的?。。。那我就偷偷的替换为中文吧，反正都是问号
              this.feed.text = this.feed.text.replace(/\?/g, '？')
            }
          }
          else {
            this.feed.text = this.text
            this.feed.permission = this.rangePopData.permission // this.permission - 1 // === 2 ? this.permission : this.permission - 1
          }
          // 话题下的发言还要带上#话题的名称#,擦擦擦擦擦
          if (this.topic_name) {
            this.feed.text = `#${this.topic_name}#${this.feed.text}`
          }
          this.$http.post('feeds', this.feed).then((data) => {
            if (data.data.success) {
              $.toast('发布成功', 500)
              setTimeout(() => {
                this.files = []
                this.rst = []
                this.text = undefined
                this.feed.text = undefined
                // this.$route.router.go('/feeds')
                window.history.back()
              }, 530)
            }
          })
        }
        else {
          $.toast('请输入动态内容', 500)
        }
      },
      upload: function (file, e) {
        if (this.rst.length === 8) {
          $.toast('最多只能添加8张图片', 500)
          return
        }
        this.isDone = false
        function dataURItoBlob (dataURI) {
          var byteString = atob(dataURI.split(',')[1])
          var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
          var ab = new ArrayBuffer(byteString.length)
          var ia = new Uint8Array(ab)
          for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i)
          }
          return new Blob([ab], {type: mimeString})
        }

        var that = this
        let f = e.target.files[0]
        var reader = new FileReader()

        var fd = new FormData()
        reader.onloadend = function () {
          var dataURL = reader.result
          that.rst.push({
            base64: dataURL
          })

          fd.append('attach', dataURItoBlob(dataURL), f.name)

          that.$http.post('resources/upload', fd).then(({data}) => {
            that.isDone = true
            that.files.push(data)
          })
        }
        reader.readAsDataURL(f)
      },
      removeFile (index) {
        this.files.splice(index, 1)
        this.rst.splice(index, 1)
      },
      // jinzk
      goback () {
        window.history.back()
      },
      changeMyFeeds () {
        if (this.isMyFeeds === 1) {
          this.isMyFeeds = 2
        }
        else {
          this.isMyFeeds = 1
        }
      },
      // 选择发送到群组pop
      openRangePop () {
        this.rangePopData.show = true
      }
    },
    components: {
      RangePop
    }
  }

</script>
