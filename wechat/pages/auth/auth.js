// pages/auth/auth.js
const API = require('../../api/api.endpoint.js');
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
    let that = this;
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
            let params = {};
            params.name = that.data.userInfo.nickName;
            params.image = that.data.userInfo.avatarUrl;
            params.sex = that.data.userInfo.gender;
            params.code = res.code;
            API.APIUser.wxLogin(params).then(d => {
              if (d.data.code == 200) {
                wx.setStorageSync('user_id', d.data.user_id)
                wx.setStorageSync('user_info', e.detail.userInfo)
                let sharerUid = wx.getStorageSync('sharerUid');
                let Uid = wx.getStorageSync('user_id');
                if (sharerUid != Uid && sharerUid != undefined && Uid != undefined && sharerUid != null && Uid != null && sharerUid != '' && Uid != '') {
                  let params = {};
                  params.user_ids = sharerUid;
                  params.user_id = Uid;
                  API.APIUser.UserContactAdd(params).then(d => {
                    if (d.statusCode == 200) {
                      console.log(Uid + '被' + sharerUid + '推荐')
                    }
                    if (wx.getStorageSync('user_info')) {
                      that.setData({
                        isShow: false
                      });
                      wx.navigateBack({
                        delta: 1
                      });
                    }
                  })
                } else {
                  if (wx.getStorageSync('user_info')) {
                    that.setData({
                      isShow: false
                    });
                    wx.navigateBack({
                      delta: 1
                    });
                  }
                }
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