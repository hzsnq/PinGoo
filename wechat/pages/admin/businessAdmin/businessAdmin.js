// pages/about/businessAdmin/businessAdmin.js
const app = getApp();
const API = require('../../../api/api.endpoint.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    iconList: [{
      icon: '../../../images/yan(1).png',
      path: '/pages/admin/businessDecoration/businessDecoration',
      name: '店铺信息'
    }, {
      icon: '../../../images/yan(2).png',
      path: '/pages/admin/businessCoupons/businessCoupons',
      name: '优惠券'
    }, {
      icon: '../../../images/yan(3).png',
      path: '/pages/admin/businessPackage/businessPackage',
      name: '团购套餐'
    }, {
      icon: '../../../images/yan(8).png',
      path: '/pages/admin/businessCapital/businessCapital',
      name: '资金管理'
    }, {
      icon: '../../../images/yan(7).png',
      path: '/pages/admin/businessComment/businessComment',
      name: '评价管理'
    }, {
      icon: '../../../images/yan(9).png',
      path: '/pages/about/aboutUs/aboutUs',
      name: '关于我们'
    }],
    businessInfo: [],
    verifyCode: '',
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
    }
  },
  //验证码输入
  verifyInput: function (e) {
    let itemData = e.detail.value
    this.setData({
      verifyCode: itemData
    })
  },
  //验证点击
  verifyBtn: function () {
    let verifyCode = this.data.verifyCode;
    if (verifyCode === null || verifyCode === undefined || verifyCode === '' || verifyCode === ' ') {
      app.showTips('请输入正确的验证码');
      return
    } else {
      let muser_id = wx.getStorageSync("muser_key");
      let params = {};
      params.muser_id = muser_id;
      params.number = verifyCode
      API.APIBusiness.ShopsFightLooker().then(d => {
        console.log(d.data)
        if (d.data == 200) {
          app.showTips('还要验证');
        } else {
          app.showTips('验证失败');
        }
      })
      this.setData({
        verifyCode: ''
      })
    }
  },
  //扫码验证
  verifyCode: function () {
    let that = this;
    wx.scanCode({
      success: (res) => {
        let result = JSON.parse(res.result);
        let numberid = result.number;
        console.log(result);
        if (result.code) {
          console.log(result.code)
          //暂时注释，可以验证时实现
        } else {
          app.showTips('请扫描正确的二维码')
        }
      },
      fail: (res) => {
        app.showTips('请扫描正确的二维码')
      }
    })
  },
  //点击进入
  tapListItem: function (e) {
    let muser_id = wx.getStorageSync("muser_key");
    if (muser_id === null || muser_id === undefined || muser_id === '') {
      app.showTips('未登录商家后台');
      setTimeout(function () {
        wx.redirectTo({
          url: '/pages/admin/businessLogin/businessLogin'
        })
      }, 1000);
    } else {
      // console.log(e.currentTarget.dataset.path)
      wx.navigateTo({
        url: e.currentTarget.dataset.path
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
          let index = d.data.address.indexOf('|') + 1;
          let position2 = d.data.address.substring(index);
          let position1 = d.data.address.substring(0, index - 1);
          d.data.address = position1 + position2;
          d.data.coverimg = this.data.imgUrl + d.data.coverimg;
          this.setData({
            businessInfo: d.data,
            isShowModal: false
          })
        }
      })
    }
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