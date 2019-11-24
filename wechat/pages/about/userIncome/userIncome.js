// pages/about/userIncome/userIncome.js
const app = getApp();
const API = require('../../../api/api.endpoint.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowModal: true,
    formData: { money: '', name: '', account: '' },
    id: '',
    money: '',
    moneyer: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let formData = this.data.formData;
    formData.name = options.name != "null" ? options.name : '';
    formData.account = options.num != "null" ? options.num : '';
    this.setData({
      id: options.id,
      money: options.money,
      moneyer: options.moneyer,
      formData: formData,
      isShowModal: false
    })
  },
  //表单提交
  formSubmit: function (e) {
    // console.log(e.detail.value, '表单信息')
    let submitArr = Object.values(e.detail.value);
    if (submitArr.includes("") || submitArr.includes(undefined) || submitArr.includes(null)) {
      app.showTips('请填写全部内容!')
      return
    } else if ((this.data.formData.money - this.data.moneyer) > 0) {
      app.showTips('提现金额不能比余额大');
      return
    } else if (this.data.formData.money.includes("-")) {
      app.showTips('提现金额不能为负');
      return
    } else if (this.data.formData.money != 0) {
      console.log("-------------开始提现-------------");
      let that = this;
      wx.showModal({
        title: '提示',
        content: '确定提现吗？',
        success(res) {
          if (res.confirm) {
            that.toAlipay();
          } else if (res.cancel) {
            return
          }
        },
        fail(res) {
          app.showTips('发生未知错误')
        }
      })
    } else {
      app.showTips('提现金额不能为0');
      return
    }
  },
  //输入框方法
  bindInput: function (e) {
    let itemName = e.currentTarget.dataset.name;
    let itemData = e.detail.value
    let formData = this.data.formData;
    if (itemName == 'money') {
      formData.money = itemData;
    } else if (itemName == 'name') {
      formData.name = itemData;
    } else if (itemName == 'account') {
      formData.account = itemData;
    }
    this.setData({
      formData: formData
    })
  },
  //支付宝提现方法
  toAlipay: function () {
    this.setData({
      isShowModal: true
    })
    let params = {};
    params.user_id = this.data.id;
    params.zhifubao = this.data.formData.account;
    params.money = this.data.formData.money;
    params.ali_name = this.data.formData.name;
    API.APIUser.UserMoneyTiXian(params).then(d => {
      if (d.data.code == 200) {
        app.showTips('提现申请已提交')
      } else {
        app.showTips('提现失败')
      }
      let formData = this.data.formData;
      formData.money = '';
      this.setData({
        isShowModal: false,
        formData: formData
      })
    })
  },
  //明细
  toBusinessDetailed: function () {
    wx.navigateTo({
      url: '/pages/about/userDetailed/userDetailed?id=' + this.data.id
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