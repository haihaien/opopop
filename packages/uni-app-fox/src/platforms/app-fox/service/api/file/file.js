<<<<<<< HEAD
import { invoke } from 'uni-core/service/bridge'

const SAVED_DIR = 'yuapp_save'
const SAVE_PATH = `_doc/${SAVED_DIR}`
const REGEX_FILENAME = /^.*[/]/

function getSavedFileDir (success, fail) {
  fail = fail || function () {}
  foxsdk.io.requestFileSystem(foxsdk.io.PRIVATE_DOC, fs => { // 请求_doc fs
    fs.root.getDirectory(SAVED_DIR, { // 获取文件保存目录对象
      create: true
    }, dir => {
      success(dir)
    }, err => {
      fail('目录[' + SAVED_DIR + ']创建失败' + err.message)
    })
  }, err => {
    fail('目录[_doc]读取失败' + err.message)
  })
}

/**
 * 保存文件到本地
 * @param {*} param0
 * @param {*} callbackId
 */
export function saveFile ({ tempFilePath } = {}, callbackId) {
  let fileName = tempFilePath.replace(REGEX_FILENAME, '')
  if (fileName) {
    let extName = ''
    if (~fileName.indexOf('.')) {
      extName = '.' + fileName.split('.').pop()
    }

    fileName = (+new Date()) + '' + extName

    foxsdk.io.resolveLocalFileSystemURL(tempFilePath, entry => { // 读取临时文件 FileEntry
      getSavedFileDir(dir => {
        entry.copyTo(dir.fullPath, fileName, () => { // 复制临时文件 FileEntry，为了避免把相册里的文件删除，使用 copy，微信中是要删除临时文件的
          const savedFilePath = SAVE_PATH + '/' + fileName
          invoke(callbackId, {
            errMsg: 'saveFile:ok',
            savedFilePath
          })
        }, err => {
          invoke(callbackId, {
            errMsg: 'saveFile:fail 保存文件[' + tempFilePath +
              '] copyTo 失败:' + err.message
          })
        })
      }, message => {
        invoke(callbackId, {
          errMsg: 'saveFile:fail ' + message
        })
      })
    }, err => {
      invoke(callbackId, {
        errMsg: 'saveFile:fail 文件[' + tempFilePath + ']读取失败' + err.message
      })
    })
  } else {
    return {
      errMsg: 'saveFile:fail 文件名[' + tempFilePath + ']不存在'
    }
  }
}

export function getSavedFileList (options, callbackId) {
  getSavedFileDir(entry => {
    entry.getFileListMetadata(ret => {
      invoke(callbackId, {
        errMsg: 'getSavedFileList:ok',
        fileList: ret.fileList
      })
    }, err => {
      invoke(callbackId, {
        code: err.status,
        errMsg: 'getSavedFileList:fail ' + err.message
      })
    })
  }, message => {
    invoke(callbackId, {
      errMsg: 'getSavedFileList:fail ' + message
    })
  })
}

export function getFileInfo ({ filePath, digestAlgorithm = 'md5' } = {}, callbackId) {
  foxsdk.io.resolveLocalFileSystemURL(filePath, entry => {
    entry.getFileDigestInfo(digestAlgorithm, meta => {
      invoke(callbackId, {
        errMsg: 'getFileInfo:ok',
        size: meta.size,
        digestAlgorithm: meta.digest
      })
    }, err => {
      invoke(callbackId, {
        errMsg: 'getFileInfo:fail 文件[' + filePath + '] getMetadata 失败:' + err.message
      })
    })
  }, err => {
    invoke(callbackId, {
      errMsg: 'getFileInfo:fail 文件[' + filePath + ']读取失败:' + err.message
    })
  })
}

export function getSavedFileInfo ({ filePath } = {}, callbackId) {
  foxsdk.io.resolveLocalFileSystemURL(filePath, entry => {
    entry.getMetadata(meta => {
      invoke(callbackId, {
        createTime: meta.modificationTime,
        size: meta.size,
        errMsg: 'getSavedFileInfo:ok'
      })
    }, err => {
      invoke(callbackId, {
        errMsg: 'getSavedFileInfo:fail ' + err.message
      })
    }, false)
  }, err => {
    invoke(callbackId, {
      errMsg: 'getSavedFileInfo:fail ' + err.message
    })
  })
}

export function removeSavedFile ({ filePath } = {}, callbackId) {
  foxsdk.io.resolveLocalFileSystemURL(filePath, entry => {
    entry.remove(() => {
      invoke(callbackId, {
        errMsg: 'removeSavedFile:ok'
      })
    }, err => {
      invoke(callbackId, {
        errMsg: 'removeSavedFile:fail 文件[' + filePath + ']删除失败:' + err.message
      })
    })
  }, err => {
    invoke(callbackId, {
      errMsg: 'removeSavedFile:fail ' + err.message
    })
  })
}
=======
import { invoke } from 'uni-core/service/bridge'

