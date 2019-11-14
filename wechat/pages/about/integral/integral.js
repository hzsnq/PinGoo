// pages/about/integral/integral.js
const app = getApp();
const API = require('../../../api/api.endpoint.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    integralCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let user_id = wx.getStorageSync("user_id");
    let params = {};
    params.user_id = user_id;
    API.APIUser.UserIntegraldList(params).then(d => {
      console.log(d.data)
      if (d.data.status == 200) {
        this.setData({
          integralCount: d.data.integralcount
        })
      }
    })
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