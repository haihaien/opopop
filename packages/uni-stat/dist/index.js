import '../package.json';

var STAT_URL = 'http://192.168.251.163:18080/yump-mgw/log/log-collector/t0001';
var STAT_H5_URL = 'http://192.168.251.163:18080/yump-mgw/log/log-collector/t0001';
var PAGE_PVER_TIME = 100;

var UUID_VALUE = 'aaaa'; // 设备好
var APP_ID = '10000004'; // appid
var APP_VER = '1.0.0.1';// app 版本号
var OST = 'H5'; // 运行环境
var systemInfo = {

};
var getSystemInfo = function () {
  if (!systemInfo.appId || !systemInfo.deviceId) {
    InitSystemInfo();
  }
  return systemInfo
};
var InitSystemInfo = function () {
  try {
    foxsdk.device.getSystemInfo(function (ret) {
      systemInfo.appId = ret.payload.appid;
      systemInfo.ostype = ret.payload.name;
      systemInfo.version = ret.payload.versionCode;
    });
  } catch (error) {
    systemInfo.appId = APP_ID;
    systemInfo.version = APP_VER;
    systemInfo.ostype = OST;
    console.log('非原生平台');
  }
  try {
    foxsdk.device.getUUID(function (ret) {
      systemInfo.deviceId = ret.payload.uuid;
    });
  } catch (error) {
    systemInfo.deviceId = UUID_VALUE;
    console.log('非原生平台');
  }
};

var getSgin = function (statData) {
  var arr = Object.keys(statData);
  var sortArr = arr.sort();
  var sgin = {};
  var sginStr = '';
  for (var i in sortArr) {
    sgin[sortArr[i]] = statData[sortArr[i]];
    sginStr += sortArr[i] + '=' + statData[sortArr[i]] + '&';
  }
  // const options = sginStr.substr(0, sginStr.length - 1)
  // sginStr = sginStr.substr(0, sginStr.length - 1) + '&key=' + STAT_KEY;
  // const si = crypto.createHash('md5').update(sginStr).digest('hex');
  return {
    sign: '',
    options: sginStr.substr(0, sginStr.length - 1)
  }
};

var getTime = function () {
  return parseInt(new Date().getTime() / 1000)
};

var getPlatformName = function () {
  var platformList = {
    'app-plus': 'n',
    'h5': 'h5',
    'app-fox': 'fox',
    'mp-weixin': 'wx',
    'mp-alipay': 'ali',
    'mp-baidu': 'bd',
    'mp-toutiao': 'tt',
    'mp-qq': 'qq'
  };
  return platformList[process.env.VUE_APP_PLATFORM]
};

var PAGE_RESIDENCE_TIME = '__page__residence__time';
var First_Page_residence_time = 0;

var setPageResidenceTime = function () {
  First_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    uni.setStorageSync(PAGE_RESIDENCE_TIME, getTime());
  }
  return First_Page_residence_time
};

var GetEncodeURIComponentOptions = function (statData) {
  var data = {};
  for (var prop in statData) {
    data[prop] = encodeURIComponent(statData[prop]);
  }
  return data
};

var Set__First__Time = 0;
var Set__Last__Time = 0;

var getFirstTime = function () {
  var time = new Date().getTime();
  Set__First__Time = time;
  Set__Last__Time = 0;
  return time
};

var getLastTime = function () {
  var time = new Date().getTime();
  Set__Last__Time = time;
  return time
};
// 停留时间 单位ms
var getResidenceTime = function (type) {
  var residenceTime = 0;
  if (Set__First__Time !== 0) {
    residenceTime = Set__Last__Time - Set__First__Time;
  }

  residenceTime = residenceTime < 1 ? 1 : residenceTime;
  // 此处不需要
  // if (type === 'app') {
  //   let overtime = residenceTime > APP_PVER_TIME
  //   return {
  //     residenceTime,
  //     overtime
  //   }
  // }
  if (type === 'page') {
    var overtime = residenceTime > PAGE_PVER_TIME;
    return {
      residenceTime: residenceTime,
      overtime: overtime
    }
  }

  return {
    residenceTime: residenceTime
  }
};

var getRoute = function () {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;

  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is
  } else {
    return (_self.$scope && _self.$scope.route) || (_self.$mp && _self.$mp.page.route)
  }
};

