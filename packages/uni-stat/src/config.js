import {
  version
} from '../package.json'
let defaultUrl = 'http://192.168.251.163:18080/yump-mgw/log/log-collector/t0001'
const yuStatConfig = require('yu-stat-config')
if (yuStatConfig.uniStatistics && yuStatConfig.uniStatistics.url) {
  defaultUrl = yuStatConfig.uniStatistics.url
}
export const STAT_VERSION = version
export const STAT_URL = defaultUrl
export const STAT_H5_URL = 'http://192.168.251.163:18080/yump-mgw/log/log-collector/t0001'
export const STAT_KEY = ''
export const PAGE_PVER_TIME = 100
export const APP_PVER_TIME = 300
export const OPERATING_TIME = 10
