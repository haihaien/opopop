import { PASS } from '../constants'

const {
  invokeCallbackHandler: invoke
} = UniServiceJSBridge

export function scanCode (options, callbackId) {
  console.log('scanCode。。。。。。。')
  // return new Promise((resolve, reject) => {
  foxsdk.barcode.scan(ret => {
    if (ret.status === PASS) {
      // resolve(ret.payload)
      invoke(callbackId, {
        errMsg: 'scanCode:ok',
        ...ret.payload
      })
    } else {
      // reject(ret.message)
      invoke(callbackId, {
        code: ret.status,
        message: ret.message,
        errMsg: 'scanCode:fail'
      })
    }
  })
  // })
}
