
## TODOS

- [x] 1.消息中心和曾俊跟进
- [X] 2.发动态页面上传图片,预览图片,切换 permission 发布
   - [x] 发动态 请求失败
   - [x] 上传图片失败
   - [x] 发送完成之后 应该清空页面 再进行跳转 $toast (发送成功)
   - [x] 查看动态详情 后端只返回了 3条评论
   - [x] 动态详情的评论时间还是有问题的
   - [x] 少了一个转发的接口
- [ ] 3.预览相片
- [ ] 4.在手机上每个页面过一遍, 保持页面一致性,保持交互完整




 ##  1. 组件


 -  header：

    * 1. 全部动态  [message]
    * 2. [return]  消息
    * 3. [return]  动态详情
    * 4. [return] 10人赞过 [refresh]
    * 5. [return]  发表动态 [publish]
    * 6. 我
    * 7. [return] 账号信息
    * 8. [return] 联系人
    * 9. [return]  个人资料 [加关注]
    * 10.[return]  个人主页



- footer

  - [首页] [发布动态] [我]
  - [赞]  [评论] [转发] [分享]


- 发表动态


  点击 footer --> [文本] [拍照] [相册]
                  ----> 文本
                  ----> 唤起拍照
                  ----> 唤起相册
                  ----> 发动态界面


##  2. 路由设计

（我需要知道我是谁吗）

-  /            ---> 动态详情页


-  /feeds/:id  ---> 某条动态详情  包含所有赞 所有评论


-  /messages   ----> 消息


- /about            ------> 我 （点头像进入我的主页）


- /followings     -----> 我关注的人


- /followers     ------> 我的粉丝

- /albums      ----> 我的相册

- /account    ----> 账号信息

- /homepage/:id   ----> 个人主页(默认为自己，加ID 为别人)

- /profile    -----> 个人资料


## 教研社区第二次改进(评论可以上传图片, 新增群组发表评论)
之前的api文档是用gulp-api写的，现在用aglio写需要新增依赖

## aglio生成 API 文档自定义设置部分(取消CDN)

/node_modules/aglio-theme-olio/templates/index.jade
第九行：
https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css
改为：
link(rel="stylesheet", href="./font-awesome.min.css")
改为本地


/node_modules/aglio-theme-olio/styles/variables-default.less
第一行
@import url('https://fonts.googleapis.com/css?family=Roboto:400,700|Inconsolata|Raleway:200');
改为：
@import url('./font.css');
