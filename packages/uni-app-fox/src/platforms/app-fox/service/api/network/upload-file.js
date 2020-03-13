// import { urlToFile } from 'uni-platform/helpers/file'
import { TEMP_PATH } from '../constants'
import { publish } from '../../bridge'
let uploadTaskId = 0
const uploadTasks = {}
let uploader = []

const publishStateChange = (res) => {
  publish('onUploadTaskStateChange', res)
}

// 创建人物ID
const createUploadTaskById = function (upoadTaskId, {
  url = '',
  header = {},
  files = [],
  filePath = '',
  name = '',
  formData = {}
} = {}) {
  foxsdk.logger.info('start upload=====')

  if (files.length > 0) {
    files.forEach((v, i) => {
      // 创建任务
      // const createUpload = function () {
      uploader[i] = foxsdk.uploader.createUpload(url, {
        timeout: __uniConfig.networkTimeout.uploadFile ? __uniConfig.networkTimeout.uploadFile / 1000 : 120,
        filename: TEMP_PATH + '/upload/',
        header,
        // 需要与其它平台上的表现保持一致，不走重试的逻辑。
        retry: 0,
        retryInterval: 0
      }, task => {
        if (task.state === foxsdk.uploader.UploadState.Finished) {
          publishStateChange({
            upoadTaskId,
            state: 'success',
            tempFilePath: task.filename,
            statusCode: '200'
          })
        } else {
          uploader[i].abort()
          publishStateChange({
            upoadTaskId,
            state: 'fail',
            statusCode: '200'
          })
        }
      })
      // 状态监听
      uploader[i].stateChanged(upload => {
        if (upload.downloadedSize && upload.totalSize) {
          publishStateChange({
            uploadTaskId,
            state: 'progressUpdate',
            progress: parseInt(upload.downloadedSize / upload.totalSize * 100),
            totalBytesWritten: upload.downloadedSize,
            totalBytesExpectedToWrite: upload.totalSize
          })
        }
      })
    })
    uploadTasks[uploadTaskId] = uploader
    setTimeout(() => {
      uploader.start()
    }, 10)
    return {
      uploadTaskId,
      errMsg: 'createUploadTask:ok'
    }
  } else {
    uploader[0].addFile(filePath, {
      key: 'key' + uploadTaskId + 'index' + 0,
      name: name
    }, retObj => {
      if (retObj.status === 0) {
        publishStateChange({
          uploadTaskId,
          state: 'success',
          statusCode: '200'
        })
      } else {
        uploader[0].abort()
        publishStateChange({
          uploadTaskId,
          state: 'fail',
          statusCode: '200'
        })
      }
    })
    return {
      uploadTaskId,
      errMsg: 'createUploadTask:ok'
    }
  }
}

// 操作请求任务
export function operateRequestTask ({ uploadTaskId, operationType } = {}) {
  const uploadTask = uploadTasks[uploadTaskId]
  if (uploadTask && operationType === 'abort') {
    delete uploadTasks[uploadTaskId]
    uploadTask.abort()
    publishStateChange({
      uploadTaskId,
      state: 'fail',
      errMsg: 'abort'
    })
    return {
      errMsg: 'operateUploadTask:ok'
    }
  }
  return {
    errMsg: 'operateUploadTask:fail'
  }
}

// 中断上传任务
export function abort () {
  if (uploader.length > 0) {
    for (let i = 0, len = uploader.length; i < len; ++i) {
      uploader[i].abort()
    }
  }
}
// 监听上传进度变化
export function onProgressUpdate () {
  if (uploader.length > 0) {
    for (let i = 0, len = uploader.length; i < len; ++i) {
      uploader[i].stateChanged(ret => {

      })
    }
  }
}
// 原生暂未开发
// 监听 HTTP Response Header 事件。会比请求完成事件更早,仅微信小程序平台支持
// export function onHeadersReceived(){

// }
// 取消监听上传进度变化事件，仅微信小程序平台支持
// export function offProgressUpdate(){

// }
// 取消监听 HTTP Response Header 事件，仅微信小程序平台支持
// export function offHeadersReceived(){

// }
export function createUploadTask (args) {
  return createUploadTaskById(++uploadTaskId, args)
}
