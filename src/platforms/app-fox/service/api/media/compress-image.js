import { PASS, TEMP_PATH } from '../constants'

const {
  invokeCallbackHandler: invoke
} = UniServiceJSBridge

// 图片存储回调处理
function invokeCompressImage (ret, callbackId) {
  if (ret.status === PASS) {
    invoke(callbackId, {
      tempFilePath: ret.payload.target
    })
  } else {
    invoke(callbackId, {
      errMsg: 'compressImage:fail:' + ret.message,
      code: ret.status,
      message: ret.message
    })
  }
}

// 相对路径转换为绝对路径
function convertLocalFileSystemURL (dst, path, quality, callbackId) {
  let regex = /^_[www | documents | downloads | doc].*$/
  let params = {
    src: path,
    dst: dst,
    overwrite: true,
    quality: String(quality)
  }
  if (regex.test(path)) {
    foxsdk.io.convertLocalFileSystemURL(path, res => {
      params.src = res
      foxCompressImage(params, callbackId)
    }, ret => {
      invoke(callbackId, {
        errMsg: 'compressImage:fail:' + ret.message
      })
    })
  } else {
    foxCompressImage(params, callbackId)
  }
}

// 转换为绝对路径
function getDSTURL (path, quality, callbackId) {
  // let dst = TEMP_PATH + '/compress/' + (path.substring(path.lastIndexOf('/') + 1) || 'test.jpg')  // ios端目前不能自动创建目录，如需新建目录需先调api创建
  let dst = TEMP_PATH + (path.substring(path.lastIndexOf('/') + 1) || 'test.jpg')
  foxsdk.io.convertLocalFileSystemURL(dst, res => {
    dst = res
    convertLocalFileSystemURL(dst, path, quality, callbackId)
  }, ret => {
    invoke(callbackId, {
      errMsg: 'compressImage:fail:' + ret.message
    })
  })
}
// 压缩图片
function foxCompressImage (params, callbackId) {
  foxsdk.zip.compressImage(params, res => {
    invokeCompressImage(res, callbackId)
  })
}
/**
 * @desc 压缩图片
 * @param {String} src 图片路径，图片的路径，可以是相对路径、临时文件路径、存储文件路径
 *                      目前仅支持_www,_documents，_downloads,_doc开头的相对路径
 * @param {Number} quality 图片质量 0-100数值越小，质量越低，压缩率越高（仅对jpg有效）
 * @param {*} callbackId
 */
export function compressImage ({
  src,
  quality = 80
} = {}, callbackId) {
  if (src) {
    getDSTURL(src, quality, callbackId)
  } else {
    // 参数错误
    invoke(callbackId, {
      errMsg: 'compressImage:fail:src arguments must be passed'
    })
  }
}
