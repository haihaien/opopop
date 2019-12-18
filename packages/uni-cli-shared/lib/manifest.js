const path = require('path')

const {
  getJson,
  parseJson
} = require('./json')

const defaultRouter = {
  mode: 'hash',
  base: '/'
}

const defaultAsync = {
  loading: 'AsyncLoading',
  error: 'AsyncError',
  delay: 200,
  timeout: 3000
}

const networkTimeout = {
  request: 6000,
  connectSocket: 6000,
  uploadFile: 6000,
  downloadFile: 6000
}

function getManifestJson () {
  return getJson('manifest.json')
}

function parseManifestJson (content) {
  return parseJson(content)
}

function getNetworkTimeout (manifestJson) {
  if (!manifestJson) {
    manifestJson = getManifestJson()
  }
  return Object.assign({}, networkTimeout, manifestJson.networkTimeout || {})
}

function getH5Options (manifestJson) {
  if (!manifestJson) {
    manifestJson = getManifestJson()
  }

  const h5 = manifestJson.h5 || {}

  h5.appid = (manifestJson.appid || '').replace('__UNI__', '')

  h5.title = h5.title || manifestJson.name || ''

  h5.router = Object.assign({}, defaultRouter, h5.router || {})

  h5['async'] = Object.assign({}, defaultAsync, h5['async'] || {})

  let base = h5.router.base

  if (base.indexOf('/') !== 0) {
    base = '/' + base
  }

  if (base.substr(-1) !== '/') {
    base = base + '/'
  }

  h5.router.base = base

  if (process.env.NODE_ENV === 'production') { // 生产模式，启用 publicPath
    h5.publicPath = h5.publicPath || base

    if (h5.publicPath.substr(-1) !== '/') {
      h5.publicPath = h5.publicPath + '/'
    }
  } else { // 其他模式，启用 base
    h5.publicPath = base
  }

  /* eslint-disable no-mixed-operators */
  h5.template = h5.template && path.resolve(process.env.UNI_INPUT_DIR, h5.template) || path.resolve(__dirname,
    '../../../../public/index.html')

  h5.devServer = h5.devServer || {}

  return h5
}

// 新增manifest.json文件中app-fox:配置项
function getAppFoxOptions (manifestJson) {
  if (!manifestJson) {
    manifestJson = getManifestJson()
  }

  const appFox = manifestJson['app-fox'] || {}

  appFox.appid = (manifestJson.appid || '').replace('__UNI__', '')

  appFox.title = appFox.title || manifestJson.name || ''

  appFox.router = Object.assign({}, defaultRouter, appFox.router || {})

  appFox['async'] = Object.assign({}, defaultAsync, appFox['async'] || {})

  let base = appFox.router.base

  if (base.indexOf('/') !== 0) {
    base = '/' + base
  }

  if (base.substr(-1) !== '/') {
    base = base + '/'
  }

  appFox.router.base = base

  if (process.env.NODE_ENV === 'production') { // 生产模式，启用 publicPath
    appFox.publicPath = appFox.publicPath || base

    if (appFox.publicPath.substr(-1) !== '/') {
      appFox.publicPath = appFox.publicPath + '/'
    }
  } else { // 其他模式，启用 base
    appFox.publicPath = base
  }

  /* eslint-disable no-mixed-operators */
  appFox.template = appFox.template && path.resolve(process.env.UNI_INPUT_DIR, appFox.template) || path.resolve(__dirname,
    '../../../../public/index.html')

  appFox.devServer = appFox.devServer || {}

  return appFox
}

module.exports = {
  getManifestJson,
  parseManifestJson,
  getNetworkTimeout,
  getH5Options,
  getAppFoxOptions
}
