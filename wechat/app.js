//app.js
const CONFIG = require('./config/config.js');
App({
  onLaunch: function () {
    this.getSystemInfo();
    this.globalData.token = wx.getStorageSync("user_id")
  },
  onShow: function (options) {
    console.log('App Show');
    if (options.query.user_id) {
      wx.setStorageSync("sharerUid", options.query.user_id);
    }
    // this.globalData.dataStatus = true;
    // this.getPgLocation()
    // if (options.scene == 1007 || options.scene == 1008) { // 通过分享消息进来的            
    //   if (options.query && options.query.uid) {
    //     this.globalData.sharerUid = options.query.uid;
    //   }
    // }
  },
  onHide: function () {
    console.log('App Hide')
  },
  onPageNotFound(res) {
    console.log('小程序要打开的页面不存在');
  },
  showTips: function (a, b) {
    wx.showToast({
      title: a,
      icon: "none"
    })
  },
  showLoading: function () {
    wx.showLoading({
      title: "加载中...",
      mask: true
    })
  },
  hideLoading: function () {
    wx.hideLoading()
  },
  login: function () {
    wx.navigateTo({
      url: "/pages/auth/auth"
    })
  },
  isLogin: function () {
    this.globalData.token = wx.getStorageSync("user_id");
    return !!this.globalData.token
  },
  //获取系统信息
  getSystemInfo: function () {
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })
  },
  //获取位置信息
  getPgLocation: function () {
  },
  globalData: {
    userInfo: null,
    token: null,
    imgUrl: CONFIG.ImgUrl,
    serverImgUrl: CONFIG.ServerImgUrl,
    dataStatus: false,
    cityName: '定位中',
    shopImgList: [],
    packagesList: []
  }
})