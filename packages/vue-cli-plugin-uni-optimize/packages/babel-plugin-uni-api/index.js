const path = require('path')

const {
  normalizePath
} = require('@yump/uni-cli-shared')

process.UNI_APIS = new Set()

const sourcePath = normalizePath(path.join(require.resolve('@yump/uni-h5'), '../../'))

module.exports = function({
  types: t
}) {
  return {
    visitor: {
      MemberExpression(path, state) {
        if (
          t.isIdentifier(path.node.object) &&
          (
            path.node.object.name === 'uni' ||
            path.node.object.name === 'wx'
          )
        ) {
          if (normalizePath(state.file.opts.filename).indexOf(sourcePath) === 0) {
            path.stop()
            return
          }
          process.UNI_APIS.add(path.node.property.name || path.node.property.value)
        }
      }
    }
  }
}
