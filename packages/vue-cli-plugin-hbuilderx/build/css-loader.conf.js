const fs = require('fs')
const path = require('path')

const {
  getPlatformScss,
  getPlatformSass,
  nvueCssPreprocessOptions
} = require('@yump/uni-cli-shared')

const {
  sassLoaderVersion
} = require('@yump/uni-cli-shared/lib/scss')

const nvueStyleLoader = {
  loader: '@yump/vue-cli-plugin-hbuilderx/packages/webpack-uni-nvue-loader/lib/style'
}

const preprocessLoader = {
  loader: '@yump/vue-cli-plugin-uni/packages/webpack-preprocess-loader',
  options: nvueCssPreprocessOptions
}

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    sourceMap: false,
    parser: require('postcss-comment'),
    plugins: [
      require('postcss-import'),
      require('@yump/vue-cli-plugin-uni/packages/postcss')
    ]
  }
}

// sass 全局变量
const isSass = fs.existsSync(path.resolve(process.env.UNI_INPUT_DIR, 'assets/styles/variables.sass'))
const isScss = fs.existsSync(path.resolve(process.env.UNI_INPUT_DIR, 'assets/styles/variables.scss'))
let sassData = isSass ? getPlatformSass() : getPlatformScss()

if (isSass) {
  sassData = `@import "@/assets/styles/variables.sass"`
} else if (isScss) {
  sassData = `${sassData}
  @import "@/assets/styles/variables.scss";`
}

const scssLoader = {
  loader: 'sass-loader',
  options: {
    sourceMap: false
  }
}

const sassLoader = {
  loader: 'sass-loader',
  options: {
    sourceMap: false
  }
}

if (sassLoaderVersion < 8) {
  scssLoader.options.data = sassData
  sassLoader.options.data = sassData
  sassLoader.options.indentedSyntax = true
} else {
  scssLoader.options.prependData = sassData
  sassLoader.options.prependData = sassData
  sassLoader.options.sassOptions = {
    indentedSyntax: true
  }
}

const lessLoader = {
  loader: 'less-loader',
  options: {
    sourceMap: false
  }
}

const stylusLoader = {
  loader: 'stylus-loader',
  options: {
    sourceMap: false,
    preferPathResolver: 'webpack'
  }
}

function createOneOf (preLoader) {
  const use = [
    nvueStyleLoader,
    preprocessLoader
  ]
  use.push(postcssLoader)
  if (preLoader) {
    use.push(preLoader)
  }
  use.push(preprocessLoader)

  return [{
    resourceQuery: /\?vue/,
    use
  },
  {
    use
  }
  ]
}

module.exports = [{
  test: /\.css$/,
  oneOf: createOneOf()
}, {
  test: /\.scss$/,
  oneOf: createOneOf(scssLoader)
}, {
  test: /\.sass$/,
  oneOf: createOneOf(sassLoader)
}, {
  test: /\.less$/,
  oneOf: createOneOf(lessLoader)
}, {
  test: /\.styl(us)?$/,
  oneOf: createOneOf(stylusLoader)
}]
