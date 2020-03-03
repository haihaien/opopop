import { PASS } from '../constants'

const {
  invokeCallbackHandler: invoke
} = UniServiceJSBridge

export function setStorage ({
  key,
  data
} = {}, callbackId) {
  const value = {
    type: typeof data === 'object' ? 'object' : 'string',
    data: data
  }
  // return new Promise((resolve, reject) => {
  if (window.foxsdk) {
    foxsdk.storage.setItem(key, value, ret => {
      if (ret.status === PASS) {
        // key值暂时用localstorage保存把
        const keyList = localStorage.getItem('uni-storage-keys')
        if (!keyList) {
          localStorage.setItem('uni-storage-keys', JSON.stringify([key]))
        } else {
          const keys = JSON.parse(keyList)
          if (keys.indexOf(key) < 0) {
            keys.push(key)
            localStorage.setItem('uni-storage-keys', JSON.stringify(keys))
          }
        }
        // resolve(ret.payload)
        invoke(callbackId, {
          errMsg: 'setStorage:ok'
        })
      } else {
        // reject(ret.message)
        invoke(callbackId, {
          code: ret.status,
          message: ret.message,
          errMsg: 'setStorage:fail'
        })
      }
    })
  } else {
    // reject('foxsdk未初始化')
  }
  // })
}

export function setStorageSync (key, data) {
  // app-fox不支持同步
  return {
    errMsg: 'app-fox暂不支持同步API'
  }
}

export function getStorage ({
  key
} = {}, callbackId) {
  // return new Promise((resolve, reject) => {
  foxsdk.storage.getItem(key, ret => {
    if (ret.status === PASS) {
      // resolve(ret.payload)
      invoke(callbackId, {
        errMsg: 'getStorage:ok',
        data: ret.payload.data,
        type: ret.payload.type
      })
    } else {
      // reject(ret.message)
      invoke(callbackId, {
        errMsg: 'getStorage:fail',
        code: ret.code,
        message: ret.message
      })
    }
  })
  // })
}

export function getStorageSync (key) {
  return {
    errMsg: 'app-fox暂不支持同步API'
  }
}

export function removeStorage ({
  key
} = {}, callbackId) {
  const keyList = localStorage.getItem('uni-storage-keys')
  if (keyList) {
    const keys = JSON.parse(keyList)
    const index = keys.indexOf(key)
    keys.splice(index, 1)
    localStorage.setItem('uni-storage-keys', JSON.stringify(keys))
  }
  // return new Promise((resolve, reject) => {
  foxsdk.storage.removeItem(key, ret => {
    if (ret.status === PASS) {
      // resolve(ret.payload)
      invoke(callbackId, {
        errMsg: 'removeStorage:ok',
        result: ret.payload
      })
    } else {
      // reject(ret.message)
      invoke(callbackId, {
        errMsg: 'removeStorage:fail',
        code: ret.status,
        message: ret.message
      })
    }
  })
  // })
}

export function removeStorageSync (key) {
  return {
    errMsg: 'app-fox暂不支持同步API'
  }
}

export function clearStorage (options, callbackId) {
  localStorage.clear()
  // return new Promise((resolve, reject) => {
  foxsdk.storage.clear(ret => {
    if (ret.status === PASS) {
      // resolve(ret.payload)
      invoke(callbackId, {
        errMsg: 'clearStorage:ok',
        result: ret.payload
      })
    } else {
      // reject(ret.message)
      invoke(callbackId, {
        errMsg: 'clearStorage:fail',
        code: ret.status,
        message: ret.message
      })
    }
  })
  // })
}

export function clearStorageSync () {
  return {
    errMsg: 'app-fox暂不支持同步API'
  }
}

export function getStorageInfo () {
  const keyList = localStorage.getItem('uni-storage-keys')
  return keyList ? {
    keys: JSON.parse(keyList),
    currentSize: 0,
    limitSize: 0,
    errMsg: 'getStorageInfo:ok'
  } : {
    keys: '',
    currentSize: 0,
    limitSize: 0,
    errMsg: 'getStorageInfo:fail'
  }
}

export function getStorageInfoSync () {
  const res = getStorageInfo()
  delete res.errMsg
  return res
}
