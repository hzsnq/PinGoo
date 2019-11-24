// pages/admin/businessComment/businessComment.js
const app = getApp();
const API = require('../../../api/api.endpoint.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList: [{ id: 0, name: '未送积分' }, { id: 1, name: '已送积分' }],
    TabCur: 0,
    commentList: [],
    isShowModal: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getContentList();
  },
  //nav切换
  tabSelect: function (e) {
    let state = e.currentTarget.dataset.id;
    this.setData({
      TabCur: state,
      isShowModal: true
    });
    this.getContentList();
  },
  //获取积分列表
  getContentList: function () {
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
      params.state = this.data.TabCur;
      API.APIBusiness.EvaluateList(params).then(d => {
        if (d.data.code == 200) {
          this.setData({
            commentList: d.data.list_evaluate,
            isShowModal: false
          })
        }
      })
    }
  },
  toDetail: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/admin/businessCommentIntegral/businessCommentIntegral?id=" + id
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