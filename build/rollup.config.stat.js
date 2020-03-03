import babel from 'rollup-plugin-babel'
import buble from 'rollup-plugin-buble'

module.exports = {
  input: 'packages/uni-stat/src/index.js',
  output: {
    file: 'packages/uni-stat/dist/index.js',
    format: 'es'
  },
  external: ['vue', '../package.json'],
  plugins: [
    // https://github.com/rollup/rollup-plugin-babel#modules
    babel({
      babelrc: false,
      presets: [['env', { modules: false }]]
    }),
    buble()
  ]
}
