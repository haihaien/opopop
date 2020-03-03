import { publish } from '../../bridge'

import { decode } from 'base64-arraybuffer'

import { PASS, REQUEST_OK } from '../constants'

function base64ToArrayBuffer (data) {
  return decode(data)
}

/* function arrayBufferToBase64 (data) {
  return encode(data)
} */

// 基于app-plus进行改造

let requestTaskId = 0
const requestTasks = {}

const publishStateChange = res => {
  publish('onRequestTaskStateChange', res)
  delete requestTasks[requestTaskId]
}

/**
 * 创建网络请求任务
 * @param {String} requestTaskId
 * @param {string} options
 */
export function createRequestTaskById (requestTaskId, {
  url,
  data,
  header: reqHeader,
  method = 'GET',
  responseType,
  sslVerify = true
} = {}) {
  if (!window.foxsdk || !foxsdk.http) {
    return {
      requestTaskId,
      errMsg: 'createRequestTask:fail'
    }
  }
  // const stream = requireNativePlugin('stream')
  const header = {}

  let abortTimeout
  let aborted
  let hasContentType = false
  for (const name in reqHeader) {
    if (name === 'isEncrypt') {
      continue
    }
    if (!hasContentType && name.toLowerCase() === 'content-type') {
      hasContentType = true
      header['Content-Type'] = reqHeader[name]
    } else {
      header[name] = reqHeader[name]
    }
  }

  if (!hasContentType && method === 'POST') {
    header['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
  }

  const timeout = __uniConfig.networkTimeout.request
  if (timeout) {
    abortTimeout = setTimeout(() => {
      aborted = true
      publishStateChange({
        requestTaskId,
        state: 'fail',
        statusCode: 0,   
        errMsg: 'timeout'
      })
    }, timeout)
  }
  const options = {
    method,
    url: url.trim(),
    // weex 官方文档有误，header 类型实际 object，用 string 类型会无响应
    header,
    type: responseType === 'arraybuffer' ? 'base64' : 'text',
    // weex 官方文档未说明实际支持 timeout，单位：ms
    timeout: timeout || 6e5,
    // 配置和weex模块内相反
    sslVerify: !sslVerify
  }
  if (method !== 'GET') {
    // options.body = data
    options.parameter = data
    options.isEncrypt = reqHeader.isEncrypt || ''
  }
  try {
    foxsdk.http.request(options, ret => {
      if (aborted) {
        return
      }
      if (abortTimeout) {
        clearTimeout(abortTimeout)
      }
      const statusCode = ret.payload.statusCode
      const ok = ret.status === PASS
      if (statusCode === REQUEST_OK) {
        const header = ret.payload.header
        const datas = ret.payload.data
        publishStateChange({
          requestTaskId,
          state: 'success',
          data: ok && responseType === 'arraybuffer' ? base64ToArrayBuffer(datas) : datas,
          statusCode,
          header
        })
      } else {
        publishStateChange({
          requestTaskId,
          state: 'fail',
          statusCode,
          errMsg: 'abort'
        })
      }
    })
    /* stream.fetch(options, ({
      ok,
      status,
      data,
      header
    }) => {

    }) */
    requestTasks[requestTaskId] = {
      abort () {
        aborted = true
        if (abortTimeout) {
          clearTimeout(abortTimeout)
        }
        publishStateChange({
          requestTaskId,
          state: 'fail',
          statusCode: 0,
          errMsg: 'abort'
        })
      }
    }
  } catch (e) {
    return {
      requestTaskId,
      errMsg: 'createRequestTask:fail'
    }
  }
  return {
    requestTaskId,
    errMsg: 'createRequestTask:ok'
  }
}

export function createRequestTask (args) {
  return createRequestTaskById(++requestTaskId, args)
}

export function operateRequestTask ({
  requestTaskId,
  operationType
} = {}) {
  const requestTask = requestTasks[requestTaskId]
  if (requestTask && operationType === 'abort') {
    requestTask.abort()
    return {
      errMsg: 'operateRequestTask:ok'
    }
  }
  return {
    errMsg: 'operateRequestTask:fail'
  }
}
