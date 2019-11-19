// pages/about/businessIncome/businessIncome.js
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
      //支付宝账号查询
      API.APICommon.AliPayExtract(params).then(d => {
        if (d.data.code == 200) {
          let formData = this.data.formData;
          formData.name = d.data.alipay.name ? d.data.alipay.name : '';
          formData.account = d.data.alipay.zhifubao ? d.data.alipay.zhifubao : '';
          this.setData({
            formData: formData
          })
        }
      })
    }
  },
  //表单提交
  formSubmit: function (e) {
    // console.log(e.detail.value, '表单信息')
    let submitArr = Object.values(e.detail.value);
    if (submitArr.includes("") || submitArr.includes(undefined) || submitArr.includes(null)) {
      app.showTips('请填写全部内容!')
      return
    } else if ((this.data.formData.money - this.data.businessInfo.income) > 0) {
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
      params.name = this.data.formData.name;
      params.zhifubao = this.data.formData.account;
      params.money = this.data.formData.money;
      params.moneyer = 0;
      params.type = 1;
      API.APICommon.MuserExtractAliPay(params).then(d => {
        if (d.data.code == 200) {
          app.showTips('提现申请已提交')
          API.APIBusiness.MuserLoginInfo(params).then(d => {
            if (d.data.code == 200) {
              this.setData({
                businessInfo: d.data
              })
            }
          })
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
    }
  },
  //明细
  toBusinessDetailed: function () {
    let page_title = '收入明细';
    wx.navigateTo({
      url: '/pages/admin/businessDetailed/businessDetailed?type=2&page_title=' + page_title
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