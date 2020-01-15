/*
 * @Author: helin3
 * @Date: 2020-01-15 15:43:22
 * @LastEditors  : helin3
 * @LastEditTime : 2020-01-15 17:44:41
 * @Description: 剪贴板
 */
import { PASS } from '../constants'

const { invokeCallbackHandler: invoke } = UniServiceJSBridge

export function getClipboardData (options, callbackId) {
  foxsdk.clipboard.getData(ret => {
    if (ret.status === PASS) {
      invoke(callbackId, {
        data: ret.payload.data,
        errMsg: 'getClipboardData:ok'
      })
    } else {
      invoke(callbackId, {
        data: ret.result,
        errMsg: 'getClipboardData:fail'
      })
    }
  })
}

export function setClipboardData ({ data }, callbackId) {
  foxsdk.clipboard.setData(data, ret => {
    if (ret.status === PASS) {
      invoke(callbackId, {
        errMsg: 'setClipboardData:ok'
      })
    } else {
      invoke(callbackId, {
        errMsg: 'setClipboardData:fail'
      })
    }
  })
}
