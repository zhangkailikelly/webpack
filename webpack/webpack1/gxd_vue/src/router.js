import $ from 'zepto'

export default function (router) {
  router.map({
    '*': {
      component (resolve) {
        require(['./views/loading'], resolve)
      }
    },
    '/feeds': {
      component (resolve) {
        require(['./views/index'], resolve)
      }
    },
    '/feeds/:id': {
      name: 'feeds',
      component (resolve) {
        require(['./views/feed'], resolve)
      }
    },
    '/messages': {
      component (resolve) {
        require(['./views/messages'], resolve)
      }
    },
    '/about': {
      component (resolve) {
        require(['./views/about'], resolve)
      }
    },
    '/followings': {
      component (resolve) {
        require(['./views/followings'], resolve)
      }
    },
    '/followers': {
      component (resolve) {
        require(['./views/followers'], resolve)
      }
    },
    '/albums': {
      component (resolve) {
        require(['./views/albums'], resolve)
      }
    },
    '/account': {
      component (resolve) {
        require(['./views/account'], resolve)
      }
    },
    '/homepage/:id': {
      name: 'homepage',
      component (resolve) {
        require(['./views/homepage'], resolve)
      }
    },
    '/profile/:id': {
      name: 'profile',
      component (resolve) {
        require(['./views/profile'], resolve)
      }
    },
    '/push': {
      name: 'push',
      component (resolve) {
        require(['./views/push'], resolve)
      }
    },
    '/test': {
      component (resolve) {
        require(['./views/test'], resolve)
      }
    },
    // jinzk 新增路由(群组和发现)
    '/list': {
      name: 'list',
      component (resolve) {
        require(['./views/group/list'], resolve)
      }
    },
    '/group_feeds': {
      name: 'group_feeds',
      component (resolve) {
        require(['./views/group/feeds'], resolve)
      }
    },
    '/detail/:id': {
      name: 'detail',
      component (resolve) {
        require(['./views/group/detail'], resolve)
      }
    },
    '/group_home': {
      name: 'group_home',
      component (resolve) {
        require(['./views/group/index/index'], resolve)
      },
      subRoutes: {
        '/': { // /feeds
          component (resolve) {
            // name: '',
            require(['./views/group/index/feeds'], resolve)
          }
        },
        '/topic': {
          name: 'topic',
          component (resolve) {
            require(['./views/group/index/topic'], resolve)
          }
        },
        '/resource': {
          name: 'resource',
          component (resolve) {
            require(['./views/group/index/resource'], resolve)
          }
        },
        '/member': {
          name: 'member',
          component (resolve) {
            require(['./views/group/index/member'], resolve)
          }
        }
      }
    },
    '/setting': {
      name: 'setting',
      component (resolve) {
        require(['./views/group/setting'], resolve)
      }
    },
    '/choosepage': {
      name: 'choosepage',
      component (resolve) {
        require(['./views/group/create/choosepage'], resolve)
      }
    },
    '/create': {
      name: 'create',
      component (resolve) {
        require(['./views/group/create/create'], resolve)
      }
    },
    '/topics': {
      name: 'topics',
      component (resolve) {
        require(['./views/group/topics'], resolve)
      }
    },
    '/group_f': {
      name: 'group_f',
      component (resolve) {
        require(['./views/find/group'], resolve)
      }
    },
    '/speak_f': {
      name: 'speak_f',
      component (resolve) {
        require(['./views/find/speak'], resolve)
      }
    },
    '/teacher_f': {
      name: 'teacher_f',
      component (resolve) {
        require(['./views/find/teacher'], resolve)
      }
    },
    '/topic_f': {
      name: 'topic_f',
      component (resolve) {
        require(['./views/find/topic'], resolve)
      }
    }
  })

  router.beforeEach(({ to, from, next }) => {
    let toPath = to.path
    let fromPath = from.path
    console.log(' from: ' + fromPath + 'to: ' + toPath)
    // if (toPath.replace(/[^/]/g, '').length > 1) {
    //   router.app.isIndex = false
    // }
    // else {
    //   let depath = toPath === '/' || toPath === '/about' || toPath === '/rank'
    //   router.app.isIndex = depath ? 0 : 1
    // }

    if ((/feeds\/.*/).test(toPath) || (/account/).test(toPath) || (/homepage/).test(toPath) || (/albums/).test(toPath) || (/messages/).test(toPath) || (/build_group/).test(toPath) || (/group_home/).test(toPath) || (/setting/).test(toPath) || (/topics/).test(toPath)) {
      router.app.isIndex = false
    }
    else {
      // console.log(router)
      // console.log(router.app)
      router.app.isIndex = true
    }
    next()
  })

  router.afterEach(function ({ to }) {
    console.log(`成功浏览到: ${to.path}`)
    $.refreshScroller()
  })
}

