const path = require('path')

const resolve = dir => path.resolve(__dirname, '../', dir)

const pkgPath = resolve('package.json')

const webpackConfig = require('./webpack.config.js')

let outputDir = resolve('./packages/uni-' + process.env.UNI_PLATFORM + '/dist')

if (process.env.UNI_PLATFORM === 'h5' && process.env.UNI_UI === 'true') {
  outputDir = resolve('./packages/uni-' + process.env.UNI_PLATFORM + '-ui/dist')
}

module.exports = {
  publicPath: '/',
  outputDir,
  lintOnSave: true, // or error//是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码

  runtimeCompiler: false, // 是否使用包含运行时编译器的 Vue 构建版本
  transpileDependencies: [], // 默认情况下 babel-loader 会忽略所有 node_modules 中的文件
  productionSourceMap: false, // 生产环境的 source map
  configureWebpack: webpackConfig,
  // 禁用关闭多线程编译，避免menifest编译失败
  //! ~['h5', 'app-fox'].indexOf(process.env.UNI_PLATFORM) || process.env.UNI_WATCH !== 'false' || process.env.UNI_UI === 'true',
  parallel: false,
  chainWebpack: config => { // 内部的 webpack 配置进行更细粒度的修改
    config.devtool('source-map')

    config.module
      .rule('eslint')
      .include
      .add(resolve('src'))
      .add(resolve('lib/' + process.env.UNI_PLATFORM))
      .end()
      .use('eslint-loader')
      .loader(resolve('node_modules/eslint-loader'))
      .options({
        fix: true,
        configFile: pkgPath
      })
    config.plugins.delete('hmr') // remove hot module reload
  },
  css: {
    extract: true // 将组件中的 CSS 提取至一个独立的 CSS 文件中
  }
}
