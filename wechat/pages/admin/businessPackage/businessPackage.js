// pages/admin/businessPackage/businessPackage.js
const app = getApp();
const API = require('../../../api/api.endpoint.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    packageList: [],
    isShowModal: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //获取全部套餐
  getBusinessPackage: function () {
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
      API.APIBusiness.PackagesQueryAll(params).then(d => {
        if (d.statusCode == 200) {
          this.setData({
            packageList: d.data,
            isShowModal: false
          })
        }
      })
    }
  },
  toChild(e) {
    console.log(e)
    if (app.isLogin()) {
      console.log('登陆啦')
    } else {
      app.login()
      return
    }
    let id = e.currentTarget.dataset.id;
    let muser_id = wx.getStorageSync("muser_key");
    let page = e.currentTarget.dataset.page;
    wx.navigateTo({
      url: "/pages/business/couponAndPackage/couponAndPackage?id=" + id + "&muser_id=" + muser_id + "&page=" + page
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
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success(res) {
        if (res.confirm) {
          that.toDelete(e.currentTarget.dataset.id);
        } else if (res.cancel) {
          return
        }
      },
      fail(res) {
        app.showTips('发生未知错误')
      }
    })
  },
  changeState: function (e) {
    this.setData({
      isShowModal: true
    })
    let state = e.currentTarget.dataset.state;
    let id = e.currentTarget.dataset.id;
    let params = {};
    params.id = id;
    params.state = (state == 1 ? 2 : 1);
    API.APIBusiness.PackageShelves(params).then(d => {
      app.showTips(d.data.message)
      this.getBusinessPackage();
    })
  },
  toDelete: function (id) {
    this.setData({
      isShowModal: true
    })
    let params = {};
    params.id = id;
    API.APIBusiness.PackagesDelId(params).then(d => {
      if (d.statusCode == 200) {
        this.setData({
          isShowModal: false
        })
      }
      this.getBusinessPackage();
      app.showTips(d.data.msg);
    })
  },
  toEdit: function (e) {
    let id = e.currentTarget.dataset.id ? e.currentTarget.dataset.id : '';
    wx.navigateTo({
      url: "/pages/admin/businessPackageEdit/businessPackageEdit?id=" + id
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
    this.getBusinessPackage();
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