/*
 * @Author: chencm
 * @Date: 2020-01-09 19:37:04
 * @LastEditors  : chencm
 * @LastEditTime : 2020-01-09 20:29:45
 * @Description: 描述信息
 */

const callbacks = []
let listenerBKend, listenerFRend

/**
 * @description 监听应用切换到后台
 */
export function onBackEnd (callbackId) {
  callbacks.push(callbackId)
  if (!listenerBKend) {
    // addListener('background');
    const {
      invokeCallbackHandler: invoke
    } = UniServiceJSBridge
    if (foxsdk && foxsdk.events) {
      listenerBKend = function () {
        callbacks.forEach(callbackId => {
          invoke(callbackId, {
            errMsg: 'onBackEnd:ok'
          })
        })
      }
      foxsdk.events.addEventListener('background', listenerBKend)
    }
  }
}

/**
 * @description 监听应用切换到前台
 */
export function onFrontEnd (callbackId) {
  callbacks.push(callbackId)
  if (!listenerFRend) {
    const {
      invokeCallbackHandler: invoke
    } = UniServiceJSBridge
    if (foxsdk && foxsdk.events) {
      listenerFRend = function () {
        callbacks.forEach(callbackId => {
          invoke(callbackId, {
            errMsg: 'onFrontEnd:ok'
          })
        })
      }
      foxsdk.events.addEventListener('foreground', listenerFRend)
    }
  }
}
