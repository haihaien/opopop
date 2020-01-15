import { PASS, NETWORK_TYPES } from '../constants'

const {
  invokeCallbackHandler: invoke
} = UniServiceJSBridge

const callbackIds = []

function changeHandler (networkType) {
  callbackIds.forEach(callbackId => {
    invoke(callbackId, {
      errMsg: 'onNetworkStatusChange:ok',
      isConnected: networkType !== 'none',
      networkType
    })
  })
}

export function onNetworkStatusChange (callbackId) {
  if (window.foxsdk && foxsdk.events) {
    callbackIds.push(callbackId)
    foxsdk.events.addEventListener('netchange', () => {
      foxsdk.networkinfo.getCurrentType(ret => {
        const networkType = NETWORK_TYPES[ret.payload.networkType]
        changeHandler(networkType)
      })
    })
  }
}

export function getNetworkType () {
  // export const NETWORK_TYPES = ['unknown', 'none', 'ethernet', 'wifi', '2g', '3g', '4g']
  return new Promise((resolve, reject) => {
    foxsdk.networkinfo.getCurrentType(ret => {
      if (ret.status === PASS) {
        resolve({
          networkType: NETWORK_TYPES[ret.payload.networkType]
        })
      } else {
        reject(ret.message)
      }
    })
  })
}
