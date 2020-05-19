/*
 * @Author: helin3
 * @Date: 2019-11-25 11:39:31
 * @LastEditors  : helin3
 * @LastEditTime : 2020-01-16 15:33:04
 * @Description: 键盘
 */

import { PASS } from '../constants'

const { invokeCallbackHandler: invoke } = UniServiceJSBridge

export function showKeyboard (options, callbackId) {
  foxsdk.key.showSoftKeybord(ret => {
    if (ret.status === PASS) {
      invoke(callbackId, {
        errMsg: 'showKeyboard:ok'
      })
    } else {
      invoke(callbackId, {
        errMsg: 'showKeyboard:fail'
      })
    }
  })
}

export function hideKeyboard (options, callbackId) {
  foxsdk.key.hideSoftKeybord(ret => {
    if (ret.status === PASS) {
      invoke(callbackId, {
        errMsg: 'hideKeyboard:ok'
      })
    } else {
      invoke(callbackId, {
        errMsg: 'hideKeyboard:fail'
      })
    }
  })
}
