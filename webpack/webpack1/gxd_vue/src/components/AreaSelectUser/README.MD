# 区级选人控件

### 依赖组件

- [arrayUtil](http://gitlab.lezhixing.com.cn/fe-team/maroon/blob/master/src/utils/arrayUtil.js)
- [sessionStoreUtil](http://gitlab.lezhixing.com.cn/fe-team/maroon/blob/master/src/utils/sessionStoreUtil.js)
- [Guid](http://gitlab.lezhixing.com.cn/fe-team/maroon/blob/master/src/utils/guid.js)
- [Select](http://gitlab.lezhixing.com.cn/fe-team/maroon/blob/master/src/components/Select.vue)

### 依赖库

- [vue-touch](https://github.com/vuejs/vue-touch)

### 依赖css

```css
@font-face {font-family: "xrkj";
  src: url('../fonts/xrkjfont.eot'); /* IE9*/
  src: url('../fonts/xrkjfont.eot#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('../fonts/xrkjfont.woff') format('woff'), /* chrome, firefox */
  url('../fonts/xrkjfont.ttf') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
  url('../fonts/xrkjfont.svg#xrkj') format('svg'); /* iOS 4.1- */
}

.xrkj {
  font-family:"xrkj" !important;
  font-size:16px;
  font-style:normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
}

.xrkj-sousuo:before { content: "\e604"; }

.xrkj-fanhui:before { content: "\e605"; }

.xrkj-xuanze:before { content: "\e6da"; }

.xrkj-xuanze1:before { content: "\e64c"; }

.xrkj-jiazai:before { content: "\e61c"; }

/*加载动画*/
.loading{
  -webkit-animation: load 1s linear infinite;
  animation: load 1s linear infinite;
  font-size: 1.5rem;
  float: right;
}
@-webkit-keyframes load{
  0%{-webkit-transform: rotate(0deg); }
  100%{-webkit-transform: rotate(360deg); }
}
@keyframes load{
  0%{transform: rotate(0deg); }
  100%{transform: rotate(360deg); }
}

```


### 调用方式

```javascript
// 在main.vue中注册,使用方法参考main.vue
```

```javascript
// 调用的组件
this.$dispatch('app:main', {
  toName: 'common:selectUser',
  data: {
    users: this.recivers, // 当前已经选择的内容，数组
    title: '校级选人', // 组件title
    mode: 2, // 模式
    permissions: 2, // 获取学校列表权限接口。（0表示不设置也就是安装后端默认的，1表示只允许获取本校，2表示允许获取全区）。
    callback: (recivers) => {
      this.recivers = recivers // 选择的结果。
    }
  }
})
```
- `mode`:选人控件的模式，number
  + 0: 直接选择部门和选中的人，不返回部门下的人。
  + 1：也就是可以多选，可以直接选择部门，返回内容还包含部门的每一个人（放在members）中。
  + 2：单人选择模式，只允许选择一个人。
