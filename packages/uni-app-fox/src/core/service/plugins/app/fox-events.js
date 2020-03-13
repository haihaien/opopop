/*
 * @Author: chencm
 * @Date: 2020-01-10 14:26:31
 * @LastEditors  : helin3
 * @LastEditTime : 2020-01-16 18:05:54
 * @Description: 注册全局监听
 */
const PASS = '0'
foxsdk.logger.info('全局监听添加====')
window.eventsCbId = {}
/**
 * 触发 service 层，与 onMethod 对应
 */
const publish = function (name, res) {
  return UniServiceJSBridge.emit('api.' + name, res)
}
/* const NETWORK_TYPES = []

;(function () {
  if (window.foxsdk) {
    var networkinfos = foxsdk.networkinfo
    for (let net in networkinfos) {
      if (net && net.startsWith('CONNECTION_')) {
        NETWORK_TYPES.push(net)
      }
    }
  }
})() */

/**
 * 自动绑定事件:
 * 1.切换到前台
 * 2.切换到后台
 */
export default function initFoxGlobalListeners () {
  const emit = UniServiceJSBridge.emit
  // const invoke = UniServiceJSBridge.invokeCallbackHandler

  /* foxsdk.events.addEventListener('backbutton', () => {
    uni.navigateBack({
      from: 'backbutton'
    })
  }) */

  foxsdk.events.addEventListener('background', (res) => {
    emit('onAppEnterBackground')
  }, 0)

  foxsdk.events.addEventListener('foreground', (res) => {
    emit('onAppEnterForeground')
  }, 0)

  /* foxsdk.events.addEventListener('netchange', () => {
    foxsdk.networkinfo.getCurrentType(ret => {
      const networkType = NETWORK_TYPES[ret.type]
      // publish('onNetworkStatusChange', {
      //     isConnected: networkType !== 'CONNECTION_NONE',
      //     networkType
      // })
      invoke('onNetworkStatusChange', {
        isConnected: networkType !== 'CONNECTION_NONE',
        networkType
      })
    })
  }) */

  foxsdk.key.onKeyboardHeightChange(function (ret) {
    if (ret.status === PASS) {
      publish('onKeyboardHeightChange', {
        height: ret.payload.height
      })
    }
  }, 0)

  foxsdk.screen.onUserCaptureScreen(function (ret) {
    if (ret.status === PASS) {
      publish('onUserCaptureScreen', {})
    }
  }, 0)

  /* foxsdk.events.addEventListener('plusMessage', function (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('UNIAPP[plusMessage]:[' + Date.now() + ']' + JSON.stringify(e.data))
    }
    if (e.data && e.data.type) {
      const type = e.data.type
      consumePlusMessage(type, e.data.args || {})
    }
  }) */
}
