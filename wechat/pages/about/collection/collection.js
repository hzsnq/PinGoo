// pages/about/collection/collection.js
const app = getApp();
const API = require('../../../api/api.endpoint.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contentList: [],
    contentListShow: false,
    imgUrl: app.globalData.imgUrl,
    show: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.isCollection();
  },
  //获取全部收藏
  isCollection: function () {
    let user_id = wx.getStorageSync("user_id");
    let params = {};
    params.user_id = user_id;
    API.APIUser.CollectionQueryAll(params).then(d => {
      console.log(d.data.list_shops)
      if (d.data.code == 200 && d.data.list_shops.length != 0) {
        this.setData({
          contentList: d.data.list_shops,
          contentListShow: true
        })
      } else {
        this.setData({
          contentList: d.data.list_shops,
          contentListShow: false
        })
      }
    })
  },
  toChild(e) {
    let id = e.currentTarget.id;
    wx.navigateTo({
      url: "/pages/business/businessInfo/businessInfo?id=" + id
    })
  },// ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
  delItem: function (e) {
    let id = e.currentTarget.dataset.id;
    let params = {};
    params.id = id;
    API.APIUser.CollectionDel(params).then(d => {
      if (d.data.code == 200) {
        this.isCollection();
        app.showTips(d.data.message)
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