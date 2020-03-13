import { TEMP_PATH_DOWNLOAD } from '../constants'
import { publish } from '../../bridge'

let downloadTaskId = 0
const downloadTasks = {}

const publishStateChange = (res) => {
  publish('onDownloadTaskStateChange', res)
}

const createDownloadTaskById = function (downloadTaskId, { url, header } = {}) {
  let fileName = url.substr(url.lastIndexOf('/') + 1)// '/获取路径后文件名
  const downloader = foxsdk.downloader.createDownload(url, {
    timeout: __uniConfig.networkTimeout.downloadFile ? __uniConfig.networkTimeout.downloadFile / 1000 : 120,
    filename: TEMP_PATH_DOWNLOAD + fileName,
    header,
    // 需要与其它平台上的表现保持一致，不走重试的逻辑。
    retry: 0,
    retryInterval: 0
  }, task => {
    if (task.state === foxsdk.downloader.DownloadState.Finished) {
      publishStateChange({
        downloadTaskId,
        state: 'success',
        tempFilePath: task.filename,
        statusCode: '200'
      })
    } else {
      publishStateChange({
        downloadTaskId,
        state: 'fail',
        statusCode: '200'
      })
    }
  })
  downloader.stateChanged(download => {
    if (download.downloadedSize && download.totalSize) {
      publishStateChange({
        downloadTaskId,
        state: 'progressUpdate',
        progress: parseInt(download.downloadedSize / download.totalSize * 100),
        totalBytesWritten: download.downloadedSize,
        totalBytesExpectedToWrite: download.totalSize
      })
    }
  })
  downloadTasks[downloadTaskId] = downloader
  setTimeout(() => {
    downloader.start()
  }, 10)
  return {
    downloadTaskId,
    errMsg: 'createDownloadTask:ok'
  }
}

export function operateDownloadTask ({ downloadTaskId, operationType } = {}) {
  const downloadTask = downloadTasks[downloadTaskId]
  if (downloadTask && operationType === 'abort') {
    delete downloadTasks[downloadTaskId]
    downloadTask.abort()
    publishStateChange({
      downloadTaskId,
      state: 'fail',
      errMsg: 'abort'
    })
    return {
      errMsg: 'operateDownloadTask:ok'
    }
  }
  return {
    errMsg: 'operateDownloadTask:fail'
  }
}

export function createDownloadTask (args) {
  return createDownloadTaskById(++downloadTaskId, args)
}
