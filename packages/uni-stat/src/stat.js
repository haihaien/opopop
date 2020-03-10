import {
  getSystemInfo,
  InitSystemInfo,
  getSgin,
  getSplicing,
  getPackName,
  getChannel,
  getScene,
  getTime,
  getFirstVisitTime,
  getLastVisitTime,
  setPageResidenceTime,
  getPageResidenceTime,
  getTotalVisitCount,
  GetEncodeURIComponentOptions,
  getFirstTime,
  getLastTime,
  getResidenceTime,
  getPageRoute,
  getRoute,
  getPageTypes,
  calibration
} from './parameter'

import {
  STAT_URL,
  STAT_H5_URL,
  OPERATING_TIME
} from './config'
const PagesJson = require('uni-pages?{"type":"style"}').default
const statConfig = require('uni-stat-config').default || require('uni-stat-config')
InitSystemInfo()
class Util {
  constructor () {
    this.self = ''
    this._retry = 0
    this._platform = ''
    this._query = {}
    this._navigationBarTitle = {
      config: '',
      page: '',
      report: '',
      lt: ''
    }
    this.__prevent_triggering = false

    this.__licationHide = false
    this.__licationShow = false
    this._lastPageRoute = ''
    this.statData = getSystemInfo()
  }
  _applicationShow () {
    // if (this.__licationHide) {
    //   getLastTime()
    //   const time = getResidenceTime('app')
    //   if (time.overtime) {
    //     let options = {
    //       path: this._lastPageRoute,
    //       scene: this.statData.sc
    //     }
    //     this._sendReportRequest(options)
    //   }
    //   this.__licationHide = false
    // }
  }

  _applicationHide (self, type) {
    // this.__licationHide = true
    // getLastTime()
    // const time = getResidenceTime()
    // getFirstTime()
    // const route = getPageRoute(this)
    // this._sendHideRequest({
    //   urlref: route,
    //   urlrefTs: time.residenceTime
    // }, type)
  }

  _pageShow () {
    const route = getPageRoute(this)
    const routepath = getRoute(this)
    this._navigationBarTitle.config = PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].titleNView &&
      PagesJson.pages[routepath].titleNView.titleText ||
      PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].navigationBarTitleText || ''
    if (this.__licationShow) {
      getFirstTime()
      this.__licationShow = false
      // console.log('这是 onLauch 之后执行的第一次 pageShow ，为下次记录时间做准备');
      this._lastPageRoute = route
      return
    }

    getLastTime()
    this._lastPageRoute = route
    const time = getResidenceTime('page')
    if (time.overtime) {
      let options = {
        path: this._lastPageRoute,
        scene: this.statData.sc
      }
      this._sendReportRequest(options)
    }
  }

  _pageHide () {
    if (!this.__licationHide) {
      let lastTime = getLastTime()
      const time = getResidenceTime('page')
      this._sendPageRequest({
        url: this._lastPageRoute,
        urlref: this._lastPageRoute,
        urlrefTs: time.residenceTime,
        lastTime: lastTime
      })
    }
  }

  _login () {
    this._sendEventRequest({
      key: 'login'
    }, 0)
  }

  _share () {
    this._sendEventRequest({
      key: 'share'
    }, 0)
  }
  _payment (key) {
    this._sendEventRequest({
      key
    }, 0)
  }
  _sendReportRequest (options) {

  }
  // 页面上送
  _sendPageRequest (opt) {
    let {
      url,
      urlrefTs, // 页面停留时间
      lastTime
    } = opt
    let options = {
      channelId: 'app10001',
      pageId: url,
      pageName: this._navigationBarTitle.config,
      pageEntryTime: getFirstTime(),
      pageExitTime: lastTime,
      pageTime: urlrefTs
    }
    Object.assign(options, getSystemInfo())
    this.request(options, 'page')
  }

  _sendHideRequest (opt, type) {
    let {
      url,
      urlrefTs,
      lastTime
    } = opt

    let options = {
      pageId: url,
      pageName: this._navigationBarTitle.config,
      pageEntryTime: getFirstTime(),
      pageExitTime: lastTime,
      pageTime: urlrefTs
    }
    Object.assign(options, getSystemInfo())
    this.request(options, type)
  }
  // 手动上送
  _sendEventRequest ({
    key = '',
    value = ''
  } = {}) {
    // const route = this._lastPageRoute
    let options = value
    Object.assign(options, getSystemInfo())
    this.request(options, key)
  }

  getNetworkInfo () {
    uni.getNetworkType({
      success: (result) => {
        this.statData.net = result.networkType
        this.getLocation()
      }
    })
  }

  getProperty () {
    plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
      this.statData.v = wgtinfo.version || ''
      this.getNetworkInfo()
    })
  }

  getLocation () {
    if (statConfig.getLocation) {
      uni.getLocation({
        type: 'wgs84',
        geocode: true,
        success: (result) => {
          if (result.address) {
            this.statData.cn = result.address.country
            this.statData.pn = result.address.province
            this.statData.ct = result.address.city
          }

          this.statData.lat = result.latitude
          this.statData.lng = result.longitude
          this.request(this.statData)
        }
      })
    } else {
      this.statData.lat = 0
      this.statData.lng = 0
      this.request(this.statData)
    }
  }

  request (data, type) {
    // if (getPageResidenceTime() < OPERATING_TIME && !type) {
    //   return
    // }
    // // 时间超过，重新获取时间戳
    // setPageResidenceTime()
    let optionsData = {
      eventId: type,
      properties: data
    }

    if (data.ut === 'h5' || data.ut === 'fox') {
      // this.imageRequest(optionsData)
      // 网关只支持post
      setTimeout(() => {
        this._sendRequest(optionsData)
      }, 200)
      return
    }
    this._sendRequest(optionsData)
  }
  _sendRequest (optionsData) {
    uni.request({
      url: STAT_URL,
      header: {
        appId: '10000001'
      },
      method: 'POST',
      // header: {
      //   'content-type': 'application/json' // 默认值
      // },
      data: optionsData,
      success: () => {
        // if (process.env.NODE_ENV === 'development') {
        //   console.log('stat request success');
        // }
      },
      fail: (e) => {
        // 重试3次
        if (++this._retry < 3) {
          setTimeout(() => {
            this._sendRequest(optionsData)
          }, 1000)
        }
      }
    })
  }
  /**
   * h5 请求
   */
  imageRequest (data) {
    let image = new Image()
    let options = getSgin(GetEncodeURIComponentOptions(data)).options
    image.src = STAT_H5_URL + '?' + options
  }

  sendEvent (key, value) {
    // 校验 type 参数
    if (calibration(key, value)) return

    if (key === 'title') {
      this._navigationBarTitle.report = value
      return
    }
    this._sendEventRequest({
      key,
      value: typeof (value) === 'object' ? value : value
    }, 1)
  }
}

