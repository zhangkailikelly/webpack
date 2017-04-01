<template>
  <bar v-if="user_role === 4 && isSchool !== 1">
    <bar-item label="申请入群" icon="icon-bianxie" class="green" @click="apply(group_id)" :class="{'color-666': this.applyStatus === 1}"></bar-item>
  </bar>
  <div class="content" @click="hidechoose()">
    <div class="content-block-title">群主</div>
    <div class="list-block">
      <ul>
        <li class="item-content " >
          <div class="item-inner">
            <div class="item-title">
            <a v-link="{name:'homepage', params: {id: leader.id}, query:{page: 1,per_page: 10}}">
              <img class="groupimg" :src="leader.profile_image_url">
            </a>
              <span class="group-name">{{leader.name}} &nbsp&nbsp&nbsp

              </span>
            </div>
            <!-- 判断你是否关注了群主并且你不是系统管理员 -->
            <div class="item-after">
              <div class="follow-box">
                <span class="iconfont-jysq icon-guanzhu follow" v-if="leader.isFollow === 2 && user_type !== 1 && leader.id !== user_id"  @click="follow(leader.id, 2, 'none', 'leader')">
                  <span class="follow-text">关注</span>
                </span>
                <span class="iconfont-jysq icon-quxiaoguanzhu not-follow" v-if="leader.isFollow === 1 && user_type !== 1 && leader.id !== user_id"  @click="follow(leader.id, 1, 'none', 'leader')">
                  <span class="follow-text not-follow-text">取消关注</span>
                </span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="content-block-title">管理员</div>
    <div class="list-block">
      <ul>
        <li class="item-content " v-for="admin in admins" >
          <div class="item-inner">
            <div class="item-title">
              <a v-link="{name: 'homepage', query: {id: admin.id, page: 1, per_page: 10}}">
                <img class="groupimg" :src="admin.profile_image_url"/ >
              </a>
              <span class="group-name">{{admin.name}} &nbsp;&nbsp;&nbsp;
              </span>
            </div>
            <!-- <span class="iconfont-jysq icon-guanzhu follow place" v-if="admin.isFollow === 2 && user_type !== 1 && admin.id !== user_id"  @click="follow(admin.id, 2, $index, 'admin')"></span>
            <span class="iconfont-jysq icon-quxiaoguanzhu not-follow place" v-if="admin.isFollow === 1 && user_type !== 1  && admin.id !== user_id"  @click="follow(admin.id, 1, $index, 'admin')"></span> -->
            <div class="item-after">
              <div class="follow-box">
                <span class="iconfont-jysq icon-guanzhu follow" v-if="admin.isFollow === 2 && user_type !== 1 && admin.id !== user_id"  @click="follow(admin.id, 2, $index, 'admin')">
                  <span class="follow-text">关注</span>
                </span>
                <span class="iconfont-jysq icon-quxiaoguanzhu not-follow" v-if="admin.isFollow === 1 && user_type !== 1  && admin.id !== user_id"  @click="follow(admin.id, 1, $index, 'admin')">
                  <span class="follow-text not-follow-text">取消关注</span>
                </span>
              </div>
              <div class="icon icon-down picker" @click.stop="select($index, 'admin')" v-if="user_role === 1 || user_role === 2"></div>
            </div>
            <div :class="{'is-show': admindexCard === $index , 'is-hidden': true } " v-if="user_role === 1 || user_role === 2">
              <p @click="setadmin(admin.id, $index, 0)">移除管理员</p>
              <p @click="groupremove(admin.id, $index, 'admin')">踢出本群</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="content-block-title item-link">成员</div>
    <div class="list-block">
      <ul>
        <li class="item-content" v-for="member in members" >
          <div class="item-inner">
            <div class="item-title">
              <a v-link="{name: 'homepage', query: {id: member.id, page: 1, per_page: 10}}">
                <img class="groupimg" :src="member.profile_image_url"/ >
              </a>
              <span class="group-name">{{member.name}} &nbsp&nbsp&nbsp;
              </span>
            </div>
            <!-- <span class="iconfont-jysq icon-guanzhu follow place"  v-if="member.isFollow === 2 && user_type !== 1 && member.id !== user_id" @click="follow(member.id, 2, $index, 'member')"></span>
            <span class="iconfont-jysq icon-quxiaoguanzhu not-follow place" v-if="member.isFollow === 1 && user_type !== 1 && member.id !== user_id" @click="follow(member.id, 1, $index, 'member')"></span> -->
            <div class="item-after">
              <div class="follow-box">
                <span class="iconfont-jysq icon-guanzhu follow" v-if="member.isFollow === 2 && user_type !== 1 && member.id !== user_id" @click="follow(member.id, 2, $index, 'member')">
                  <span class="follow-text">关注</span>
                </span>
                <span class="iconfont-jysq icon-quxiaoguanzhu not-follow" v-if="member.isFollow === 1 && user_type !== 1 && member.id !== user_id" @click="follow(member.id, 1, $index, 'member')">
                  <span class="follow-text not-follow-text">取消关注</span>
                </span>
              </div>
              <div class="icon icon-down picker" @click.stop="select($index, 'member')" v-if="user_role === 1 || user_role === 2"></div>
            </div>
            <div :class="{'is-show': mebindexCard === $index , 'is-hidden': true } " v-if="user_role === 1 || user_role === 2">
              <p @click="setadmin(member.id,  $index, 1)">管理员</p>
              <p @click="groupremove(member.id,  $index, 'member')">踢出本群</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <apply-pop :data="applyData"></apply-pop>
