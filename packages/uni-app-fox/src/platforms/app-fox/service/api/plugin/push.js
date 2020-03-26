import {
  PASS
} from '../constants'
const {
  invokeCallbackHandler: invoke
} = UniServiceJSBridge
const callbacks = []
/***
 * @desc 开启推送
 * @param {string} content 消息显示的内容，在系统通知中心中显示的文本内容。
 * @param {String} title 推送消息的标题。在系统消息中心显示的通知消息标题，默认值为程序的名称。
 * @param {String} notificationId 通知ID
 * @param {Object} subtitle 推送消息的副标题。
 */
export function subscribePush ({
  content,
  title,
  subtitle,
  notificationId = 'noti0'
} = {}, callbackId) {
  // 默认设置应用名称
  if (!title) {
    foxsdk.device.getSystemInfo(ret => {
      title = ret.payload.appName || ''
    })
  }
  subtitle = subtitle || title
  if (title && content && notificationId) {
    foxsdk.push.createMessage({
      content: content,
      notificationId: notificationId,
      payload: '',
      options: {
        'delay': 0,
        'sound': 'system',
        'title': title,
        'subtitle': subtitle
      }
    }, ret => {
      if (ret.status === PASS && ret.payload.result) {
        invoke(callbackId, {
          errMsg: 'subscribePush:ok',
          code: ret.status,
          notificationId: ret.payload.notificationId || notificationId
        })
      } else {
        invoke(callbackId, {
          errMsg: 'subscribePush:fail:' + ret.message,
          code: ret.status,
          message: ret.message
        })
      }
    })
  } else {
    // 参数错误
    invoke(callbackId, {
      errMsg: 'subscribePush:fail: content/notificationId arguments must be passed'
    })
  }
}

/***
 * @desc 关闭推送
 * @param {String} notificationId 消息ID
 */
export function unsubscribePush ({ notificationId } = {}, callbackId) {
  foxsdk.push.remove(notificationId, ret => {
    if (ret.status === PASS && ret.payload.result) {
      invoke(callbackId, {
        errMsg: 'unsubscribePush:ok',
        code: ret.status
      })
    } else {
      invoke(callbackId, {
        errMsg: 'unsubscribePush:fail:' + ret.message,
        code: ret.status,
        message: ret.message
      })
    }
  })
}

// 处理监听回调
function invokeListener (ret, callbackId) {
  if (ret.status === PASS) {
    invoke(callbackId, {
      errMsg: 'pushListener:ok'
    })
  } else {
    invoke(callbackId, {
      errMsg: 'pushListener:fail:' + ret.message,
      code: ret.status,
      message: ret.message
    })
  }
}
/**
 * @desc 开启监听
 *
 */
export function onPush (callbackId) {
  console.log('onpush======', callbackId)
  callbacks.push(callbackId)
  foxsdk.events.addEventListener('pushMessage', ret => {
    invokeListener(ret, callbackId)
  })
}

/**
 * @desc 关闭监听
 *
 */
export function offPush (callbackId) {
  console.log('offPush======', callbackId)
  foxsdk.events.removeEventListener('pushMessage', ret => {
    callbacks.forEach(callbackId => {
      invokeListener(ret, callbackId)
    })
  })
}