class Stat extends Util {
  static getInstance () {
    if (!this.instance) {
      this.instance = new Stat()
    }
    return this.instance
  }
  constructor () {
    super()
    this.instance = null
    // 注册拦截器
    if (typeof uni.addInterceptor === 'function') {
      this.addInterceptorInit()
      // this.interceptLogin()
      // this.interceptShare(true)
      this.interceptRequestPayment()
    }
  }

  addInterceptorInit () {
    let self = this
    uni.addInterceptor('setNavigationBarTitle', {
      invoke (args) {
        self._navigationBarTitle.page = args.title
      }
    })
  }

  interceptLogin () {
    let self = this
    uni.addInterceptor('login', {
      complete () {
        self._login()
      }
    })
  }

  interceptShare (type) {
    let self = this
    if (!type) {
      self._share()
      return
    }
    uni.addInterceptor('share', {
      success () {
        self._share()
      },
      fail () {
        self._share()
      }
    })
  }

  interceptRequestPayment () {
    let self = this
    uni.addInterceptor('requestPayment', {
      success () {
        self._payment('pay_success')
      },
      fail () {
        self._payment('pay_fail')
      }
    })
  }

  report (options, self) {
    this.self = self
    // if (process.env.NODE_ENV === 'development') {
    //   console.log('report init');
    // }
    setPageResidenceTime()
    this.__licationShow = true
    this._sendReportRequest(options, true)
  }

  load (options, self) {
    if (!self.$scope && !self.$mp) {
      const page = getCurrentPages()
      self.$scope = page[page.length - 1]
    }
    this.self = self
    this._query = options
  }

  show (self) {
    this.self = self
    if (getPageTypes(self)) {
      this._pageShow(self)
    } else {
      this._applicationShow(self)
    }
  }

  ready (self) {
    // this.self = self;
    // if (getPageTypes(self)) {
    //   this._pageShow(self);
    // }
  }
  hide (self) {
    this.self = self
    if (getPageTypes(self)) {
      this._pageHide(self)
    } else {
      this._applicationHide(self, true)
    }
  }
  error (em) {
    if (this._platform === 'devtools') {
      if (process.env.NODE_ENV === 'development') {
        console.info('当前运行环境为开发者工具，不上报数据。')
      }
      // return;
    }
    let emVal = ''
    if (!em.message) {
      emVal = JSON.stringify(em)
    } else {
      emVal = em.stack
    }
    // 当前不需要从上报
    // let options = {
    //   ak: this.statData.ak,
    //   uuid: this.statData.uuid,
    //   lt: '31',
    //   ut: this.statData.ut,
    //   ch: this.statData.ch,
    //   mpsdk: this.statData.mpsdk,
    //   mpv: this.statData.mpv,
    //   v: this.statData.v,
    //   em: emVal,
    //   usv: this.statData.usv,
    //   t: getTime(),
    //   p: this.statData.p
    // }
    // this.request(options)
  }
}
export default Stat
