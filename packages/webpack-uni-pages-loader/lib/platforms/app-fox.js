const fs = require('fs')
const path = require('path')

const {
  getPlatforms,
  // getH5Options,
  getAppFoxOptions,
  getFlexDirection,
  getNetworkTimeout
} = require('@yump/uni-cli-shared')

const PLATFORMS = getPlatforms()

const isWin = /^win/.test(process.platform)
const normalizePath = path => (isWin ? path.replace(/\\/g, '/') : path)

const removePlatformStyle = function (style) {
  Object.keys(style).forEach(name => {
    if (PLATFORMS.includes(name)) {
      delete style[name]
    }
  })
}

const getPageComponents = function (inputDir, pagesJson) {
  const firstPagePath = pagesJson.pages[0].path
  const pages = pagesJson.pages

  // 解析分包
  if (pagesJson.subPackages && pagesJson.subPackages.length) {
    pagesJson.subPackages.forEach(({
      root,
      pages: subPages
    }) => {
      if (root && subPages.length) {
        subPages.forEach(subPage => {
          subPage.path = normalizePath(path.join(root, subPage.path))
          pages.push(subPage)
        })
      }
    })
  }

  const tabBarList = (pagesJson.tabBar && pagesJson.tabBar.list) || []
  tabBarList.forEach(item => { // 添加全部属性，方便 Vue 响应式
    item.text = item.text || ''
    item.iconPath = item.iconPath || ''
    item.selectedIconPath = item.selectedIconPath || ''
    item.redDot = false
    item.badge = ''
  })

  if (tabBarList.length) { // 添加全部属性，方便 Vue 响应式
    pagesJson.tabBar.color = pagesJson.tabBar.color || '#999'
    pagesJson.tabBar.selectedColor = pagesJson.tabBar.selectedColor || '#007aff'
    pagesJson.tabBar.backgroundColor = pagesJson.tabBar.backgroundColor || '#f7f7fa'
    pagesJson.tabBar.borderStyle = pagesJson.tabBar.borderStyle || 'black'
  }

  const globalStyle = pagesJson.globalStyle || {}

  // 修复pages.json中配置的key为app-fox
  process.UNI_H5_PAGES_JSON = {
    pages: {},
    // globalStyle: Object.assign({}, globalStyle, globalStyle['app-plus'] || {}, globalStyle['h5'] || {})
    globalStyle: Object.assign({}, globalStyle, globalStyle['app-plus'] || {}, globalStyle['h5'] || {}, globalStyle['app-fox'] || {})
  }

  removePlatformStyle(process.UNI_H5_PAGES_JSON.globalStyle)

  return pages.map(page => {
    const name = page.path.replace(/\//g, '-')
    const pagePath = normalizePath(path.resolve(inputDir, page.path))
    const props = page.style || {}
    const isEntry = firstPagePath === page.path
    const tabBarIndex = tabBarList.findIndex(tabBarPage => tabBarPage.pagePath === page.path)
    const isTabBar = tabBarIndex !== -1

    let isNVue = false
    if (process.env.UNI_USING_NVUE_COMPILER) {
      if (!fs.existsSync(pagePath + '.vue') && fs.existsSync(pagePath + '.nvue')) {
        isNVue = true
      }
    }
    // 解析 titleNView，pullToRefresh
    // 修复属性名称
    // const h5Options = Object.assign({}, props['app-plus'] || {}, props['h5'] || {})
    const h5Options = Object.assign({}, props['app-plus'] || {}, props['h5'] || {}, props['app-fox'] || {})

    removePlatformStyle(h5Options)

    if (h5Options.hasOwnProperty('titleNView')) {
      props.titleNView = h5Options.titleNView
    }
    if (h5Options.hasOwnProperty('pullToRefresh')) {
      props.pullToRefresh = h5Options.pullToRefresh
    }

    let windowTop = 44 // 默认值
    let pageStyle = Object.assign({}, globalStyle, props)
    if (pageStyle.navigationStyle === 'custom' || (props.titleNView && props.titleNView.type ===
        'transparent')) {
      windowTop = 0
    }

    // 删除 app-plus 平台配置
    delete props['app-plus']
    delete props['h5']
    delete props['app-fox']

    process.UNI_H5_PAGES_JSON.pages[page.path] = props

    return {
      name,
      route: page.path,
      path: pagePath,
      props,
      isNVue,
      isEntry,
      isTabBar,
      tabBarIndex,
      isQuit: isEntry || isTabBar,
      needAuth: page.needAuth || false, // 在pages.json新增 "needAuth"字段,if true 则需要登录,否则不需要登录
      windowTop
    }
  }).filter(pageComponents => !!pageComponents)
}

const genRegisterPageVueComponentsCode = function (pageComponents) {
  return pageComponents
    .map(({
      name,
      path,
      isNVue,
      isQuit,
      isEntry,
      isTabBar
    }) => {
      const ext = isNVue ? '.nvue' : '.vue'

      return `Vue.component('${name}', resolve=>{
const component = {
  component:require.ensure([], () => resolve(require('${path}${ext}')), '${name}'),
  delay:__uniConfig['async'].delay,
  timeout: __uniConfig['async'].timeout
}
if(__uniConfig['async']['loading']){
  component.loading={
    name:'SystemAsyncLoading',
    render(createElement){
      return createElement(__uniConfig['async']['loading'])
    }
  }
}
if(__uniConfig['async']['error']){
  component.error={
    name:'SystemAsyncError',
    render(createElement){
      return createElement(__uniConfig['async']['error'])
    }
  }
}
return component
})`
    })
    .join('\n')
}

const genPageRoutes = function (pageComponents) {
  let id = 1
  return pageComponents
    .map(({
      name,
      route,
      props,
      isNVue,
      isQuit,
      isEntry,
      isTabBar,
      windowTop,
      tabBarIndex,
      needAuth
    }) => {
      return `
{
path: '/${isEntry ? '' : route}',${isEntry ? '\nalias:\'/' + route + '\',' : ''}
component: {
  render (createElement) {
    return createElement(
      'Page',
      {
        props: Object.assign({
          ${isQuit ? 'isQuit:true,\n' : ''}
          ${isEntry ? 'isEntry:true,\n' : ''}
          ${isTabBar ? 'isTabBar:true,\n' : ''}
          ${isTabBar ? ('tabBarIndex:' + tabBarIndex) : ''}
        },__uniConfig.globalStyle,${JSON.stringify(props)})
      },
      [
        createElement('${name}', {
          slot: 'page'
        })
      ]
    )
  }
},
meta:{${isQuit ? '\nid:' + (id++) + ',' : ''}
  name:'${name}',
  needAuth:'${needAuth}',
  isNVue:${isNVue},
  pagePath:'${route}'${isQuit ? ',\nisQuit:true' : ''}${isEntry ? ',\nisEntry:true' : ''}${isTabBar ? ',\nisTabBar:true' : ''}${tabBarIndex !== -1 ? (',\ntabBarIndex:' + tabBarIndex) : ''},
  windowTop:${windowTop}
}
}`
    })
}

const genSystemRoutes = function () {
  return [
    `
{
path: '/preview-image',
component: {
  render (createElement) {
    return createElement(
      'Page',
      {
        props:{
          navigationStyle:'custom'
        }
      },
      [
        createElement('system-preview-image', {
          slot: 'page'
        })
      ]
    )
  }
},
meta:{
  name:'preview-image',
  pagePath:'/preview-image'
}
}
    `,
    `
{
path: '/choose-location',
component: {
  render (createElement) {
    return createElement(
      'Page',
      {
        props:{
          navigationStyle:'custom'
        }
      },
      [
        createElement('system-choose-location', {
          slot: 'page'
        })
      ]
    )
  }
},
meta:{
  name:'choose-location',
  pagePath:'/choose-location'
}
}
    `,
    `
{
path: '/open-location',
component: {
  render (createElement) {
    return createElement(
      'Page',
      {
        props:{
          navigationStyle:'custom'
        }
      },
      [
        createElement('system-open-location', {
          slot: 'page'
        })
      ]
    )
  }
},
meta:{
  name:'open-location',
  pagePath:'/open-location'
}
}
    `
  ]
}

module.exports = function (pagesJson, manifestJson) {
  const inputDir = process.env.UNI_INPUT_DIR

  const pageComponents = getPageComponents(inputDir, pagesJson)

  delete pagesJson.pages
  delete pagesJson.subPackages

  // const h5 = getH5Options(manifestJson)

  const appFox = getAppFoxOptions(manifestJson)

  const networkTimeoutConfig = getNetworkTimeout(manifestJson)

  let qqMapKey = 'XVXBZ-NDMC4-JOGUS-XGIEE-QVHDZ-AMFV2'

  const sdkConfigs = appFox.sdkConfigs || {}
  if (
    sdkConfigs.maps &&
    sdkConfigs.maps.qqmap &&
    sdkConfigs.maps.qqmap.key
  ) {
    qqMapKey = sdkConfigs.maps.qqmap.key
  }

  return `
import Vue from 'vue'
global['____${appFox.appid}____'] = true;
delete global['____${appFox.appid}____'];
global.__uniConfig = ${JSON.stringify(pagesJson)};
global.__uniConfig.router = ${JSON.stringify(appFox.router)};
global.__uniConfig['async'] = ${JSON.stringify(appFox['async'])};
global.__uniConfig.debug = ${manifestJson.debug === true};
global.__uniConfig.networkTimeout = ${JSON.stringify(networkTimeoutConfig)};
global.__uniConfig.sdkConfigs = ${JSON.stringify(sdkConfigs)};
global.__uniConfig.qqMapKey = ${JSON.stringify(qqMapKey)};
global.__uniConfig.nvue = ${JSON.stringify({ 'flex-direction': getFlexDirection(manifestJson['app-plus']) })}
${genRegisterPageVueComponentsCode(pageComponents)}
global.__uniRoutes=[${genPageRoutes(pageComponents).concat(genSystemRoutes()).join(',')}]
`
}
