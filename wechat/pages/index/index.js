//index.js
var API = require('../../api/api.endpoint.js');
const app = getApp();

Page({
  data: {
    PageCur: 'business'
  },
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
  onShareAppMessage() {
    return {
      title: 'ColorUI-高颜值的小程序UI组件库',
      imageUrl: '/images/share.jpg',
      path: '/pages/index/index'
    }
  },
  onLoad: function (options) {
    if (app.isLogin()) {
      console.log('登陆啦')
    } else {
      app.login()
    }
  },
})