</template>
<script>
import $ from 'zepto'
import Store from '../../../assets/js/store.js/src/store.js'
import Bar from '../../../components/Bar'
import BarItem from '../../../components/BarItem'
import applyPop from '../../common/applyPop'
export default {
  ready () {
    $.init()
    this.user_type = Store.get('userInfo').type // 1.系统管理员，2.区管理员，3.校管理员，4.普通教师
    // this.user_role = Store.get('groupInfo').role // 1.群主，2.管理员，3.普通成员，4.非本群成员
    this.user_id = Store.get('userInfo').id
  },
  route: {
    data ({to, next}) {
      this.group_id = to.query.group_id // 疑问:父组件已经取到group_id,子路由的页面是不是不用再取
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
      this.$http.get(`group_member?group_id=` + this.group_id).then(({data}) => {
        this.leader = data.leader
        this.admins = data.admin
        this.members = data.member
        $.hidePreloader()
        // this.all = [this.leader, ...this.admins, ...this.members]
      })
    }
  },
  data () {
    return {
      data: {},
      leader: {},
      admins: [],
      members: [],
      admindexCard: -1, // 设置被选中的管理员的index值
      mebindexCard: -1, // 设置被选中的普通成员的index值
      hidden: true,
      // all: [], // 所有人不分类别合成一个大数组
      user_role: 0,
      user_type: 0,
      group_id: 0, // 疑问：父组件里有，这里还需要注册吗？？？？？？？？？？？？？？？？？？？？
      user_id: 0, // 当前用户的id
      applyData: {
        show: false,
        group_id: ''
      },
      applyStatus: 1,
      isSchool: 1
    }
  },
  methods: {
    // 申请入群
    apply (id) {
      if (this.applyStatus === 1 || this.applyStatus === '1') {
        return
      }
      this.applyData.group_id = id
      this.applyData.show = true
    },
    hidechoose () {
      this.admindexCard = -1
      this.mebindexCard = -1
    },
    // 用来显示隐藏下拉箭头是否弹出框
    select (index, belong) {
      if (belong === 'admin') {
        this.admindexCard = index
        this.mebindexCard = -1
      }
      if (belong === 'member') {
        this.mebindexCard = index
        this.admindexCard = -1
      }
    },
    // 添加/删除管理员:
    setadmin (userid, index, type) {
      this.admindexCard = -1
      this.mebindexCard = -1
      var msg = {
        group_id: this.group_id,
        user_id: userid,
        type: type
      }
      this.$http.post('group_type', msg).then((data) => {
        if (data.data.success) {
          if (type === 0) {
            $.toast(data.data.message)
            this.members.push(this.admins[index])
            this.admins.splice(index, 1)
          }
          if (type === 1) {
            $.toast(data.data.message)
            this.admins.push(this.members[index])
            this.members.splice(index, 1)
          }
          // this.all = [this.leader, ...this.admins, ...this.members]
        }
        if (!data.data.success) {
          $.toast(data.data.message)
        }
      }, ({data}) => {
        $.toast('请求失败', 500)
      })
    },
    // 踢出本群
    groupremove (userid, index, belong) {
      this.admindexCard = -1
      this.mebindexCard = -1
      var msg = {
        group_id: this.group_id,
        user_id: userid
      }
      this.$http.post('group_logout', msg).then((data) => {
        // if (data.status === 204) {
        $.toast('已成功踢出本群', 500)
        if (belong === 'member') {
          this.members.splice(index, 1)
        }
        if (belong === 'admin') {
          this.admins.splice(index, 1)
        }
        // }
      }, ({data}) => {
        $.toast('请求失败', 500)
      })
    },
    // 关注/取消关注
    follow (id, type, index, belong) { // 这里后台应该把以前api里传的true/false改成1/2
      this.$http.post('following/' + id).then(({data}) => {
        if (data.success) {
          if (belong === 'leader') {
            this.leader.isFollow = 3 - type
          }
          if (belong === 'admin') {
            this.admins[index].isFollow = 3 - type
          }
          if (belong === 'member') {
            this.members[index].isFollow = 3 - type
          }
          $.toast(data.message, 500)
        }
        if (!data.success) {
          $.toast(data.message, 500)
        }
      }, ({data}) => {
        $.toast('请求失败', 500)
      })
    }
  },
  components: {
    Store,
    Bar,
    BarItem,
    applyPop
  }
}
</script>

