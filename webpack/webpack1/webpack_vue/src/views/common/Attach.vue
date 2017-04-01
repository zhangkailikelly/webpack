<template>
  <div class="list-block" :class="{'feeds-attach': isRetweeted === 0}">
    <ul>
      <li v-for="file in files">
        <span class="icon icon-download"></span>
        <!-- 从校信来的ios设备 -->
        <a v-if="appFrom == 'xiaoxin' && isiOS" @click="gotoSafari(file.download_url)">
          {{file.name}}.{{file.type}}
        </a>
        <!-- 安卓 -->
        <a v-if="isAndroid" href="{{file.download_url}}">{{file.name}}.{{file.type}}</a>
        <!-- 微信&ios weixin-->
        <a v-if="appFrom == 'weixin' && isiOS"  @click="gotoOpenSafari(file.download_url)">
          {{file.name}}.{{file.type}}
        </a>
        <!-- 不是安卓&不是ios -->
        <a v-if="!isAndroid && !isiOS" href="{{file.download_url}}">{{file.name}}.{{file.type}}</a>
        <!-- <span>{{file.name}}</span> -->
      </li>
    </ul>
  </div>
</template>
<style scoped>
  /*.feeds-attach {
    margin: .5rem;
  }*/
  li {
    margin-top: .25rem;
  }
</style>
<script>
  import Store from '../../assets/js/store.js/src/store.js'
  import $ from 'zepto'
  export default {
    props: {
      files: [],
      openSafariModalFlag: false,
      isRetweeted: {
        type: Number,
        default: 0
      }
    },
    ready () {
      $.init()
      this.appFrom = Store.get('appFrom')
      this.isAndroid = Store.get('isAndroid')
      this.isiOS = Store.get('isiOS')
    },
    methods: {
      // 附件下载处理
      /*eslint-disable */
      gotoSafari (url) {
        mCall.downloadFileWithSafari(url)
      },
      /*eslint-enable */
      gotoOpenSafari (url) {
        this.openSafariModalFlag = true
        window.open(url)
      }
    },
    data () {
      return {
        appFrom: '',
        isAndroid: false,
        isiOS: false
      }
    },
    components: {
    }
  }
</script>
