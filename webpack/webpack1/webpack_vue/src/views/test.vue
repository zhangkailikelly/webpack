<template>
  <header class="bar bar-nav">
    <a class="button button-link button-nav pull-left" v-link="{path: '/feeds', replace: true}">
      <span class="l-icon l-icon-prev"></span>
    </a>
    <h1 class="title">发言</h1>
    <a class="button button-link button-nav pull-right push-button" @click="push()">
      发布
    </a>
  </header>
  <div class="content">
    <div class="publisher-wrapper">
      <textarea class="publisher" placeholder="说点什么..." v-model="feed.text"></textarea>
    </div>

    <div class="publisher-tools row">

      <div class="col-20"><input  id="file" type="file" accept="image/*" class="l-icon l-icon-hdcx" @change="upload(file, $event)"/></div>

      <!--<div class="col-20"><span class="l-icon l-icon-aiziji"></span></div>-->
      <!--<div class="col-20"><span class="l-icon l-icon-10"></span></div>-->
      <!--<div class="pull-right permission"><span class="l-icon l-icon-fensi"></span></div>-->
      <div class="pull-right permission" @click="changePermission()">
        <span class="l-icon" :class="'l-icon-' + icons[permission]"></span>
        <span v-show="permission == 0" class="permission-text permission-text-open">公开</span>
        <span v-show="permission == 1" class="permission-text">粉丝可见</span>
        <span v-show="permission == 2" class="permission-text">仅自己可见</span>
      </div>
     </div>
    <div class="img-preview row" >
      <div class="col-33 img-preview-container" v-for="r in rst" :class="{'x-hidden': $index+1===rst.length && !isDone}">
        <span class="l-icon l-icon-close" @click="removeFile($index)"></span>
        <img  :src="r.base64" alt="">
        <img src="http://h5.sinaimg.cn/weibocn/v6/img/440/loading.96c5cf34.gif" alt="" class="loading">
         <!-- {{progress}} -->
      </div>
      <div class="col-33 img-preview-container l-icon l-icon-shangchuantupian" v-show="rst.length">
        <input  id="file" type="file" accept="image/*"  @change="upload(file, $event)" class="upload-more"/>
      </div>

    </div>
 </div>
</template>

<style scoped>
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
  }
  .permission-text-open {
    position: relative;
    top: .2rem;
  }
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
</style>


<script>

  import $ from 'zepto'
  export default {
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
        isDone: true
      }
    },
    methods: {
      changePermission () {
        this.permission = (this.permission + 1) % 3
      },
      push () {
        this.feed.postFile = ''
        this.files.forEach((ele, index) => {
          this.feed.postFile = this.feed.postFile + ele.id + ':' + ele.name + '.' + ele.type + '|'
        })
        if (this.feed.text || this.files.length) {
          this.feed.permission = this.permission === 2 ? this.permission : this.permission - 1
          this.$http.post('feeds', this.feed).then((data) => {
            console.log(data)
            if (data.data.success) {
              $.toast('发布成功')
              setTimeout(() => {
                this.files = []
                this.rst = []
                this.feed.text = undefined
                this.$route.router.go('/feeds')
              }, 1000)
            }
          })
        }
        else {
          $.toast('请输入动态内容')
        }
      },
      upload: function (file, e) {

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
      }
    }
  }

</script>
