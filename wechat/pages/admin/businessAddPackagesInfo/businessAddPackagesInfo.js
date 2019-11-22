// pages/admin/businessAddPackagesInfo/businessAddPackagesInfo.js
const app = getApp();
const API = require('../../../api/api.endpoint.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageState: 'insert',
    packageName: '',
    packageNum: '',
    packageMoney: '',
    packageId: '',
  },
  //获取套餐信息
  getPackageName: function (e) {
    let name = this.data.packageName;
    name = e.detail.value;
    this.setData({
      packageName: name,
    })
  },
  //获取数量
  getPackageNum: function (e) {
    let num = this.data.packageNum;
    num = e.detail.value;
    this.setData({
      packageNum: num,
    })
  },
  //获取价格
  getPackageMoney: function (e) {
    let money = this.data.packageMoney;
    money = e.detail.value;
    this.setData({
      packageMoney: money,
    })
  },
  //添加套餐信息
  updatePackagesInfo: function () {
    let that = this;
    if (that.data.packageName.length == 0 || that.data.packageNum.length == 0 || that.data.packageMoney.length == 0) {
      wx.showToast({
        title: '请完善信息',
      });
    } else if (that.data.pageState == 'insert') { //执行insert模式
      console.log('insert')
      app.globalData.packagesList.push({
        packageName: that.data.packageName,
        packageNum: that.data.packageNum,
        packageId: Math.random().toString(16).slice(2, 8),
        packageMoney: that.data.packageMoney
      })
      wx.navigateBack({
        delta: 1
      })
    } else { //执行update模式
      console.log('update')
      let id = that.data.packageId;
      let index1 = app.globalData.packagesList.findIndex(item => {
        return item.packageId == id;
      });
      app.globalData.packagesList[index1] = ({
        packageName: that.data.packageName,
        packageNum: that.data.packageNum,
        packageId: that.data.packageId,
        packageMoney: that.data.packageMoney
      })
      wx.navigateBack({
        delta: 1
      })

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    if (id != 0) {
      let index = app.globalData.packagesList.find(item => {
        return item.packageId == id;
      });
      this.setData({
        packageName: index.packageName,
        packageNum: index.packageNum,
        packageMoney: index.packageMoney,
        packageId: index.packageId,
        pageState: 'update'
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