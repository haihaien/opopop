import { PASS } from '../constants'

export function makePhoneCall ({
  phoneNumber
} = {}) {
  return new Promise((resolve, reject) => {
    foxsdk.device.dial(phoneNumber, ret => {
      if (ret.status === PASS) {
        resolve(ret.payload)
      } else {
        reject(ret.message)
      }
    })
  })
}
