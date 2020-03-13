import {
  callAppHook
} from '../util'

import createApp from './create-app'

import initFoxGlobalListeners from './fox-events'

export {
  getApp,
  getCurrentPages
}
  from './create-app'

export function createAppMixin (routes, entryRoute) {
  return {
    created: function AppCreated () {
      createApp(this, routes)

      // inject foxsdk global events to app-fox
      if (__PLATFORM__ === 'app-fox') {
        if (window.foxsdk && foxsdk.events) {
          initFoxGlobalListeners()
        }
      }

      // TODO
      if (!entryRoute.meta.name) { // PageNotFound
        UniServiceJSBridge.emit('onPageNotFound', {
          path: entryRoute.path,
          query: entryRoute.query,
          isEntryPage: true
        })
        // TODO 跳转至缺省404页面
      }
    },

    beforeMount: function appBeforeMount () {
      // TODO 平台代码
      this.$el = document.getElementById('app')
    },
    mounted: function appMounted () {
      // 稍微靠后点，让 App 有机会在 mounted 事件前注册一些全局事件监听，如 UI 显示(showModal)
      const args = {
        path: this.$route.meta && this.$route.meta.pagePath,
        query: this.$route.query,
        scene: 1001
      }
      callAppHook(this, 'onLaunch', args)
      callAppHook(this, 'onShow', args)
    },
    beforeDestroy: function appBeforeDestory () {
      foxsdk.logger.info('全局监听移除====')
    }
  }
}
