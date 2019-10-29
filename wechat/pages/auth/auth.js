// pages/auth/auth.js
var API = require('../../api/api.endpoint.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    isShow: false
  },

  // 微信登录
  onGotUserInfo: function (e) {
    var that = this;
    if (that.data.isShow) {
      return
    } else {
      if (e.detail.userInfo) {
        that.setData({
          userInfo: e.detail.userInfo,
          isShow: true
        });
        wx.login({
          success: function (res) {
            var params = {};
            params.name = that.data.userInfo.nickName;
            params.image = that.data.userInfo.avatarUrl;
            params.sex = that.data.userInfo.gender;
            params.code = res.code;
            API.APIUser.wxLogin(params).then(d => {
              if (d.data.code == 200) {
                wx.setStorageSync('user_id', d.data.user_id)
                wx.setStorageSync('user_info', e.detail.userInfo)
                that.setData({
                  isShow: false
                });
                wx.navigateBack({
                  delta: 1
                });
              }
            }).catch(e => {
              app.showTips(e);
            })
          },
          fail: function (res) {
            app.showTips('微信登录失败');
          }
        });
      } else {
        app.showTips('微信登录失败');
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})