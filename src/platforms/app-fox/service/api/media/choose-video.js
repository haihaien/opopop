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

function invokeChooseVideo (callbackId, ret) {
  if (ret.status === PASS) {
    invoke(callbackId, {
      errMsg: 'chooseVideo:ok',
      tempFilePath: ret.payload.tempFiles[0].path, // 视频临时路径
      duration: ret.payload.tempFiles[0].duration, // 视频时长
      size: ret.payload.tempFiles[0].size, // 视频数据量大小
      height: ret.payload.tempFiles[0].height, // 视频高度
      width: ret.payload.tempFiles[0].width // 视频宽度
    })
  } else {
    invoke(callbackId, {
      errMsg: 'chooseVideo:fail:' + ret.message,
      code: ret.status,
      message: ret.message
    })
  }
}

function chooseBysourceType (options, callbackId) {
  if (!options) {
    return
  }
  var foxSizeType = (options.sizeType.indexOf('original') !== -1 && options.sizeType.indexOf('compressed') !== -1)
    ? 2 : options.sizeType.indexOf('compressed') !== -1 ? 1 : 0
  if (options.sourceType === 'album') {
    var data = {
      pickType: '1', // 视频只支持单选
      options: {
        filter: 'video',
        maximum: '1',
        sizeType: foxSizeType,
        filename: TEMP_PATH + '/gallery/'
      }
    }
    foxsdk.gallery.pick(data, ret => {
      invokeChooseVideo(callbackId, ret || {})
    })
  }
  if (options.sourceType === 'camera') {
    var params = {
      filename: TEMP_PATH + '/camera/' + 'yusys_' + Date.now() + '.mp4',
      format: 'mp4',
      index: options.camera === 'back' ? '1' : '0',
      videoMaximumDuration: options.maxDuration + ''
      // optimize: true,
      // resolution: true,
      // popover: true,
      // sizeType: foxSizeType
    }
    foxsdk.camera.startVideoCapture({ options: params }, ret => {
      let res = ret
      res.payload.tempFiles = [ret.payload.capturedFile]
      invokeChooseVideo(callbackId, res)
    })
  }
}

/**
 *
 * @param {*} count     最多可以选择的图片张数,默认9
 * @param {*} camera     'front' or 'back'前置或后置摄像头 默认后置
 * @param {*} sizeType  original 原图，compressed 压缩图，默认二者都有
 * @param {*} sourceType album 从相册选图，camera 使用相机，默认二者都有
 * @param {*} callbackId
 */
export function chooseVideo ({
  maxDuration = 20,
  camera = 'back', // 'front' or 'back'
  sizeType = ['original', 'compressed'],
  sourceType = ['album', 'camera']
} = {}, callbackId) {
  if (sourceType.length > 1) { // 多选框
    foxsdk.nativeUI.actionsheet({ 'title': '选择视频', 'cancel': '取消', 'buttons': ['拍摄', '从手机相册选择'] }, ret => {
      if (ret.status === PASS) {
        if (ret.payload.index === 0) {
          // 拍摄选择
          chooseBysourceType({
            sourceType: 'camera',
            maxDuration,
            camera,
            sizeType
          }, callbackId)
        } else {
          chooseBysourceType({
            sourceType: 'album',
            maxDuration,
            camera,
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
        maxDuration,
        camera,
        sizeType
      }, callbackId)
    } else if (sourceType[0] === 'camera') { // 相机
      chooseBysourceType({
        sourceType: 'camera',
        maxDuration,
        camera,
        sizeType
      }, callbackId)
    } else {
      // 参数错误
      invoke(callbackId, {
        errMsg: 'chooseVideo:fail:sourceType arguments must be album or camera'
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
