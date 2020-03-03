import {
  TEMP_PATH, PASS
} from '../constants'
// import {
//   getRealPath
// } from '../util'

const {
  invokeCallbackHandler: invoke
} = UniServiceJSBridge

// uniapp 0:图文，1:纯文字，2:纯图片，3:音乐，4:视频，5:小程序
// app-fox:
// 0 自动适配类型，视传入的参数来决定（Android不支持此类型)
// 1 文本
// 2 图片
// 3 网页
// 4 应用（Android不支持）
// 5 音频
// 6 视频
// 7 文件类型(暂时仅微信可用)
const TYPES = {
  '0': {
    name: 'web',
    title: '图文'
  },
  '1': {
    name: 'text',
    title: '纯文字'
  },
  '2': {
    name: 'image',
    title: '纯图片'
  },
  '3': {
    name: 'music',
    title: '音乐'
  },
  '4': {
    name: 'video',
    title: '视频'
  },
  '5': {
    name: 'miniProgram',
    title: '小程序'
  },
  '6': {
    name: 'href',
    title: '网页链接'
  },
  '7': {
    name: 'file',
    title: '文件'
  }
}

const CHANNALS = {
  'weixinWXSceneSession': {
    provider: 'webchat',
    name: '微信好友'
  },
  'weixinWXSenceTimeline': {
    provider: 'timeline',
    name: '朋友圈'
  },
  'sinaweibo': {
    provider: 'sina',
    name: '新浪微博'
  },
  'dingtalk': {
    provider: 'dingtalk',
    name: '钉钉'
  }

}

const parseParams = (args, callbackId, method) => {
  args.type = args.type || 0

  let {
    provider,
    type,
    title,
    summary: text,
    href,
    imageUrl,
    mediaUrl: media,
    scene,
    miniProgram
  } = args

  if (typeof imageUrl === 'string' && imageUrl) {
    // imageUrl = getRealPath(imageUrl)
  }

  const shareType = TYPES[type + '']
  scene = scene || ''
  if (shareType) {
    let sendMsg = {
      provider: CHANNALS[provider + scene].provider,
      type: shareType.name,
      title,
      text,
      url: href,
      images: media ? [imageUrl].push(media) : [imageUrl],
      // thumbs: [imageUrl],
      // media,
      miniProgram
      // channel: CHANNALS[provider + scene].channel
      // scene
    }
    if (provider === 'weixin' && (type === 1 || type === 2)) {
      delete sendMsg.thumbs
    }
    return sendMsg
  }
  return '分享参数 type 不正确'
}

// const sendShareMsg = function (service, params, callbackId, method = 'share') {
//   service.send(
//     params,
//     () => {
//       invoke(callbackId, {
//         errMsg: method + ':ok'
//       })
//     },
//     err => {
//       invoke(callbackId, {
//         errMsg: method + ':fail:' + err.message
//       })
//     }
//   )
// }

/**
 *  直接使用微信分享
 * @param {*} param0
 * @param {*} callbackId
 */
export function shareAppMessageDirectly ({
  title,
  path,
  imageUrl,
  useDefaultSnapshot
}, callbackId) {
  title = title || __uniConfig.appname
  const goShare = () => {
    share({
      provider: 'weixin',
      type: 0,
      title,
      imageUrl,
      href: path,
      scene: 'WXSceneSession'
    },
    callbackId,
    'shareAppMessageDirectly'
    )
  }
  if (useDefaultSnapshot) {
    const pages = getCurrentPages()
    const webview = plus.webview.getWebviewById(pages[pages.length - 1].__wxWebviewId__ + '')
    if (webview) {
      const bitmap = new plus.nativeObj.Bitmap()
      webview.draw(
        bitmap,
        () => {
          const fileName = TEMP_PATH + '/share/snapshot.jpg'
          bitmap.save(
            fileName, {
              overwrite: true,
              format: 'jpg'
            },
            () => {
              imageUrl = fileName
              goShare()
            },
            err => {
              invoke(callbackId, {
                errMsg: 'shareAppMessageDirectly:fail:' + err.message
              })
            }
          )
        },
        err => {
          invoke(callbackId, {
            errMsg: 'shareAppMessageDirectly:fail:' + err.message
          })
        }
      )
    } else {
      goShare()
    }
  } else {
    goShare()
  }
}

function invokeShare (ret, callbackId, method = 'share') {
  if (ret && ret.status === PASS) {
    invoke(callbackId, {
      errMsg: method + ':ok'
    })
  } else {
    invoke(callbackId, {
      errMsg: method + ':fail:' + ret.message
    })
  }
}

/**
   * 分享
   * @param {*} params
   * @param {*} callbackId
   * @param {*} method
   */
export function share (params, callbackId, method = 'share') {
  // 格式化参数
  params = parseParams(params, callbackId, method)
  if (typeof params === 'string') {
    return invoke(callbackId, {
      errMsg: method + ':fail:' + params
    })
  }
  if (!window.foxsdk || !foxsdk.share) {
    return invoke(callbackId, {
      errMsg: method + ':fail:share sdk not ready'
    })
  }
  // const provider = params.provider;
  const provider = params.provider
  console.log('分享上送参数:' + JSON.stringify(params))
  if (provider === 'webchat') { // 好友分享
    foxsdk.share.sendByWechat(params, ret => {
      invokeShare(ret, callbackId, method)
    })
  } else if (provider === 'timeline') { // 朋友圈
    foxsdk.share.sendByMoments(params, ret => {
      invokeShare(ret, callbackId, method)
    })
  } else if (provider === 'sina') { // 新浪
    foxsdk.share.sendBySina(params, ret => {
      invokeShare(ret, callbackId, method)
    })
  } else if (provider === 'dingtalk') { // 钉钉
    foxsdk.share.sendByDingTalk(params, ret => {
      invokeShare(ret, callbackId, method)
    })
  }
  /* plus.share.getServices(
    services => {
      const service = services.find(({
        id
      }) => id === provider)
      if (!service) {
        invoke(callbackId, {
          errMsg: method + ':fail:分享服务[' + provider + ']不存在'
        })
      } else {
        if (service.authenticated) {
          sendShareMsg(service, params, callbackId)
        } else {
          service.authorize(
            () => sendShareMsg(service, params, callbackId),
            err => {
              invoke(callbackId, {
                errMsg: method + ':fail:' + err.message
              })
            }
          )
        }
      }
    },
    err => {
      invoke(callbackId, {
        errMsg: method + ':fail:' + err.message
      })
    }
  ) */
}
