import { PASS } from '../constants'

const {
  invokeCallbackHandler: invoke
} = UniServiceJSBridge

export function makePhoneCall ({
  phoneNumber
} = {}, callbackId) {
  // return new Promise((resolve, reject) => {
  foxsdk.device.dial(phoneNumber, ret => {
    if (ret.status === PASS) {
      // resolve(ret.payload)
      invoke(callbackId, {
        errMsg: 'makePhoneCall:ok',
        result: ret.payload
      })
    } else {
      // reject(ret.message)
      invoke(callbackId, {
        errMsg: 'makePhoneCall:fail',
        code: ret.status,
        message: ret.message
      })
    }
  })
  // })
}
