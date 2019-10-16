const assetsDir = 'static'

function getCopyWebpackPluginOptions (manifestPlatformOptions) {
  const {
    getPlatformCopy
  } = require('@yump/uni-cli-shared/lib/platform')

  return getPlatformCopy()({
    assetsDir,
    manifestPlatformOptions
  })
}

module.exports = {
  assetsDir,
  getCopyWebpackPluginOptions
}
