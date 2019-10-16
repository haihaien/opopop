const stringify = require('./stringify')
module.exports = function (errors) {
  const {
    runByHBuilderX
  } = require('@yump/uni-cli-shared')
  if (runByHBuilderX) {
    console.log('WARNING: ' + stringify(errors))
  } else {
    console.warn(stringify(errors))
  }
}
