import { PASS } from '../constants'

export function scanCode () {
  console.log('scanCode。。。。。。。')
  return new Promise((resolve, reject) => {
    foxsdk.barcode.scan(ret => {
      if (ret.status === PASS) {
        resolve(ret.payload)
      } else {
        reject(ret.message)
      }
    })
  })
}
