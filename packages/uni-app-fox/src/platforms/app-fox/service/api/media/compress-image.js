import { PASS, TEMP_PATH } from '../constants'

const {
  invokeCallbackHandler: invoke
} = UniServiceJSBridge

// 图片存储回调处理
function invokeCompressImage (callbackId, ret) {
  if (ret.status === PASS) {
    foxsdk.io.convertLocalFileSystemURL(ret.target, res => {
      invoke(callbackId, {
        tempFilePath: res.payload.path
      })
    }, ret => {
      invoke(callbackId, {
        errMsg: 'compressImage:fail:' + ret.message
      })
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
function convertLocalFileSystemURL (path, quality, callbackId) {
  let regex = /^\\_[www | documents | downloads | doc].*;$/
  let params = {
    src: path,
    dst: TEMP_PATH + '/compress/',
    overwrite: true,
    quality: quality
  }
  if (regex.test(path)) {
    foxsdk.io.convertLocalFileSystemURL(path, res => {
      params.src = res.payload.path
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
    convertLocalFileSystemURL(src, quality, callbackId)
  } else {
    // 参数错误
    invoke(callbackId, {
      errMsg: 'compressImage:fail:src arguments must be passed'
    })
  }
}
