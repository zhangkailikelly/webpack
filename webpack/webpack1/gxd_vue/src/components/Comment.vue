
<!-- 将评论的作为组件pop出来，这样避免，用户在首页滚动加载了很多，评论之后返回不能定位在当前动态 -->
<!-- 使用:

  // 有点笨的方法
  commentObj: { // 评论的当前的动态信息
    show: false,
    curFeed: {},
    placeholder: '发评论...'
  },
  replyObj: { // 如果是回复，就要把回复人的信息带过来
  },
  fromObj: { // 评论回复，在好几个地方用到了，所以说明一下来源，知道callback
    from: 'group_feeds',
    id: ''
  }
 -->
<template>
  <div class="popup" style="display:block;" :class="{'modal-in': data.show, 'modal-out': !data.show}">
    <!-- <nav class="bar bar-tab">
      <a href="javascript:void(0);" class="a-upload">
        <input type="file" name="" accept="image/*" id="file" @change="upload($event)">
        <span class="iconfont-jysq icon-comiistupian font1"></span>
      </a>
    </nav> -->
    <v-header :title="header.title" :back="header.back" :option="header.option"></v-header>
    <textarea placeholder="{{data.placeholder}}" v-model="comments"></textarea>
    <div class="upload-image-box">
      <a href="javascript:void(0);" class="a-upload">
        <input type="file" name="" accept="image/*" id="file" @change="upload($event)">
        <span class="iconfont-jysq icon-comiistupian font1"></span>
      </a>
    </div>
    <div class="row">
      <div class="imgs col-33">
        <span v-if="!uploadFlag && cover_image_base64 && cover_image_base64 !== ''" class="l-icon l-icon-close photo-close" @click="cancelFile()">×</span>
        <img v-if="!uploadFlag && cover_image_base64 && cover_image_base64 !== ''" :src="cover_image_base64" class="item-media"/>
        <!-- <img v-if="!uploadFlag && (!cover_image_base64 || cover_image_base64 === '')" src="../assets/img/icon_img/create-subject.jpg" class="item-media"> -->
        <div class="item-media" v-show="uploadFlag" >
          <img style="margin: auto;" src="http://h5.sinaimg.cn/weibocn/v6/img/440/loading.96c5cf34.gif" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .upload-image-box {
    background-color: #f9f9f9;
    margin-top: -.5rem;
  }
  .icon {
    color: #ccc;
  }
  textarea {
    width: 100%;
    height: 8rem;
    padding: .2rem;
    margin-top: 2.5rem;
    border: none;
    border-bottom: 1px #dadada solid;
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
  .list-block .item-media {
    padding: 0 0;
    height: 4.65rem;
    width: 4.65rem;
  }
  .imgs {
    position: relative;
    height: 4.9rem;
    line-height: 4.9rem;
    text-align: center;
  }
  .imgs span {
    position: absolute;
    top: 0rem;
    right: 0rem;
    height: 0.9rem;
    line-height: .9rem;
  }
  .item-media {
    width: 100%;
    height: 4.9rem;
  }
  .font1 {
    font-size: 1rem;
  }
  .popup {
    z-index: 100000;
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
  .imgs span.photo-close {
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
  import vHeader from '../views/common/header'

  export default {
    props: {
      from: {
        type: Object,
        // from代表来着那个页面，id代表需要回复人的id或者发表群的的群id
        default: { // 若果是index,代表个人页面来的评论，不用id
          from: 'index',
          id: ''
        }
      },
      data: {
        show: true,
        curFeed: {},
        placeholder: ''
      },
      reply: {
        type: Object,
        default: {}
      }
    },
    ready () {
      $.init()
    },
    data () {
      return {
        // jinzk
        // header start
        header: {
          title: this.data.placeholder || '发评论',
          back: function () {
            this.data.show = false
          }.bind(this),
          option: {
            text: '发送',
            go: {
            },
            fn: function () {
              this.submit()
            }.bind(this),
            icon: ''
          }
        },
        comments: '',
        uploadFlag: false,
        cover_image_base64: '',
        group_id: '',
        postFile: ''
      }
    },
    computed: {
    },
    methods: {
      submit () {
        if (!this.comments && !this.postFile) {
          $.toast('请输入评论或添加照片', 500)
          return
        }
        let id = this.data.curFeed.id || this.from.id
        if (!id || id === '') {
          return false
        }
        // 做请求
        // 评论和回复写在一起,这里通过data.reply来判断
        let comments = {}
        comments.text = this.comments
        comments.postFile = this.postFile
        if (this.data.reply) {
          comments.replyId = this.reply.id
        }
        this.$http.post(`feeds/${id}/comments`, comments).then(({data, status}) => {
          if (data.success) {
            $.toast('评论成功', 1000)
            this.comments = ''
            this.cancelFile()
            this.data.curFeed.comments.total_count = this.data.curFeed.comments.total_count + 1
            let _this = this
            setTimeout(function () {
              _this.data.show = false
            }, 1000)
            // 如果是主页只能评论，需要判断评论是不是<=3条，是则评论成功需要重新获取
            // 如果是从详情页调用这个组件，则不需要判断是几条，直接获取
            if ((this.from.from === 'index' || this.from.from === 'group_feeds') && this.data.curFeed.comments.total_count <= 3) { // index 从主页调用，评论数<=3才调用
              this.$http.get(`feeds/${id}/comments`).then(({data}) => {
                this.data.curFeed.comments.data = data
              })
            }
            else if (this.from.from === 'feed') { // feed 从详情调用，必须重新获取评论
              this.$http.get(`feeds/${id}/comments`).then(({data}) => {
                this.data.curFeed.comments.data = data
              })
            }
            // else if (this.from.from === 'group_feeds') { // 群组页面发
            // }
          }
        })
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
          _this.$http.post(`resources/upload`, fd).then(({data}) => {
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
      cancelFile () {
        this.postFile = ''
        this.cover_image_base64 = ''
      }
    },
    components: {
      vHeader
    }
  }
</script>
