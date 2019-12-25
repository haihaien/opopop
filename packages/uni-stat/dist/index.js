import { version } from '../package.json';

var STAT_VERSION = version;
var STAT_URL = 'https://tongji.dcloud.io/uni/stat';
var STAT_H5_URL = 'https://tongji.dcloud.io/uni/stat.gif'; 
var PAGE_PVER_TIME = 1800;
var APP_PVER_TIME = 300;
var OPERATING_TIME = 10;

var UUID_KEY = '__DC_STAT_UUID';
var UUID_VALUE = '__DC_UUID_VALUE';

function getUuid() {
  var uuid = '';
  if (getPlatformName() === 'n') {
    try {
      uuid = plus.runtime.getDCloudId();
    } catch (e) {
      uuid = '';
    }
    return uuid
  }

  try {
    uuid = uni.getStorageSync(UUID_KEY);
  } catch (e) {
    uuid = UUID_VALUE;
  }

  if (!uuid) {
    uuid = Date.now() + '' + Math.floor(Math.random() * 1e7);
    try {
      uni.setStorageSync(UUID_KEY, uuid);
    } catch (e) {
      uni.setStorageSync(UUID_KEY, UUID_VALUE);
    }
  }
  return uuid;
}

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
  };
};

var getSplicing = function (data) {
  var str = '';
  for (var i in data) {
    str += i + '=' + data[i] + '&';
  }
  return str.substr(0, str.length - 1)
};

var getTime = function () {
  return parseInt(new Date().getTime() / 1000);
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
  return platformList[process.env.VUE_APP_PLATFORM];
};

var getPackName = function () {
  var packName = '';
  if (getPlatformName() === 'wx' || getPlatformName() === 'qq') {
    packName = uni.getAccountInfoSync().miniProgram.appId || '';
  }
  return packName
};

var getVersion = function () {
  return getPlatformName() === 'n' ? plus.runtime.version : '';
};

var getChannel = function () {
  var platformName = getPlatformName();
  var channel = '';
  if (platformName === 'n') {
    channel = plus.runtime.channel;
  }
  return channel;
};

var getScene = function (options) {
  var platformName = getPlatformName();
  var scene = '';
  if (options) {
    return options;
  }
  if (platformName === 'wx') {
    scene = uni.getLaunchOptionsSync().scene;
  }
  return scene;
};
var First__Visit__Time__KEY = 'First__Visit__Time';
var Last__Visit__Time__KEY = 'Last__Visit__Time';

var getFirstVisitTime = function () {
  var timeStorge = uni.getStorageSync(First__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = getTime();
    uni.setStorageSync(First__Visit__Time__KEY, time);
    uni.removeStorageSync(Last__Visit__Time__KEY);
  }
  return time;
};

var getLastVisitTime = function () {
  var timeStorge = uni.getStorageSync(Last__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = '';
  }
  uni.setStorageSync(Last__Visit__Time__KEY, getTime());
  return time;
};


var PAGE_RESIDENCE_TIME = '__page__residence__time';
var First_Page_residence_time = 0;
var Last_Page_residence_time = 0;


var setPageResidenceTime = function () {
  First_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    uni.setStorageSync(PAGE_RESIDENCE_TIME, getTime());
  }
  return First_Page_residence_time
};

var getPageResidenceTime = function () {
  Last_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    First_Page_residence_time = uni.getStorageSync(PAGE_RESIDENCE_TIME);
  }
  return Last_Page_residence_time - First_Page_residence_time
};
var TOTAL__VISIT__COUNT = 'Total__Visit__Count';
var getTotalVisitCount = function () {
  var timeStorge = uni.getStorageSync(TOTAL__VISIT__COUNT);
  var count = 1;
  if (timeStorge) {
    count = timeStorge;
    count++;
  }
  uni.setStorageSync(TOTAL__VISIT__COUNT, count);
  return count;
};

