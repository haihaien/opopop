import { PASS, TEMP_PATH } from '../constants'

// import { fileToUrl } from 'uni-platform/helpers/file'
// import { updateElementStyle } from 'uni-shared'

const {
  invokeCallbackHandler: invoke
} = UniServiceJSBridge

/* let imageInput = null

const _createInput = function (options) {
  let inputEl = document.createElement('input')
  inputEl.type = 'file'
  updateElementStyle(inputEl, {
    'position': 'absolute',
    'visibility': 'hidden',
    'z-index': -999,
    'width': 0,
    'height': 0,
    'top': 0,
    'left': 0
  })
  inputEl.accept = 'image/*'
  if (options.count > 1) {
    inputEl.multiple = 'multiple'
  }
  // 经过测试，仅能限制只通过相机拍摄，不能限制只允许从相册选择。
  if (options.sourceType.length === 1 && options.sourceType[0] === 'camera') {
    inputEl.capture = 'camera'
  }

  return inputEl
} */

function invokeChooseImage (callbackId, ret, tempFilePaths = [], tempFiles = []) {
  if (ret.status === PASS) {
    invoke(callbackId, {
      errMsg: 'chooseImage:ok',
      tempFilePaths,
      tempFiles
    })
  } else {
    invoke(callbackId, {
      errMsg: 'chooseImage:fail:' + ret.message,
      code: ret.status,
      message: ret.message
    })
  }
}

function chooseBysourceType (options, callbackId) {
  if (!options) {
    return
  }
  if (options.sourceType === 'album') {
    var data = {
      pickType: '2',
      options: {
        filter: 'image',
        maximum: options.count + '',
        sizeType: options.sizeType,
        filename: TEMP_PATH + '/gallery/'
      }
    }
    foxsdk.gallery.pick(data, ret => {
      invokeChooseImage(callbackId, ret, ret.payload.event, ret.payload.tempFiles)
    })
  }
  if (options.sourceType === 'camera') {
    var params = {
      filename: TEMP_PATH + '/camera/',
      format: 'JPG',
      index: '1',
      videoMaximumDuration: '',
      optimize: true,
      resolution: true,
      popover: true,
      sizeType: options.sizeType
    }
    foxsdk.camera.captureImage(params, ret => {
      invokeChooseImage(callbackId, ret, [ret.payload.capturedFile], [ret.payload.tempFiles])
    })
  }
}

/**
 *
 * @param {*} count     最多可以选择的图片张数,默认9
 * @param {*} sizeType  original 原图，compressed 压缩图，默认二者都有
 * @param {*} sourceType album 从相册选图，camera 使用相机，默认二者都有
 * @param {*} callbackId
 */
export function chooseImage ({
  count = 9,
  sizeType = ['original', 'compressed'],
  sourceType = ['album', 'camera']
} = {}, callbackId) {
  if (sourceType.length > 1) { // 多选框
    foxsdk.nativeUI.actionsheet({ 'title': '选择照片', 'cancel': '取消', 'buttons': ['拍摄', '从手机相册选择'] }, ret => {
      if (ret.status === PASS) {
        if (ret.payload.index === 0) {
          // 拍摄选择
          chooseBysourceType({
            sourceType: 'camera',
            sizeType
          }, callbackId)
        } else {
          chooseBysourceType({
            sourceType: 'album',
            count,
            sizeType
          }, callbackId)
        }
      } else {
        invoke(callbackId, {
          errMsg: 'nativeUI:actionsheet:fail'
        })
      }
    })
  } else {
    if (sourceType[0] === 'album') { // 相册
      chooseBysourceType({
        sourceType: 'album',
        count,
        sizeType
      }, callbackId)
    } else if (sourceType[0] === 'camera') { // 相机
      chooseBysourceType({
        sourceType: 'camera',
        sizeType
      }, callbackId)
    } else {
      // 参数错误
      invoke(callbackId, {
        errMsg: 'chooseImage:fail:sourceType arguments must be album or camera'
      })
    }
  }

  // invoke(callbackId, {
  //   errMsg: 'chooseImage:ok',
  //   tempFilePaths,//Array<String>图片的本地文件路径列表
  //   tempFiles//Array<object>图片的本地文件列表，每一项是一个 File 对象 {path:xxx,size:xxx}
  // })

  // invoke(callbackId, {
  //   errMsg: 'chooseImage:fail',
  //   code: ret.status,
  //   message: ret.message
  // })
}
