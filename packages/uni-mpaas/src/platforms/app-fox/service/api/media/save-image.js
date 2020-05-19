import { PASS } from '../constants'

const {
  invokeCallbackHandler: invoke
} = UniServiceJSBridge

// 图片存储回调处理
function invokeSaveImage (callbackId, ret) {
  if (ret.status === PASS) {
    invoke(callbackId, {
      errMsg: 'saveImageToPhotosAlbum:ok'
    })
  } else {
    invoke(callbackId, {
      errMsg: 'saveImageToPhotosAlbum:fail:' + ret.message,
      code: ret.status,
      message: ret.message
    })
  }
}

// 如果是绝对路径  进行相对路径转换后再进行存储
function convertAbsoluteFileSystem (callbackId, path) {
  var regex = /^_[www | documents | downloads | doc].*$/
  if (!regex.test(path)) {
    foxsdk.io.convertAbsoluteFileSystem(path, res => {
      foxSaveImage(callbackId, res.payload.path)
    }, ret => {
      invoke(callbackId, {
        errMsg: 'saveImageToPhotosAlbum:fail:FilePath illegal'
      })
    })
  } else {
    foxSaveImage(callbackId, path)
  }
}

// 存储图片
function foxSaveImage (callbackId, path) {
  foxsdk.gallery.save(path, res => {
    invokeSaveImage(callbackId, res)
  })
}
/**
 *
 * @param {*} filePath 需要存储图片的路径 ，可以是相对路径/绝对路径
 *                      目前仅支持_www,_documents，_downloads,_doc开头的相对路径
 * @param {*} callbackId
 */
export function saveImageToPhotosAlbum (
  { filePath = '' } = {},
  callbackId
) {
  let httpReg = /^_[http | https].*$/
  if (httpReg.test(filePath)) {
    // 参数错误
    invoke(callbackId, {
      errMsg: 'saveImageToPhotosAlbum:fail:filePath arguments must be the local file'
    })
  }

  if (filePath) {
    convertAbsoluteFileSystem(callbackId, filePath)
  } else {
    // 参数错误
    invoke(callbackId, {
      errMsg: 'saveImageToPhotosAlbum:fail:filePath arguments must be passed'
    })
  }
}
