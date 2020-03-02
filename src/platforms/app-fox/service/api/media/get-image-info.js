import getRealPath from 'uni-platform/helpers/get-real-path'

function _getServiceAddress () {
  return window.location.protocol + '//' + window.location.host
}
/**
 * 获取图片信息,app-fox未实现,暂用h5实现
 * @param {*} param0
 * @param {*} callbackId
 */
export function getImageInfo ({
  src
}, callbackId) {
  const {
    invokeCallbackHandler: invoke
  } = UniServiceJSBridge
  const img = new Image()
  const realPath = getRealPath(src)
  img.onload = function () {
    invoke(callbackId, {
      errMsg: 'getImageInfo:ok',
      width: img.naturalWidth,
      height: img.naturalHeight,
      path: realPath.indexOf('/') === 0 ? _getServiceAddress() + realPath : realPath
    })
  }
  img.onerror = function (e) {
    invoke(callbackId, {
      errMsg: 'getImageInfo:fail'
    })
  }
  img.src = src
}
