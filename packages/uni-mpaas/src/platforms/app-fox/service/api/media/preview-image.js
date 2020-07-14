import { PASS } from '../constants'

export function previewImage ({
  current = 0,
  background = '#000000', // TODO 一期不支持
  indicator = 'number',
  loop = false, // TODO 一期不支持
  urls = [],
  longPressActions
} = {}, callbackId) {
  const {
    invokeCallbackHandler: invoke
  } = UniServiceJSBridge
  let urlLen = urls.length
  current = current > urlLen - 1 && urlLen > 1 ? urls.length - 1
    : current < 1 ? 1
      : current
  if (urlLen === 0) {
    invoke(callbackId, {
      errMsg: 'previewImage:fail: urls is must be an Array and not empty'
    })
  } else {
    foxsdk.gallery.previewImage({ 'current': String(current), 'urls': urls, 'indicator': indicator }, ret => {
      if (ret.status === PASS) {
        if (typeof (ret.payload.index) !== 'undefined') {
          let previewImageText = {
            title: '',
            cancel: '取消',
            buttons: [ '保存相册' ]
          }
          if (typeof getApp().$t === 'function') {
            try {
              let localeText = getApp().$t('frameworkPreviewImage')
              previewImageText.title = localeText.title || previewImageText.title
              previewImageText.cancel = localeText.cancel || previewImageText.cancel
              previewImageText.buttons[0] = localeText.button0 || previewImageText.buttons[0]
            } catch (e) {
            }
          }
          // 长按
          var itemList = longPressActions && longPressActions.itemList.length > 0 ? longPressActions.itemList : previewImageText.buttons
          // var itemColor = longPressActions && longPressActions.itemColor;
          foxsdk.nativeUI.actionsheet({
            title: previewImageText.title,
            cancel: previewImageText.cancel,
            buttons: itemList
          }, respone => {
            if (respone.status === PASS) {
              longPressActions.success({
                errMsg: 'previewImage:actionsheet:ok',
                index: ret.payload.index, // 长按图片索引值
                tapIndex: respone.payload.index // actionsheet索引值
              })
            } else {
              longPressActions.fail({
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
  }

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
