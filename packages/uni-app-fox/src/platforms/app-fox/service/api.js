const api = Object.create(null)

const modules = require.context('./api', true, /\.js$/)
console.log(modules)
modules.keys().forEach(function (key) {
  Object.assign(api, modules(key))
})

export default api