var getPageRoute = function (self) {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;
  var query = self._query;
  var str = query && JSON.stringify(query) !== '{}' ? '?' + JSON.stringify(query) : '';
  // clear
  self._query = '';
  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is + str
  } else {
    return (_self.$scope && _self.$scope.route + str) || (_self.$mp && _self.$mp.page.route + str)
  }
};

var getPageTypes = function (self) {
  if (self.mpType === 'page' || (self.$mp && self.$mp.mpType === 'page') || self.$options.mpType === 'page') {
    return true
  }
  return false
};

var calibration = function (eventName, options) {
  //  login 、 share 、pay_success 、pay_fail 、register 、title
  if (!eventName) {
    console.error("uni.report 缺少 [eventName] 参数");
    return true
  }
  if (typeof eventName !== 'string') {
    console.error("uni.report [eventName] 参数类型错误,只能为 String 类型");
    return true
  }
  if (eventName.length > 255) {
    console.error("uni.report [eventName] 参数长度不能大于 255");
    return true
  }

  if (typeof options !== 'string' && typeof options !== 'object') {
    console.error("uni.report [options] 参数类型错误,只能为 String 或 Object 类型");
    return true
  }

  if (typeof options === 'string' && options.length > 255) {
    console.error("uni.report [options] 参数长度不能大于 255");
    return true
  }

  if (eventName === 'title' && typeof options !== 'string') {
    console.error('uni.report [eventName] 参数为 title 时，[options] 参数只能为 String 类型');
    return true
  }
};

var PagesJson = require('uni-pages?{"type":"style"}').default;
var statConfig = require('uni-stat-config').default || require('uni-stat-config');
InitSystemInfo();
var Util = function Util () {
  this.self = '';
  this._retry = 0;
  this._platform = '';
  this._query = {};
  this._navigationBarTitle = {
    config: '',
    page: '',
    report: '',
    lt: ''
  };
  this.__prevent_triggering = false;

  this.__licationHide = false;
  this.__licationShow = false;
  this._lastPageRoute = '';
  this.statData = getSystemInfo();
};
Util.prototype._applicationShow = function _applicationShow () {
  // if (this.__licationHide) {
  // getLastTime()
  // const time = getResidenceTime('app')
  // if (time.overtime) {
  //   let options = {
  //     path: this._lastPageRoute,
  //     scene: this.statData.sc
  //   }
  //   this._sendReportRequest(options)
  // }
  // this.__licationHide = false
  // }
};

Util.prototype._applicationHide = function _applicationHide (self, type) {
  // this.__licationHide = true
  // getLastTime()
  // const time = getResidenceTime()
  // getFirstTime()
  // const route = getPageRoute(this)
  // this._sendHideRequest({
  // urlref: route,
  // urlrefTs: time.residenceTime
  // }, type)
};

Util.prototype._pageShow = function _pageShow () {
  var route = getPageRoute(this);
  var routepath = getRoute();
  this._navigationBarTitle.config = PagesJson &&
    PagesJson.pages[routepath] &&
    PagesJson.pages[routepath].titleNView &&
    PagesJson.pages[routepath].titleNView.titleText ||
    PagesJson &&
    PagesJson.pages[routepath] &&
    PagesJson.pages[routepath].navigationBarTitleText || '';
  if (this.__licationShow) {
    getFirstTime();
    this.__licationShow = false;
    // console.log('这是 onLauch 之后执行的第一次 pageShow ，为下次记录时间做准备');
    this._lastPageRoute = route;
    return
  }

  getLastTime();
  this._lastPageRoute = route;
  var time = getResidenceTime('page');
  if (time.overtime) {
    var options = {
      path: this._lastPageRoute,
      scene: this.statData.sc
    };
    this._sendReportRequest(options);
  }
};

Util.prototype._pageHide = function _pageHide () {
  if (!this.__licationHide) {
    var lastTime = getLastTime();
    var time = getResidenceTime('page');
    this._sendPageRequest({
      url: this._lastPageRoute,
      urlref: this._lastPageRoute,
      urlrefTs: time.residenceTime,
      lastTime: lastTime
    });
  }
};

Util.prototype._login = function _login () {
  this._sendEventRequest({
    key: 'login'
  }, 0);
};

