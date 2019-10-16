module.exports = (api, options, rootOptions) => {
  const mainVersion = require('./package.json').version
  const version = '^' + mainVersion
  api.extendPackage(pkg => {
    delete pkg.postcss
    delete pkg.browserslist
    return {
      scripts: {
        'info': 'node node_modules/@yump/vue-cli-plugin-uni/commands/info.js',
        'serve': 'npm run dev:h5',
        'build': 'npm run build:h5',
        'dev:h5': 'cross-env NODE_ENV=development UNI_PLATFORM=h5 vue-cli-service uni-serve',
        'dev:mp-qq': 'cross-env NODE_ENV=development UNI_PLATFORM=mp-qq vue-cli-service uni-build --watch',
        'dev:mp-weixin': 'cross-env NODE_ENV=development UNI_PLATFORM=mp-weixin vue-cli-service uni-build --watch',
        'dev:mp-baidu': 'cross-env NODE_ENV=development UNI_PLATFORM=mp-baidu vue-cli-service uni-build --watch',
        'dev:mp-alipay': 'cross-env NODE_ENV=development UNI_PLATFORM=mp-alipay vue-cli-service uni-build --watch',
        'dev:mp-toutiao': 'cross-env NODE_ENV=development UNI_PLATFORM=mp-toutiao vue-cli-service uni-build --watch',
        'build:h5': 'cross-env NODE_ENV=production UNI_PLATFORM=h5 vue-cli-service uni-build',
        'build:mp-qq': 'cross-env NODE_ENV=production UNI_PLATFORM=mp-qq vue-cli-service uni-build',
        'build:mp-weixin': 'cross-env NODE_ENV=production UNI_PLATFORM=mp-weixin vue-cli-service uni-build',
        'build:mp-baidu': 'cross-env NODE_ENV=production UNI_PLATFORM=mp-baidu vue-cli-service uni-build',
        'build:mp-alipay': 'cross-env NODE_ENV=production UNI_PLATFORM=mp-alipay vue-cli-service uni-build',
        'build:mp-toutiao': 'cross-env NODE_ENV=production UNI_PLATFORM=mp-toutiao vue-cli-service uni-build',
        'dev:custom': 'cross-env NODE_ENV=development uniapp-cli custom',
        'build:custom': 'cross-env NODE_ENV=production uniapp-cli custom'
      },
      'uni-app': {
        'scripts': {}
      },
      dependencies: {
        '@yump/uni-app-plus': version,
        '@yump/uni-h5': version,
        '@yump/uni-mp-qq': version,
        '@yump/uni-mp-weixin': version,
        '@yump/uni-mp-baidu': version,
        '@yump/uni-mp-alipay': version,
        '@yump/uni-mp-toutiao': version,
        '@yump/uni-stat': version,
        'flyio': '^0.6.2',
        'vuex': '^3.0.1'
      },
      devDependencies: {
        '@yump/uni-cli-shared': version,
        '@yump/uni-template-compiler': version,
        '@yump/vue-cli-plugin-hbuilderx': version,
        '@yump/vue-cli-plugin-uni': version,
        '@yump/vue-cli-plugin-uni-optimize': version,
        '@yump/webpack-uni-mp-loader': version,
        '@yump/webpack-uni-pages-loader': version,
        'babel-plugin-import': '^1.11.0'
      },
      browserslist: [
        'Android >= 4',
        'ios >= 8'
      ]
    }
  })
}
