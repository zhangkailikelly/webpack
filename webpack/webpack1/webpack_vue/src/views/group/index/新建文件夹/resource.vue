<template>
  <div v-if="total_count === 0" class="no-content">暂无资源</div>
  <bar v-if="user_role === 4 && isSchool !== 1">
    <bar-item label="申请入群" icon="icon-bianxie" class="green" @click="apply(group_id)" :class="{'color-666': this.applyStatus === 1}"></bar-item>
  </bar>
  <div class="content" v-infinite-scroll="loadMore" v-if="total_count !== 0">
    <div class="list-block" >
      <ul>
        <li class="item-content " v-for="resource in resources" @click="openVideo(resource)">
          <div class="item-inner">
            <div class="item-title">
             <!--  <div class="" :class="resource-{{resource.type}}">
              </div> -->
              <img class="groupimg" src="../../../assets/img/icon_img/avi.png" v-if="resource.type === 'avi'"/>
              <img class="groupimg" src="../../../assets/img/icon_img/bmp.png" v-if="resource.type === 'bmp'"/>
              <img class="groupimg" src="../../../assets/img/icon_img/doc.png" v-if="resource.type === 'docx' || 'doc'"/>
              <img class="groupimg" src="../../../assets/img/icon_img/gif.png" v-if="resource.type === 'gif'"/>
              <img class="groupimg" src="../../../assets/img/icon_img/jpg.png" v-if="resource.type === 'jpg'"/>
              <img class="groupimg" src="../../../assets/img/icon_img/pdf.png" v-if="resource.type === 'pdf'"/>
              <img class="groupimg" src="../../../assets/img/icon_img/png.png" v-if="resource.type === 'png'"/>
              <img class="groupimg" src="../../../assets/img/icon_img/ppt.png" v-if="resource.type === 'ppt'"/>
              <div class="group-name">
                <span class="name">{{resource.name}}.{{resource.type}}</span>
                <span class="num">下载量：{{resource.viewCount}}</span>
              </div>
            </div>
            <!-- 操作权限 -->
            <div class="item-after" v-if="groupInfo.role && groupInfo.role !== 4">
              <span class="iconfont-jysq icon-zan" @click.stop="love(resource.id, resource.isLove, $index)" :class="{'state-true': resource.isLove === 1}"></span>
              <span class="iconfont-jysq icon-xiazai" >
                <!-- 从校信来的ios设备 -->
                <a v-if="appFrom == 'xiaoxin' && isiOS" @click.stop="gotoSafari(resource.download_url)">
                </a>
                <!-- 安卓 -->
                <a v-if="isAndroid" @click.stop="download(resource.download_url)"></a>
                <!-- 微信&ios -->
                <a v-if="appFrom == 'weixin' && isiOS"  @click.stop="gotoOpenSafari(resource.download_url)">
                </a>
                <!-- 不是安卓&不是ios -->
                <a v-if="!isAndroid && !isiOS" @click.stop="download(resource.download_url)"></a>
              </span>
              <span class="iconfont-jysq icon-shanchu" v-if="groupInfo.role === 1 || groupInfo.role === 2" @click="delet($index, resource.id)"></span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <div class="open-safari-modal" v-show="openSafariModalFlag" @click="closeOpenSafariModal()">
    <img src="../../../assets/img/open-safari.png" alt="">
  </div>
  <apply-pop :data="applyData"></apply-pop>
  <div class="video-player-box" v-show="videoFlag">
    <span class="close-video" @click="closeVideo()">×</span>
    <div id="video-box"></div>
  </div>
</template>