Util.prototype._share = function _share () {
  this._sendEventRequest({
    key: 'share'
  }, 0);
};
Util.prototype._payment = function _payment (key) {
  this._sendEventRequest({
    key: key
  }, 0);
};
Util.prototype._sendReportRequest = function _sendReportRequest (options) {

};
// 页面上送
Util.prototype._sendPageRequest = function _sendPageRequest (opt) {
  var url = opt.url;
    var urlrefTs = opt.urlrefTs;
    var lastTime = opt.lastTime;
  var options = {
    channelId: 'app10001',
    pageId: url,
    pageName: this._navigationBarTitle.config,
    pageEntryTime: getFirstTime(),
    pageExitTime: lastTime,
    pageTime: urlrefTs
  };
  Object.assign(options, getSystemInfo());
  this.request(options, 'page');
};

Util.prototype._sendHideRequest = function _sendHideRequest (opt, type) {
  var url = opt.url;
    var urlrefTs = opt.urlrefTs;
    var lastTime = opt.lastTime;

  var options = {
    pageId: url,
    pageName: this._navigationBarTitle.config,
    pageEntryTime: getFirstTime(),
    pageExitTime: lastTime,
    pageTime: urlrefTs
  };
  Object.assign(options, getSystemInfo());
  this.request(options, type);
};
// 手动上送
Util.prototype._sendEventRequest = function _sendEventRequest (ref) {
    if ( ref === void 0 ) ref = {};
    var key = ref.key; if ( key === void 0 ) key = '';
    var value = ref.value; if ( value === void 0 ) value = '';

  // const route = this._lastPageRoute
  var options = value;
  Object.assign(options, getSystemInfo());
  this.request(options, key);
};

Util.prototype.getNetworkInfo = function getNetworkInfo () {
    var this$1 = this;

  uni.getNetworkType({
    success: function (result) {
      this$1.statData.net = result.networkType;
      this$1.getLocation();
    }
  });
};

Util.prototype.getProperty = function getProperty () {
    var this$1 = this;

  plus.runtime.getProperty(plus.runtime.appid, function (wgtinfo) {
    this$1.statData.v = wgtinfo.version || '';
    this$1.getNetworkInfo();
  });
};

Util.prototype.getLocation = function getLocation () {
    var this$1 = this;

  if (statConfig.getLocation) {
    uni.getLocation({
      type: 'wgs84',
      geocode: true,
      success: function (result) {
        if (result.address) {
          this$1.statData.cn = result.address.country;
          this$1.statData.pn = result.address.province;
          this$1.statData.ct = result.address.city;
        }

        this$1.statData.lat = result.latitude;
        this$1.statData.lng = result.longitude;
        this$1.request(this$1.statData);
      }
    });
  } else {
    this.statData.lat = 0;
    this.statData.lng = 0;
    this.request(this.statData);
  }
};

Util.prototype.request = function request (data, type) {
    var this$1 = this;

  // if (getPageResidenceTime() < OPERATING_TIME && !type) {
  // return
  // }
  // // 时间超过，重新获取时间戳
  // setPageResidenceTime()
  var optionsData = {
    eventId: type,
    properties: data
  };

  if (data.ut === 'h5' || data.ut === 'fox') {
    // this.imageRequest(optionsData)
    // 网关只支持post
    setTimeout(function () {
      this$1._sendRequest(optionsData);
    }, 200);
    return
  }
  this._sendRequest(optionsData);
};
Util.prototype._sendRequest = function _sendRequest (optionsData) {
    var this$1 = this;

  foxsdk.logger.info('请求数据：' + JSON.stringify(optionsData));
  uni.request({
    url: STAT_URL,
    header: {
      appId: '10000001'
    },
    method: 'POST',
    // header: {
    // 'content-type': 'application/json' // 默认值
    // },
    data: optionsData,
    success: function () {
      // if (process.env.NODE_ENV === 'development') {
      // console.log('stat request success');
      // }
    },
    fail: function (e) {
      // 重试3次
      if (++this$1._retry < 3) {
        setTimeout(function () {
          this$1._sendRequest(optionsData);
        }, 1000);
      }
    }
  });
};
/**
 * h5 请求
 */
Util.prototype.imageRequest = function imageRequest (data) {
  var image = new Image();
  var options = getSgin(GetEncodeURIComponentOptions(data)).options;
  image.src = STAT_H5_URL + '?' + options;
};

Util.prototype.sendEvent = function sendEvent (key, value) {
  // 校验 type 参数
  if (calibration(key, value)) { return }

  if (key === 'title') {
    this._navigationBarTitle.report = value;
    return
  }
  this._sendEventRequest({
    key: key,
    value: typeof (value) === 'object' ? value : value
  }, 1);
};

