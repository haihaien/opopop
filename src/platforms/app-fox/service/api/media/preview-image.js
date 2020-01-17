import { PASS } from '../constants'

export function previewImage ({
  current = 0,
  background = '#000000', // TODO 一期不支持
  indicator = 'number',
  loop = false, // TODO 一期不支持
  urls,
  longPressActions
} = {}, callbackId) {
  const {
    invokeCallbackHandler: invoke
  } = UniServiceJSBridge

  if (current > urls.length - 1) {
    current = String(urls.length - 1)
  } else if (current < 0) {
    current = String(0)
  } else {
    current = String(current)
  }

  foxsdk.gallery.previewImage({ 'current': current, 'urls': urls, 'indicator ': indicator }, ret => {
    if (ret.status === PASS) {
      if (~ret.payload.index) {
        // 长按
        var itemList = longPressActions && longPressActions.itemList
        // var itemColor = longPressActions && longPressActions.itemColor;
        foxsdk.nativeUI.actionsheet({ 'title': '', 'cancel': '取消', 'buttons': itemList }, respone => {
          if (respone.status === PASS) {
            invoke(callbackId, {
              errMsg: 'previewImage:actionsheet:ok',
              index: ret.payload.index, // 长按图片索引值
              tapIndex: respone.payload.index // actionsheet索引值
            })
          } else {
            invoke(callbackId, {
              errMsg: 'previewImage:actionsheet:fail:' + respone.message,
              code: respone.status,
              message: respone.message
            })
          }
        })
        return
      }

      invoke(callbackId, {
        errMsg: 'previewImage:ok',
        tapIndex: ret.payload.tapIndex
      })
    } else {
      invoke(callbackId, {
        errMsg: 'previewImage:fail:' + ret.message,
        code: ret.status,
        message: ret.message
      })
    }
  })

  /* getApp().$router.push({
    type: 'navigateTo',
    path: '/preview-image',
    params: {
      urls,
      current
    }
  }, function () {
    invoke(callbackId, {
      errMsg: 'previewImage:ok'
    })
  }, function () {
    invoke(callbackId, {
      errMsg: 'previewImage:fail'
    })
  }) */
}