<script>
  import Store from '../../../assets/js/store.js/src/store.js'
  import {loader} from '../../../util/util'
  import Bar from '../../../components/Bar'
  import BarItem from '../../../components/BarItem'
  import applyPop from '../../common/applyPop'
  require('../../../assets/js/zyMedia/zy.media.min.js') // eslint-disabled-line
  import $ from 'zepto'
  export default {
    ready () {
      $.init()
      this.userInfo = Store.get('userInfo')
      this.groupInfo = Store.get('groupInfo')
      this.appFrom = Store.get('appFrom')
      this.isAndroid = Store.get('isAndroid')
      this.isiOS = Store.get('isiOS')
    },
    route: {
      data ({to, next}) {
        $('#video-box').empty()
        this.videoFlag = false
        this.isRequest = false
        this.loading = false
        this.cur_page = 1
        this.group_id = to.query.group_id
        $.showPreloader('加载中')
        // this.$http.get(`group_info?group_id=${this.group_id}&user_id=${this.user_id}`).then(({data}) => {
        //   this.user_role = data.role
        //   this.applyStatus = data.apply
        //   this.isSchool = data.new_gropu_type === 'isSchool' ? 1 : 0
        // })
        let groupInfo = Store.get('groupInfo')
        this.user_role = groupInfo.role
        this.applyStatus = groupInfo.apply
        this.isSchool = groupInfo.new_gropu_type === 'isSchool' ? 1 : 0
        this.$http.get(`group_resource?group_id=${this.group_id}&page=1&per_page=10`).then(({data}) => {
          this.resources = data.data
          this.total_count = data.total_count
          $.hidePreloader()
        })
      }
    },
    data () {
      return {
        resources: [],
        userInfo: {},
        group_id: 0,
        groupInfo: {},
        user_role: 0,
        cur_page: 1,
        per_page: 10,
        total_count: 0,
        loading: false,
        openSafariModalFlag: false,
        applyData: {
          show: false,
          group_id: ''
        },
        isRequest: false,
        applyStatus: 1,
        isSchool: 1,
        videoFlag: false
      }
    },
    methods: {
      openVideo (video) {
        if (video.status === 0) {
          return
        }
        else {
          let videoDom = $('<video width="100" webkit-playsinline  controls loop="loop" autoplay="true" poster="' + video.cover + '" preload="none" src="' + video.url + '"></video>')
          let dataConfig = {
            'mediaTitle': video.name,
            'autoplay': true
          }
          let dataConfigStr = JSON.stringify(dataConfig)
          videoDom.attr('data-config', dataConfigStr)
          videoDom.appendTo('#video-box')
          /*eslint-disable */
          zymedia('video')
          /*eslint-enable */
          this.videoFlag = true
        }
      },
      closeVideo () {
        $('#video-box').empty()
        this.videoFlag = false
      },
      // 申请入群
      apply (id) {
        if (this.applyStatus === 1 || this.applyStatus === '1') {
          return
        }
        this.applyData.group_id = id
        this.applyData.show = true
      },
      // 点赞资源
      love (id, love, index) {
        console.log(index)
        this.$http.post(`group_resource/like/${id}`, {
          flag: love
        }).then(({data, status}) => {
          if (data.success) {
            $.toast(data.message)
            // console.log(this.resources[index])
            if (love === 1) {
              $.toast(data.message, 500)
              this.resources[index].isLove = 0
            }
            if (love === 0 || !love || love === undefined) {
              $.toast(data.message, 500)
              this.resources[index].isLove = 1
            }
          }
        }, ({data}) => {
          $.toast('请求失败', 500)
        })
      },
      // 删除资源
      delet (index, id) {
        // delete请求 ?version=1.0
        this.$http.delete(`group_resource/${id}`).then(({status}) => {
          // if (status === 204) {
          $.toast('成功删除', 500)
          this.resources.splice(index, 1)
        // }
        }, ({data}) => {
          $.toast('请求失败', 500)
        })
      },
      // 附件下载处理
      /*eslint-disable */
      gotoSafari (url) {
        mCall.downloadFileWithSafari(url)
      },
      /*eslint-enable */
      gotoOpenSafari (url) {
        this.openSafariModalFlag = true
        window.open(url)
      },
      download (url) {
        window.open(url)
      },
      closeOpenSafariModal () {
        this.openSafariModalFlag = false
      },
      // 加载更多
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
        this.loading = true
        let scroller = $('.content')
        var that = this
        loader.show()
        setTimeout(() => {
          that.isRequest = true
          that.$http.get(`group_resource?group_id=${that.group_id}&page=${that.cur_page + 1}&per_page=${that.per_page}`)
          .then(function (data) {
            that.resources = [...that.resources, ...data.data.data]
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
    components: {
      Bar,
      BarItem,
      applyPop
    }
  }
</script>

<style scoped>
  @import '../../../assets/js/zyMedia/zy.media.min.css';
  #video-box {
    height: 100%;
    width: 100%;
  }
  /* 拉之前的页面结构有点恶心 */
  .content {
    margin-top: 8.9rem !important;
  }
  ul {
    background-color: initial;
  }
  li {
    margin-bottom: .5rem;
    background-color: #fff;
  }
  .list-block {
    margin: 0 0;
  }
  .list-block .item-inner {
    position: initial;
    height: 3rem;
  }
  .item-title {
    line-height: 0rem;
    margin-right: .25rem;
  }
  .groupimg {
    position: absolute;
    width: 2rem;
    height: 2rem;
    display: block;
  }
  .group-name {
    padding-left: 2.5rem;
    /* display: inline-block; */
    height: 2rem;
    line-height: 1rem;
  }
  .name {
    display: block;
    font-size: 0.75rem;
    color: #1cbd9d;
  }
  .num {
    font-size: 0.55rem;
  }
  .item-after span {
    margin-left: 1rem;
    font-size: 0.75rem;
    color: #ccc;
    position: relative;
  }
  .item-after span a {
    position: absolute;
    left: 0;
    right: 0;
    width: 1rem;
    height: 1rem;
  }
  .state-true {
    color: #1cbd9d !important;
  }
  .no-content {
    margin-top: 14rem;
    text-align: center;
  }
  .open-safari-modal {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999999;
    background: rgba(33, 32, 32, 0.8);
    width: 100%;
    height: 100%;
  }
  .open-safari-modal img {
    width: 80%;
    margin-left: 10%;
  }
  .color-666 {
    color: #e7e7e7 !important;
  }
</style>
