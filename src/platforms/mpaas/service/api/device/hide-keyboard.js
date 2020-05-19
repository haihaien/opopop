/*
 * @Author: helin3
 * @Date: 2019-10-21 16:59:26
 * @LastEditors: helin3
 * @LastEditTime: 2020-01-16 15:48:45
 * @Description:
 */
const { invokeCallbackHandler: invoke } = UniServiceJSBridge

export function hideKeyboard (options, callbackId) {
  const activeElement = document.activeElement
  if (activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT')) {
    activeElement.blur()
  }
  invoke(callbackId, {
    errMsg: 'hideKeyboard:ok'
  })
}