var Stat = /*@__PURE__*/(function (Util) {
  function Stat () {
    Util.call(this);
    this.instance = null;
    // 注册拦截器
    if (typeof uni.addInterceptor === 'function') {
      this.addInterceptorInit();
      // this.interceptLogin()
      // this.interceptShare(true)
      this.interceptRequestPayment();
    }
  }

  if ( Util ) Stat.__proto__ = Util;
  Stat.prototype = Object.create( Util && Util.prototype );
  Stat.prototype.constructor = Stat;

  Stat.getInstance = function getInstance () {
    if (!this.instance) {
      this.instance = new Stat();
    }
    return this.instance
  };

  Stat.prototype.addInterceptorInit = function addInterceptorInit () {
    var self = this;
    uni.addInterceptor('setNavigationBarTitle', {
      invoke: function invoke (args) {
        self._navigationBarTitle.page = args.title;
      }
    });
  };

  Stat.prototype.interceptLogin = function interceptLogin () {
    var self = this;
    uni.addInterceptor('login', {
      complete: function complete () {
        self._login();
      }
    });
  };

  Stat.prototype.interceptShare = function interceptShare (type) {
    var self = this;
    if (!type) {
      self._share();
      return
    }
    uni.addInterceptor('share', {
      success: function success () {
        self._share();
      },
      fail: function fail () {
        self._share();
      }
    });
  };

  Stat.prototype.interceptRequestPayment = function interceptRequestPayment () {
    var self = this;
    uni.addInterceptor('requestPayment', {
      success: function success () {
        self._payment('pay_success');
      },
      fail: function fail () {
        self._payment('pay_fail');
      }
    });
  };

  Stat.prototype.report = function report (options, self) {
    this.self = self;
    // if (process.env.NODE_ENV === 'development') {
    //   console.log('report init');
    // }
    setPageResidenceTime();
    this.__licationShow = true;
    this._sendReportRequest(options, true);
  };

  Stat.prototype.load = function load (options, self) {
    if (!self.$scope && !self.$mp) {
      var page = getCurrentPages();
      self.$scope = page[page.length - 1];
    }
    this.self = self;
    this._query = options;
  };

  Stat.prototype.show = function show (self) {
    this.self = self;
    if (getPageTypes(self)) {
      this._pageShow(self);
    } else {
      this._applicationShow(self);
    }
  };

  Stat.prototype.ready = function ready (self) {
    // this.self = self;
    // if (getPageTypes(self)) {
    //   this._pageShow(self);
    // }
  };
  Stat.prototype.hide = function hide (self) {
    this.self = self;
    if (getPageTypes(self)) {
      this._pageHide(self);
    } else {
      this._applicationHide(self, true);
    }
  };
  Stat.prototype.error = function error (em) {
    if (this._platform === 'devtools') {
      if (process.env.NODE_ENV === 'development') {
        console.info('当前运行环境为开发者工具，不上报数据。');
      }
      // return;
    }
    var emVal = '';
    if (!em.message) {
      emVal = JSON.stringify(em);
    } else {
      emVal = em.stack;
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
  };

  return Stat;
}(Util));

var stat = Stat.getInstance();
var isHide = false;
var lifecycle = {
  onLaunch: function onLaunch (options) {
    stat.report(options, this);
  },
  onReady: function onReady () {
    stat.ready(this);
  },
  onLoad: function onLoad (options) {
    stat.load(options, this);
    // 重写分享，获取分享上报事件
    if (this.$scope && this.$scope.onShareAppMessage) {
      var oldShareAppMessage = this.$scope.onShareAppMessage;
      this.$scope.onShareAppMessage = function (options) {
        stat.interceptShare(false);
        return oldShareAppMessage.call(this, options)
      };
    }
  },
  onShow: function onShow () {
    isHide = false;
    stat.show(this);
  },
  onHide: function onHide () {
    isHide = true;
    stat.hide(this);
  },
  onUnload: function onUnload () {
    if (isHide) {
      isHide = false;
      return
    }
    stat.hide(this);
  },
  onError: function onError (e) {
    stat.error(e);
  }
};

function main () {
  if (process.env.NODE_ENV === 'development') {
    // uni.report = function(type, options) {};
    var Vue = require('vue');
    (Vue.default || Vue).mixin(lifecycle);
    uni.report = function (type, options) {
      stat.sendEvent(type, options);
    };
  } else {
    var Vue$1 = require('vue');
    (Vue$1.default || Vue$1).mixin(lifecycle);
    uni.report = function (type, options) {
      stat.sendEvent(type, options);
    };
  }
}

main();
