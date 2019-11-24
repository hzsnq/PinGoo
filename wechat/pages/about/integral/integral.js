// pages/about/integral/integral.js
const app = getApp();
const API = require('../../../api/api.endpoint.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    integralCount: 0,
    codeModalShow: false,
    list: [],
    num: '',
    isShowModal: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
  },
  getList: function () {
    let user_id = wx.getStorageSync("user_id");
    let params = {};
    params.user_id = user_id;
    API.APIUser.UserIntegraldList(params).then(d => {
      console.log(d.data)
      if (d.data.status == 200) {
        this.setData({
          integralCount: d.data.integralcount,
          list: d.data.list_integrald,
          isShowModal: false
        })
      }
    })
  },
  toUpdate: function () {
    this.setData({
      codeModalShow: true
    })
  },
  //关闭验证
  hideModal: function () {
    this.setData({
      codeModalShow: false
    })
  },
  //积分num
  integralText: function (e) {
    let itemData = e.detail.value
    this.setData({
      num: itemData
    })
  },
  //
  integralExchange: function () {
    if (this.data.num == 0 || this.data.num == '' || (this.data.num - this.data.integralCount) > 0) {
      app.showTips('请填写正确积分');
      return
    } else {
      this.setData({
        isShowModal: true
      })
      let params = {};
      params.user_id = wx.getStorageSync('user_id');
      params.integral = this.data.num;
      API.APIUser.UserRedExchange(params).then(d => {
        if (res.data.code == "200") {
          let num = this.data.integralCount - this.data.num;
          this.setData({
            integralCount: num,
          })
          this.getList()
          app.showTips('兑换成功')
        }
        this.setData({
          codeModalShow: false,
          num: '',
          isShowModal: false
        })
      })
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