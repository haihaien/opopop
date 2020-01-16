import getWindowOffset from 'uni-platform/helpers/get-window-offset'
import safeAreaInsets from 'safe-area-insets'
import { PASS } from '../constants'
// import {
//   publish
// } from '../../bridge'

const ua = navigator.userAgent
/**
 * 是否安卓设备
 */
const isAndroid = /android/i.test(ua)
/**
 * 是否iOS设备
 */
const isIOS = /iphone|ipad|ipod/i.test(ua)

// const callbacks = []
// onMethod('getSystemInfo', function (res) {
//   // callbacks.forEach(callbackId => {
//   //   invoke(callbackId, res)
//   // })
//   console.log(res)
//   alert('getsysteminfo')
// })

const {
  invokeCallbackHandler: invoke
} = UniServiceJSBridge

/* export function getSystemInfo (options, callbackId) {
  invoke(callbackId, {
    errMsg: 'getSystemInfo:ok',
    data: {}
  })
} */

/**
 * 重写系统信息-异步
 */
export function getSystemInfo (options, callbackId) {
  // console.log('异步获取系统信息........')
  // return new Promise((resolve, reject) => {
  foxsdk.device.getSystemInfo(ret => {
    console.log('app-fox device/getSystemInfo===status: ' + ret.status + ',message: ' + ret.message + ',payload: ' + JSON.stringify(ret.payload))
    if (ret.status === PASS) {
      let data = ret.payload
      var windowWidth = window.innerWidth
      var windowHeight = window.innerHeight
      const {
        top: windowTop,
        bottom: windowBottom
      } = getWindowOffset()

      windowHeight -= windowTop
      windowHeight -= windowBottom

      // let safeAreaInsets = data.name === 'iOS' ? data.safeAreaInsets : getSafeAreaInsets()
      let systeminfo = {
        brand: data.vendor,
        model: data.model,
        pixelRatio: data.scale,
        screenWidth: data.resolutionWidth,
        screenHeight: data.resolutionHeight,
        windowWidth,
        windowHeight,
        windowTop: 0,
        windowBottom: 0,
        statusBarHeight: data.statusbarHeight,
        // navigationBarHeight: ,
        language: data.language,
        system: data.version,
        version: data.innerVersion,
        fontSizeSetting: '',
        platform: data.name,
        SDKVersion: '',
        safeArea: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          height: 0,
          width: 0
        },
        safeAreaInsets: data.safeAreaInsets
      }

      // resolve(systeminfo)
      invoke(callbackId, {
        errMsg: 'getSystemInfo:ok',
        ...systeminfo
      })
    } else {
      // reject(ret.message)
      invoke(callbackId, {
        code: ret.status,
        message: ret.message,
        errMsg: 'getSystemInfo:fail'
      })
    }
  })
  // })
}

/**
 * 获取系统信息-同步
 */
export function getSystemInfoSync () {
  // console.log('同步获取系统信息........')
  var windowWidth = window.innerWidth
  var windowHeight = window.innerHeight
  var screen = window.screen
  var pixelRatio = window.devicePixelRatio
  var screenWidth = screen.width
  var screenHeight = screen.height
  var language = navigator.language
  var statusBarHeight = 0
  var osname
  var osversion
  var model

  if (isIOS) {
    osname = 'iOS'
    let osversionFind = ua.match(/OS\s([\w_]+)\slike/)
    if (osversionFind) {
      osversion = osversionFind[1].replace(/_/g, '.')
    }
    let modelFind = ua.match(/\(([a-zA-Z]+);/)
    if (modelFind) {
      model = modelFind[1]
    }
  } else if (isAndroid) {
    osname = 'Android'
    // eslint-disable-next-line no-useless-escape
    let osversionFind = ua.match(/Android[\s/]([\w\.]+)[;\s]/)
    if (osversionFind) {
      osversion = osversionFind[1]
    }
    let infoFind = ua.match(/\((.+?)\)/)
    let infos = infoFind ? infoFind[1].split(';') : ua.split(' ')
    // eslint-disable-next-line no-useless-escape
    const otherInfo = [/\bAndroid\b/i, /\bLinux\b/i, /\bU\b/i, /^\s?[a-z][a-z]$/i, /^\s?[a-z][a-z]-[a-z][a-z]$/i, /\bwv\b/i, /\/[\d\.,]+$/, /^\s?[\d\.,]+$/, /\bBrowser\b/i, /\bMobile\b/i]
    for (let i = 0; i < infos.length; i++) {
      const info = infos[i]
      if (info.indexOf('Build') > 0) {
        model = info.split('Build')[0].trim()
        break
      }
      let other
      for (let o = 0; o < otherInfo.length; o++) {
        if (otherInfo[o].test(info)) {
          other = true
          break
        }
      }
      if (!other) {
        model = info.trim()
        break
      }
    }
  } else {
    osname = 'Other'
    osversion = '0'
  }

  var system = `${osname} ${osversion}`
  var platform = osname.toLocaleLowerCase()
  var safeArea = {
    left: safeAreaInsets.left,
    right: windowWidth - safeAreaInsets.right,
    top: safeAreaInsets.top,
    bottom: windowHeight - safeAreaInsets.bottom,
    width: windowWidth - safeAreaInsets.left - safeAreaInsets.right,
    height: windowHeight - safeAreaInsets.top - safeAreaInsets.bottom
  }

  const {
    top: windowTop,
    bottom: windowBottom
  } = getWindowOffset()

  windowHeight -= windowTop
  windowHeight -= windowBottom

  return {
    windowTop,
    windowBottom,
    windowWidth,
    windowHeight,
    pixelRatio,
    screenWidth,
    screenHeight,
    language,
    statusBarHeight,
    system,
    platform,
    model,
    safeArea
  }
}
