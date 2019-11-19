// pages/about/businessIntegral/businessIntegral.js
const app = getApp();
const API = require('../../../api/api.endpoint.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    businessInfo: [],
    click: 1,
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
    } else {
      let params = {};
      params.muser_id = muser_id;
      API.APIBusiness.MuserLoginInfo(params).then(d => {
        if (d.data.code == 200) {
          this.setData({
            businessInfo: d.data,
            isShowModal: false
          })
        }
      })
    }
  },
  //点击改变选中
  clickChange: function (e) {
    let item = e.currentTarget.dataset.id;
    this.setData({
      click: item
    })
  },
  //兑换积分
  toIntegral: function () {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确认收入余额转积分吗？',
      success(res) {
        if (res.confirm) {
          let flag = that.data.click;
          if (flag == 0) {
            app.showTips('请选择金额');
            return false;
          }
          let money = 10;
          let integral = 1000;
          if (flag == 1) {
            money = 10;
            integral = 1000;
          } else if (flag == 2) {
            money = 20;
            integral = 2000;
          } else if (flag == 3) {
            integral = 5000;
            money = 50;
          } else if (flag == 4) {
            integral = 10000;
            money = 100;
          }
          that.pay(integral, money);
        } else if (res.cancel) {
          return
        }
      },
      fail(res) {
        app.showTips('发生未知错误')
      }
    })
  },
  pay: function (integral, money) {
    this.setData({
      isShowModal: true
    })
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
      params.money = money;
      params.integral = integral;
      API.APIBusiness.ShopsIntegralRecharge(params).then(d => {
        if (d.statusCode == 200) {
          let businessInfo = this.data.businessInfo
          businessInfo.integral = d.data.integral;
          this.setData({
            businessInfo: businessInfo
          })
        }
        this.setData({
          isShowModal: false
        })
        app.showTips(d.data.msg)
      })
    }
  },
  //明细
  toBusinessDetailed: function () {
    let page_title = '积分明细';
    wx.navigateTo({
      url: '/pages/admin/businessDetailed/businessDetailed?type=3&page_title=' + page_title
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