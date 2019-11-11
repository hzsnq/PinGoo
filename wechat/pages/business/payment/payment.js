// pages/business/payment/payment.js
const app = getApp();
const API = require('../../../api/api.endpoint.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowModal: true,
    imgUrl: app.globalData.imgUrl,
    orderInfo: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.isLogin()) {
      console.log('登陆啦')
    } else {
      return
    }
    // console.log(options);
    let params = {};
    params.id = options.id;
    params.people_max = options.people;
    params.type = options.type;
    params.user_id = options.user_id;
    params.muser_id = options.muser_id;
    API.APIBusiness.CouponFightId(params).then(d => {
      console.log(d.data)
      d.data.price = options.price - d.data.shopsRedsm.money - d.data.shopsRedsp.money;
      d.data.originalPrice = options.price;
      d.data.muser_id = options.muser_id;
      d.data.type = options.type;
      d.data.ids = options.id;
      this.setData({
        orderInfo: d.data,
        isShowModal: false
      })
    })
  },
  payment: function () {
    this.setData({
      isShowModal: true
    })
    let params = {};
    params.money = this.data.orderInfo.originalPrice;
    params.actual_money = this.data.orderInfo.price;
    params.muser_id = this.data.orderInfo.muser_id;
    params.user_id = wx.getStorageSync('user_id');
    params.ids = this.data.orderInfo.ids;
    params.type = this.data.orderInfo.type;
    params.count = 1;
    params.redmid = this.data.orderInfo.shopsRedsmid;
    params.redpid = this.data.orderInfo.shopsRedspid;
    // console.log(params)
    API.APIBusiness.FightAdd(params).then(d => {
      // console.log(d.data)
      if (d.data.code == 200) {
        if (this.data.orderInfo.price == 0) {
          app.showTips(d.data.msg);
          wx.redirectTo({
            url: "/pages/index/index?page_cur=order&type=1"
          })
          return
        }
        this.wxPay(params.actual_money, params.user_id, d.data.number);
      } else {
        app.showTips(res.data.msg);
      }
    })
  },
  wxPay: function (money, user_id, number) {
    let that = this;
    // console.log(money, user_id, number)
    let params = {};
    params.money = money;
    params.user_id = user_id;
    params.number = number;
    API.APIBusiness.xiadan(params).then(d => {
      // console.log(d.data)
      wx.requestPayment({
        'timeStamp': d.data.timeStamp,
        'nonceStr': d.data.nonceStr,
        'package': d.data.package,
        'signType': d.data.signType,
        'paySign': d.data.paySign,
        'success': function (res) {
          that.setData({
            isShowModal: false
          })
          console.log(res)
          wx.redirectTo({
            url: "/pages/index/index?page_cur=order&type=1"
          })
        },
        'fail': function (res) {
          that.setData({
            isShowModal: false
          })
          console.log('取消支付');
          app.showTips('取消支付')
        }
      })
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