<style scoped>
  /* 拉之前的页面结构有点恶心 */
  .content {
    margin-top: 8.5rem !important;
  }
  img {
    width: 3rem;
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
    margin-top: 0.45rem;
  }
  .group-name {
    /*width: 100%;*/
    padding-left: 2.5rem;
    display: inline-block;
    height: 3rem;
    line-height: 3rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .list-block {
    margin: 0;
  }
  .content-block-title {
    margin: .75rem 0.75rem 0.5rem;
    line-height: 1rem;
  }
  .is-hidden {
    display: none;
  }
  .list-block .item-inner {
    position: initial;
    height: 3rem;
  }
  .is-show {
    background-color: #fff;
    border: 1px #e7e7e7 solid;
    height: 2.2rem;
    font-size: 0.5rem;
    display: inline-block;
    position: absolute;
    top: 1.8rem;
    right: 0.7rem;
    width: 4rem;
    text-align: center;
    z-index: 20;
  }
  .is-show p {
    margin: 0;
    line-height: 1.1rem;
  }
  /*关注/取消关注*/
  /*.follow {
    color: #6bba9c;
  }
  .not-follow {
    color: #a7a7a7;
  }*/
  .iconfont-jysq {
    position: relative;
    font-size: 1.2rem;
    line-height: 1.5rem;
    width: 1.2rem;
    display: block;
    height: 1.2rem;
    top: -.5rem;
  }
  .iconfont-jysq::before {
    display: block;
    height: 1.2rem;
    /*position: relative;
    left: 0.15rem;*/
  }
  .follow {
    color: #1dbc97;
  }
  .not-follow {
    color: #e7e7e7;
  }
  /*.place {
    position: absolute;
    font-size: 1.5rem;
    left: 11.5rem;
  }*/
  .color-666 {
    color: #e7e7e7 !important;
  }
  .follow-text {
    font-size: 0.4rem;
    position: relative;
    top: -.5rem;
    left: 0.1rem;
  }
  .icon-quxiaoguanzhu:before {
    left: 1.2rem
  }
  .not-follow-text {
    left: -0.2rem;
  }
  .follow-box {
    width: 3rem;
  }
  .item-content {
    border-bottom: 1px #eee solid;
  }
</style>