const SAVED_DIR = 'yuapp_save'
const SAVE_PATH = `_doc/${SAVED_DIR}`
const REGEX_FILENAME = /^.*[/]/

function getSavedFileDir (success, fail) {
  fail = fail || function () {}
  foxsdk.io.requestFileSystem(foxsdk.io.PRIVATE_DOC, fs => { // 请求_doc fs
    fs.root.getDirectory(SAVED_DIR, { // 获取文件保存目录对象
      create: true
    }, dir => {
      success(dir)
    }, err => {
      fail('目录[' + SAVED_DIR + ']创建失败' + err.message)
    })
  }, err => {
    fail('目录[_doc]读取失败' + err.message)
  })
}

/**
 * 保存文件到本地
 * @param {*} param0
 * @param {*} callbackId
 */
export function saveFile ({ tempFilePath } = {}, callbackId) {
  let fileName = tempFilePath.replace(REGEX_FILENAME, '')
  if (fileName) {
    let extName = ''
    if (~fileName.indexOf('.')) {
      extName = '.' + fileName.split('.').pop()
    }

    fileName = (+new Date()) + '' + extName

    foxsdk.io.resolveLocalFileSystemURL(tempFilePath, entry => { // 读取临时文件 FileEntry
      getSavedFileDir(dir => {
        entry.copyTo(dir.fullPath, fileName, () => { // 复制临时文件 FileEntry，为了避免把相册里的文件删除，使用 copy，微信中是要删除临时文件的
          const savedFilePath = SAVE_PATH + '/' + fileName
          invoke(callbackId, {
            errMsg: 'saveFile:ok',
            savedFilePath
          })
        }, err => {
          invoke(callbackId, {
            errMsg: 'saveFile:fail 保存文件[' + tempFilePath +
              '] copyTo 失败:' + err.message
          })
        })
      }, message => {
        invoke(callbackId, {
          errMsg: 'saveFile:fail ' + message
        })
      })
    }, err => {
      invoke(callbackId, {
        errMsg: 'saveFile:fail 文件[' + tempFilePath + ']读取失败' + err.message
      })
    })
  } else {
    return {
      errMsg: 'saveFile:fail 文件名[' + tempFilePath + ']不存在'
    }
  }
}

export function getSavedFileList (options, callbackId) {
  getSavedFileDir(entry => {
    entry.getFileListMetadata(ret => {
      invoke(callbackId, {
        errMsg: 'getSavedFileList:ok',
        fileList: ret.fileList
      })
    }, err => {
      invoke(callbackId, {
        code: err.status,
        errMsg: 'getSavedFileList:fail ' + err.message
      })
    })
  }, message => {
    invoke(callbackId, {
      errMsg: 'getSavedFileList:fail ' + message
    })
  })
}

export function getFileInfo ({ filePath, digestAlgorithm = 'md5' } = {}, callbackId) {
  foxsdk.io.resolveLocalFileSystemURL(filePath, entry => {
    entry.getFileDigestInfo(digestAlgorithm, meta => {
      invoke(callbackId, {
        errMsg: 'getFileInfo:ok',
        size: meta.size,
        digestAlgorithm: meta.digest
      })
    }, err => {
      invoke(callbackId, {
        errMsg: 'getFileInfo:fail 文件[' + filePath + '] getMetadata 失败:' + err.message
      })
    })
  }, err => {
    invoke(callbackId, {
      errMsg: 'getFileInfo:fail 文件[' + filePath + ']读取失败:' + err.message
    })
  })
}

export function getSavedFileInfo ({ filePath } = {}, callbackId) {
  foxsdk.io.resolveLocalFileSystemURL(filePath, entry => {
    entry.getMetadata(meta => {
      invoke(callbackId, {
        createTime: meta.modificationTime,
        size: meta.size,
        errMsg: 'getSavedFileInfo:ok'
      })
    }, err => {
      invoke(callbackId, {
        errMsg: 'getSavedFileInfo:fail ' + err.message
      })
    }, false)
  }, err => {
    invoke(callbackId, {
      errMsg: 'getSavedFileInfo:fail ' + err.message
    })
  })
}

export function removeSavedFile ({ filePath } = {}, callbackId) {
  foxsdk.io.resolveLocalFileSystemURL(filePath, entry => {
    entry.remove(() => {
      invoke(callbackId, {
        errMsg: 'removeSavedFile:ok'
      })
    }, err => {
      invoke(callbackId, {
        errMsg: 'removeSavedFile:fail 文件[' + filePath + ']删除失败:' + err.message
      })
    })
  }, err => {
    invoke(callbackId, {
      errMsg: 'removeSavedFile:fail ' + err.message
    })
  })
}
>>>>>>> ad6e88a9d85a46c17ad495b0332e8189b3ad3ac3
