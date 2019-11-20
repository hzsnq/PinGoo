// pages/admin/businessCapital/businessCapital.js
const app = getApp();
const API = require('../../../api/api.endpoint.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    businessInfo: {},
    navList: [{ id: 0, name: '全部', state: 1000 }, { id: 1, name: '今日', state: 1 }, { id: 2, name: '本周', state: 7 }, { id: 3, name: '本月', state: 31 }, { id: 4, name: '季度', state: 90 }, { id: 5, name: '年度', state: 365 }],
    TabCur: 0,
    state: 1000,
    isShowModal: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let muser_id = wx.getStorageSync("muser_key");
    if (muser_id === null || muser_id === undefined || muser_id === '') {
      app.showTips('未登录商家后台');
      setTimeout(function () {
        wx.redirectTo({
          url: '/pages/admin/businessLogin/businessLogin'
        })
      }, 1000);
    }
  },
  //nav切换
  tabSelect: function (e) {
    let id = e.currentTarget.dataset.id;
    let state = e.currentTarget.dataset.state;
    this.setData({
      TabCur: id,
      state: state,
      isShowModal: true
    });
    this.getList();
  },
  tapListItem: function (e) {
    let state = e.currentTarget.dataset.state
    wx.navigateTo({
      url: "/pages/admin/verifyHistory/verifyHistory?tian=" + state
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
    this.getList();
  },
  //获取数据
  getList: function () {
    let muser_id = wx.getStorageSync("muser_key");
    if (muser_id === null || muser_id === undefined || muser_id === '') {
      app.showTips('未登录商家后台');
      setTimeout(function () {
        wx.redirectTo({
          url: '/pages/admin/businessLogin/businessLogin'
        })
      }, 1000);
    } else {
      let params = {};
      params.muser_id = muser_id;
      let businessInfo = this.data.businessInfo;
      API.APIBusiness.ShopsMoney(params).then(d => {
        if (d.data.code == 200) {
          businessInfo.money = d.data.money;
          businessInfo.moneys = d.data.moneys;
          businessInfo.moneyser = d.data.moneyser;
          this.setData({
            businessInfo: businessInfo
          })
        }
      })
      params.tian = this.data.state;
      API.APIBusiness.ShopsMoneyS(params).then(d => {
        if (d.data.code == 200) {
          businessInfo.orderMoney = d.data.orders_money;
          businessInfo.orderNumber = d.data.orders_ren;
          this.setData({
            businessInfo: businessInfo,
            isShowModal: false
          })
        }
      })
    }
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