// pages/business/search/search.js
const API = require('../../../api/api.endpoint.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    isShow: false,
    isHotSearchShow: true,
    isHistorySearchShow: true,
    inputValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  bindInput: function (e) {
    if (e.detail.value.length == 0) {
      this.setData({
        isShow: false,
        inputValue: e.detail.value
      });
    } else {
      this.setData({
        isShow: true,
        inputValue: e.detail.value
      });
    }
  },
  tapCancel: function (e) {
    this.setData({
      isShow: false,
      inputValue: ""
    });
  },
  bindChange: function (e) {
    var data = this.data;
    console.log(data.inputValue)
    data.inputValue = data.inputValue.replace(/\s+/g, '');
    if ("" == data.inputValue) {
      getApp().showTips('请输入您要搜索的关键字');
    } else {
      var url = "../searchResult/index?keyword=" + data.inputValue;
      wx.navigateTo({
        url: url
      });

      // 搜索后将搜索记录缓存到本地  
      try {
        if ("" != data.inputValue) {
          var searchLogData = data.searchList;
          var issame = false;
          searchLogData.map(function (item) {
            if (data.inputValue == item) {
              issame = true;
            }
          })
          if (issame == false) {
            searchLogData.unshift(data.inputValue);
          }

          if (searchLogData.length > 10) {
            searchLogData.pop(); //移除最后一个元素
          }
          this.setData({
            searchList: searchLogData,
            isHistorySearchShow: true,

          });
          wx.setStorageSync("searchLogList", searchLogData);
        }
      } catch (e) {

      }
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