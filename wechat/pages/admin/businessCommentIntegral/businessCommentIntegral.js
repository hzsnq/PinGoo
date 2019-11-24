// pages/admin/businessCommentIntegral/businessCommentIntegral.js
const app = getApp();
const API = require('../../../api/api.endpoint.js');
const CONFIG = require('../../../config/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    isShowModal: true,
    evaluateId: '',
    shopInfo: {},
    commentImg: [],
    verifyCode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    console.log(id)
    this.setData({
      evaluateId: options.id
    })
    let params = {};
    params.id = id;
    API.APIOrder.EvaluateQueryId(params).then(d => {
      console.log(d.data)
      this.setData({
        shopInfo: d.data.evaluate,
        commentImg: d.data.list_evaluateImage,
        isShowModal: false
      })
    })
  },
  //在新页面中全屏预览图片
  previewImage(e) {
    let src = e.currentTarget.dataset.src;
    let imgList = e.currentTarget.dataset.list;
    let list = [];
    for (let i = 0; i < imgList.length; i++) {
      list.push(this.data.imgUrl + imgList[i].image)
    }
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: list // 需要预览的图片http链接列表
    })
  },
  //验证码输入
  verifyInput: function (e) {
    let itemData = e.detail.value
    this.setData({
      verifyCode: itemData
    })
  },
  toGive: function () {
    if (this.data.verifyCode != 0 && this.data.verifyCode < 80) {
      let params = {};
      params.muser_id = wx.getStorageSync("muser_key");
      params.id = this.data.evaluateId;
      params.integral = Number(this.data.verifyCode);
      API.APIBusiness.ShopsIntegral(params).then(d => {
        app.showTips(d.data.msg);
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 2500)
      })
    } else {
      app.showTips('请输入0-80的积分')
    }
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