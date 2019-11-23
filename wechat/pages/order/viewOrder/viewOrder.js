// pages/order/viewOrder/viewOrder.js
const API = require('../../../api/api.endpoint.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fight: {},
    number: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.id)
    if (options.id != undefined) {
      let params = {};
      params.id = options.id;
      API.APIOrder.FightUserCoupon(params).then(d => {
        // console.log(d.data);
        if (d.statusCode == 200) {
          d.data.fight.numberimg = app.globalData.imgUrl + d.data.fight.numberimg;
          let number = d.data.fight.number.substr(0, 9);
          d.data.fight.number = d.data.fight.number.substr(9, 4);
          this.setData({
            fight: d.data.fight,
            number: number
          })
        }
      })
    }
  },  //复制邀请码
  copyClick: function (e) {
    let text = e.currentTarget.dataset.text;
    wx.setClipboardData({
      data: text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            app.showTips(res)
          }
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