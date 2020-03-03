/*
 * @Author: helin3
 * @Date: 2020-01-16 10:59:05
 * @LastEditors  : helin3
 * @LastEditTime : 2020-01-16 18:06:20
 * @Description: 屏幕亮度、截屏
 */
import { PASS } from '../constants'
import { invoke } from 'uni-core/service/bridge'
import { onMethod } from 'uni-core/service/platform'

export function getScreenBrightness (options, callbackId) {
  foxsdk.screen.getScreenBrightness(ret => {
    if (ret.status === PASS) {
      invoke(callbackId, {
        value: ret.payload.value,
        errMsg: 'getScreenBrightness:ok'
      })
    } else {
      invoke(callbackId, {
        errMsg: 'getScreenBrightness:fail'
      })
    }
  })
}

export function setScreenBrightness ({ value } = {}, callbackId) {
  foxsdk.screen.setScreenBrightness(value, ret => {
    if (ret.status === PASS) {
      invoke(callbackId, {
        errMsg: 'setScreenBrightness:ok'
      })
    } else {
      invoke(callbackId, {
        errMsg: 'setScreenBrightness:fail'
      })
    }
  })
}

export function setKeepScreenOn ({ keepScreenOn } = {}, callbackId) {
  foxsdk.screen.setKeepScreenOn(!!keepScreenOn, ret => {
    if (ret.status === PASS) {
      invoke(callbackId, {
        errMsg: 'setKeepScreenOn:ok'
      })
    } else {
      invoke(callbackId, {
        errMsg: 'setKeepScreenOn:fail'
      })
    }
  })
}

const callbacks = []

onMethod('onUserCaptureScreen', res => {
  callbacks.forEach(callbackId => {
    invoke(callbackId, res)
  })
})

export function onUserCaptureScreen (callbackId) {
  callbacks.push(callbackId)
}