var GetEncodeURIComponentOptions = function (statData) {
  var data = {};
  for (var prop in statData) {
    data[prop] = encodeURIComponent(statData[prop]);
  }
  return data;
};

var Set__First__Time = 0;
var Set__Last__Time = 0;

var getFirstTime = function () {
  var time = new Date().getTime();
  Set__First__Time = time;
  Set__Last__Time = 0;
  return time;
};


var getLastTime = function () {
  var time = new Date().getTime();
  Set__Last__Time = time;
  return time;
};


var getResidenceTime = function (type) {
  var residenceTime = 0;
  if (Set__First__Time !== 0) {
    residenceTime = Set__Last__Time - Set__First__Time;
  }

  residenceTime = parseInt(residenceTime / 1000);
  residenceTime = residenceTime < 1 ? 1 : residenceTime;
  if (type === 'app') {
    var overtime = residenceTime > APP_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: overtime
    };
  }
  if (type === 'page') {
    var overtime$1 = residenceTime > PAGE_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: overtime$1
    };
  }

  return {
    residenceTime: residenceTime
  };

};

var getRoute = function () {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;

  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is;
  } else {
    return (_self.$scope && _self.$scope.route) || (_self.$mp && _self.$mp.page.route);
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
    return _self.$mp && _self.$mp.page.is + str;
  } else {
    return (_self.$scope && _self.$scope.route + str )|| (_self.$mp && _self.$mp.page.route + str);
  }
};

var getPageTypes = function (self) {
  if (self.mpType === 'page' || (self.$mp && self.$mp.mpType === 'page') || self.$options.mpType === 'page') {
    return true;
  }
  return false;
};

