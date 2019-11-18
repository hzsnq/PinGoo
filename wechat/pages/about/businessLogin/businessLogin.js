// pages/about/businessLogin/businessLogin.js
const app = getApp();
const API = require('../../../api/api.endpoint.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowModal: false,
    //表单数据
    formData: { businessUserTel: '', businessUserPwd: '' },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //输入框方法
  bindInput: function (e) {
    let itemName = e.currentTarget.dataset.name;
    let itemData = e.detail.value
    let formData = this.data.formData;
    if (itemName == 'businessUserTel') {
      formData.businessUserTel = itemData;
    } else if (itemName == 'businessUserPwd') {
      formData.businessUserPwd = itemData;
    }
    this.setData({
      formData: formData
    })
  },
  //表单提交 暂时不验证登录账号是否为手机号
  //!util.tel(this.data.formData.businessUserTel)
  formSubmit: function (e) {
    let submitArr = Object.values(e.detail.value);
    if (submitArr.includes("") || submitArr.includes(undefined) || submitArr.includes(null)) {
      app.showTips('请填写账号和密码!')
      return
    } else {
      this.setData({
        isShowModal: true
      })
      console.log("-------------商家登录-------------");
      let params = {};
      params.phone = this.data.formData.businessUserTel;
      params.password = this.data.formData.businessUserPwd;
      console.log(params)
      API.APIBusiness.MuserLogin(params).then(d => {
        console.log(d.data)
        this.setData({
          isShowModal: false,
          formData: { businessUserTel: '', businessUserPwd: '' }
        })
        if (d.data.code == 200) {
          wx.setStorageSync('muser_key', d.data.muser_id)
          wx.redirectTo({
            url: "/pages/about/businessAdmin/businessAdmin"
          })
        } else {
          app.showTips('登录失败')
        }
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