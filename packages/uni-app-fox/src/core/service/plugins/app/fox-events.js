/*
 * @Author: chencm
 * @Date: 2020-01-10 14:26:31
 * @LastEditors  : chencm
 * @LastEditTime : 2020-01-10 17:30:38
 * @Description: 注册全局监听
 */

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

  foxsdk.events.addEventListener('background', () => {
    emit('onAppEnterBackground')
  })

  foxsdk.events.addEventListener('foreground', () => {
    emit('onAppEnterForeground')
  })

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

  /* foxsdk.events.addEventListener('KeyboardHeightChange', function (event) {
    invoke('onKeyboardHeightChange', {
      height: event.height
    })
    // publish('onKeyboardHeightChange', {
    //     height: event.height
    // })
  }) */

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
