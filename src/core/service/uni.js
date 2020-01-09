import apis from '../../../lib/apis'
import {
  wrapper,
  wrapperUnimplemented
} from 'uni-helpers/api'
import {
  promisify
} from 'uni-helpers/promise'

import api from 'uni-service-api'

export const uni = Object.create(null)

apis.forEach(name => {
  if (api[name]) {
    // 已封装API
    uni[name] = promisify(name, wrapper(name, api[name]))
  } else {
    // 未实现API
    uni[name] = wrapperUnimplemented(name)
  }
})
