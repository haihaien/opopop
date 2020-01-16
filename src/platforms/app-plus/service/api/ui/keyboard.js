export function showKeyboard () {
  plus.key.showSoftKeybord()
  return {
    errMsg: 'showKeyboard:ok'
  }
}

// TODO: 该接口已被更改为异步，因此返回要特殊处理
export function hideKeyboard () {
  plus.key.hideSoftKeybord()
  return {
    errMsg: 'hideKeyboard:ok'
  }
}