var calibration = function (eventName, options) {
  //  login 、 share 、pay_success 、pay_fail 、register 、title
  if(!eventName){
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

var resultOptions = uni.getSystemInfoSync();

var Util = function Util() {
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
  this._operatingTime = 0;
  this._reportingRequestData = {
    '1': [],
    '11': []
  };
  this.__prevent_triggering = false;

  this.__licationHide = false;
  this.__licationShow = false;
  this._lastPageRoute = '';
  this.statData = {
    uuid: getUuid(),//设备UUID
    ut: getPlatformName(),
    mpn: getPackName(),
    ak: statConfig.appid,//uni-stat的APPID
    usv: STAT_VERSION,//uni-stat版本
    v: getVersion(),//plus.runtime.version
    ch: getChannel(),//渠道
    cn: '',//国家
    pn: '',//省份
    ct: '',//城市
    t: getTime(),//当前时间
    tt: '',
    p: resultOptions.platform === 'android' ? 'a' : 'i',//平台类型
    brand: resultOptions.brand || '',//品牌
    md: resultOptions.model,//类型
    sv: resultOptions.system.replace(/(Android|iOS)\s/, ''),
    mpsdk: resultOptions.SDKVersion || '',
    mpv: resultOptions.version || '',
    lang: resultOptions.language,
    pr: resultOptions.pixelRatio,
    ww: resultOptions.windowWidth,
    wh: resultOptions.windowHeight,
    sw: resultOptions.screenWidth,
    sh: resultOptions.screenHeight
  };

};

Util.prototype._applicationShow = function _applicationShow () {
  if (this.__licationHide) {
    getLastTime();
    var time = getResidenceTime('app');
    if (time.overtime) {
      var options = {
        path: this._lastPageRoute,
        scene: this.statData.sc
      };
      this._sendReportRequest(options);
    }
    this.__licationHide = false;
  }
};

Util.prototype._applicationHide = function _applicationHide (self, type) {

  this.__licationHide = true;
  getLastTime();
  var time = getResidenceTime();
  getFirstTime();
  var route = getPageRoute(this);
  this._sendHideRequest({
    urlref: route,
    urlref_ts: time.residenceTime
  }, type);
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
    return;
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
  getFirstTime();
};

Util.prototype._pageHide = function _pageHide () {
  if (!this.__licationHide) {
    getLastTime();
    var time = getResidenceTime('page');
    this._sendPageRequest({
      url: this._lastPageRoute,
      urlref: this._lastPageRoute,
      urlref_ts: time.residenceTime
    });
    this._navigationBarTitle = {
      config: '',
      page: '',
      report: '',
      lt: ''
    };
    return;
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

  this._navigationBarTitle.lt = '1';
  var query = options.query && JSON.stringify(options.query) !== '{}' ? '?' + JSON.stringify(options.query) : '';
  this.statData.lt = '1';
  this.statData.url = (options.path + query) || '';
  this.statData.t = getTime();
  this.statData.sc = getScene(options.scene);
  this.statData.fvts = getFirstVisitTime();
  this.statData.lvts = getLastVisitTime();
  this.statData.tvc = getTotalVisitCount();
  if (getPlatformName() === 'n') {
    this.getProperty();
  } else {
    this.getNetworkInfo();
  }
};

Util.prototype._sendPageRequest = function _sendPageRequest (opt) {
  var url = opt.url;
    var urlref = opt.urlref;
    var urlref_ts = opt.urlref_ts;
  this._navigationBarTitle.lt = '11';
  var options = {
    ak: this.statData.ak,
    uuid: this.statData.uuid,
    lt: '11',
    ut: this.statData.ut,
    url: url,
    tt: this.statData.tt,
    urlref: urlref,
    urlref_ts: urlref_ts,
    ch: this.statData.ch,
    usv: this.statData.usv,
    t: getTime(),
    p: this.statData.p
  };
  this.request(options);
};

Util.prototype._sendHideRequest = function _sendHideRequest (opt, type) {
  var urlref = opt.urlref;
    var urlref_ts = opt.urlref_ts;
  var options = {
    ak: this.statData.ak,
    uuid: this.statData.uuid,
    lt: '3',
    ut: this.statData.ut,
    urlref: urlref,
    urlref_ts: urlref_ts,
    ch: this.statData.ch,
    usv: this.statData.usv,
    t: getTime(),
    p: this.statData.p
  };
  this.request(options, type);
};
Util.prototype._sendEventRequest = function _sendEventRequest (ref) {
    if ( ref === void 0 ) ref = {};
    var key = ref.key; if ( key === void 0 ) key = '';
    var value = ref.value; if ( value === void 0 ) value = "";

  var route = this._lastPageRoute;
  var options = {
    ak: this.statData.ak,
    uuid: this.statData.uuid,
    lt: '21',
    ut: this.statData.ut,
    url: route,
    ch: this.statData.ch,
    e_n: key,
    e_v: typeof(value) === 'object' ? JSON.stringify(value) : value.toString(),
    usv: this.statData.usv,
    t: getTime(),
    p: this.statData.p
  };
  this.request(options);
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

  var time = getTime();
  var title = this._navigationBarTitle;
  data.ttn = title.page;
  data.ttpj = title.config;
  data.ttc = title.report;

  var requestData = this._reportingRequestData;
  if (getPlatformName() === 'n') {
    requestData = uni.getStorageSync('__UNI__STAT__DATA') || {};
  }
  if (!requestData[data.lt]) {
    requestData[data.lt] = [];
  }
  requestData[data.lt].push(data);

  if (getPlatformName() === 'n') {
    uni.setStorageSync('__UNI__STAT__DATA', requestData);
  }
  if (getPageResidenceTime() < OPERATING_TIME && !type) {
    return
  }
  var uniStatData = this._reportingRequestData;
  if (getPlatformName() === 'n') {
    uniStatData = uni.getStorageSync('__UNI__STAT__DATA');
  }
  // 时间超过，重新获取时间戳
  setPageResidenceTime();
  var firstArr = [];
  var contentArr = [];
  var lastArr = [];

  var loop = function ( i ) {
    var rd = uniStatData[i];
    rd.forEach(function (elm) {
      var newData = getSplicing(elm);
      if (i === 0) {
        firstArr.push(newData);
      } else if (i === 3) {
        lastArr.push(newData);
      } else {
        contentArr.push(newData);
      }
    });
  };

    for (var i in uniStatData) loop( i );

  firstArr.push.apply(firstArr, contentArr.concat( lastArr ));
  var optionsData = {
    usv: STAT_VERSION, //统计 SDK 版本号
    t: time, //发送请求时的时间戮
    requests: JSON.stringify(firstArr),
  };

  this._reportingRequestData = {};
  if (getPlatformName() === 'n') {
    uni.removeStorageSync('__UNI__STAT__DATA');
  }

  if (data.ut === 'h5' || data.ut === 'fox') {
    this.imageRequest(optionsData);
    return
  }

  if (getPlatformName() === 'n' && this.statData.p === 'a') {
    setTimeout(function () {
      this$1._sendRequest(optionsData);
    }, 200);
    return
  }
  this._sendRequest(optionsData);
};
Util.prototype._sendRequest = function _sendRequest (optionsData) {
    var this$1 = this;

  uni.request({
    url: STAT_URL,
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
    value: typeof(value) === 'object' ? JSON.stringify(value) : value
  }, 1);
};


var Stat = /*@__PURE__*/(function (Util) {
  function Stat() {
    Util.call(this);
    this.instance = null;
    // 注册拦截器
    if (typeof uni.addInterceptor === 'function') {
      this.addInterceptorInit();
      this.interceptLogin();
      this.interceptShare(true);
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
    return this.instance;
  };

  Stat.prototype.addInterceptorInit = function addInterceptorInit () {
    var self = this;
    uni.addInterceptor('setNavigationBarTitle', {
      invoke: function invoke(args) {
        self._navigationBarTitle.page = args.title;
      }
    });
  };

  Stat.prototype.interceptLogin = function interceptLogin () {
    var self = this;
    uni.addInterceptor('login', {
      complete: function complete() {
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
      success: function success() {
        self._share();
      },
      fail: function fail() {
        self._share();
      }
    });
  };

  Stat.prototype.interceptRequestPayment = function interceptRequestPayment () {
    var self = this;
    uni.addInterceptor('requestPayment', {
      success: function success() {
        self._payment('pay_success');
      },
      fail: function fail() {
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
    var options = {
      ak: this.statData.ak,
      uuid: this.statData.uuid,
      lt: '31',
      ut: this.statData.ut,
      ch: this.statData.ch,
      mpsdk: this.statData.mpsdk,
      mpv: this.statData.mpv,
      v: this.statData.v,
      em: emVal,
      usv: this.statData.usv,
      t: getTime(),
      p: this.statData.p
    };
    this.request(options);
  };

  return Stat;
}(Util));

var stat = Stat.getInstance();
var isHide = false;
var lifecycle = {
  onLaunch: function onLaunch(options) {
    stat.report(options, this);
  },
  onReady: function onReady() {
    stat.ready(this);
  },
  onLoad: function onLoad(options) {
    stat.load(options, this);
    // 重写分享，获取分享上报事件
    if (this.$scope && this.$scope.onShareAppMessage) {
      var oldShareAppMessage = this.$scope.onShareAppMessage;
      this.$scope.onShareAppMessage = function(options) {
        stat.interceptShare(false);
        return oldShareAppMessage.call(this, options)
      };
    }
  },
  onShow: function onShow() {
    isHide = false;
    stat.show(this);
  },
  onHide: function onHide() {
    isHide = true;
    stat.hide(this);
  },
  onUnload: function onUnload() {
    if (isHide) {
      isHide = false;
      return
    }
    stat.hide(this);
  },
  onError: function onError(e) {
    stat.error(e);
  }
};

function main() {
  if (process.env.NODE_ENV === 'development') {
    uni.report = function(type, options) {};
  }else{
    var Vue = require('vue');
    (Vue.default || Vue).mixin(lifecycle);
    uni.report = function(type, options) {
      stat.sendEvent(type, options);
    };
  }
}

main();
