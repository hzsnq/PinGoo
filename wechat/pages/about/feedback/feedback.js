// pages/about/feedback/feedback.js
const app = getApp();
const API = require('../../../api/api.endpoint.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowModal: false,
    formData: { text: '' },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  formSubmit: function (e) {
    let submitArr = Object.values(e.detail.value);
    if (submitArr.includes("") || submitArr.includes(undefined) || submitArr.includes(null)) {
      app.showTips('您还没有填写意见哦!')
      return
    } else {
      this.setData({
        isShowModal: true
      })
      app.showTips('要提交了哦!')
      let user_id = wx.getStorageSync("user_id");
      let params = {};
      params.user_id = user_id;
      params.texter = this.data.formData.text;
      API.APIUser.OpinionUser(params).then(d => {
        if (d.data.code == 200) {
          let formData = this.data.formData;
          formData.text = '';
          this.setData({
            formData: formData,
            isShowModal: false
          })
          app.showTips(d.data.message)
        } else {
          app.showTips('提交失败')
        }
      })
    }
  },
  //输入框方法
  bindInput: function (e) {
    let itemData = e.detail.value
    let formData = this.data.formData;
    formData.text = itemData;
    this.setData({
      formData: formData
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