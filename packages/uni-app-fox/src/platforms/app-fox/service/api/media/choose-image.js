
import { PASS, TEMP_PATH } from '../constants'

const {
  invokeCallbackHandler: invoke
} = UniServiceJSBridge

function invokeChooseImage (callbackId, ret, tempFiles = []) {
  if (ret.status === PASS) {
    // 获取路径数组
    let filePaths = []
    tempFiles.forEach((v, i) => {
      filePaths.push(v.path)
    })

    invoke(callbackId, {
      errMsg: 'chooseImage:ok',
      code: ret.status,
      tempFilePaths: filePaths,
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
        sizeType: options.sizeType + '',
        filename: TEMP_PATH + '/gallery/'
      }
    }
    foxsdk.gallery.pick(data, ret => {
      invokeChooseImage(callbackId, ret, ret.payload.tempFiles)
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
    foxsdk.camera.captureImage({ options: params }, ret => {
      invokeChooseImage(callbackId, ret, [ret.payload.capturedFile])
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
  // sizeType参数转换
  var foxSizeType = (sizeType.indexOf('original') !== -1 && sizeType.indexOf('compressed') !== -1)
    ? 2 : sizeType.indexOf('compressed') !== -1 ? 1 : 0
  if (sourceType.length > 1) { // 多选框
    foxsdk.nativeUI.actionsheet({ 'title': '选择照片', 'cancel': '取消', 'buttons': ['拍摄', '从手机相册选择'] }, ret => {
      if (ret.status === PASS) {
        if (ret.payload.index === 0) {
          // 拍摄选择
          chooseBysourceType({
            sourceType: 'camera',
            sizeType: foxSizeType
          }, callbackId)
        } else {
          chooseBysourceType({
            sourceType: 'album',
            count,
            sizeType: foxSizeType
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
        sizeType: foxSizeType
      }, callbackId)
    } else if (sourceType[0] === 'camera') { // 相机
      chooseBysourceType({
        sourceType: 'camera',
        sizeType: foxSizeType
      }, callbackId)
    } else {
      // 参数错误
      invoke(callbackId, {
        errMsg: 'chooseImage:fail:sourceType arguments must be album or camera'
      })
    }
  }
}
