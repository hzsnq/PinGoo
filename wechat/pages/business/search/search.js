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
    imgUrl: app.globalData.imgUrl,
    isShow: false,
    isHotSearchShow: true,
    isHistorySearchShow: true,
    inputValue: '',
    keywords: [{ content: '火锅' }, { content: '快递' }, { content: '蛋糕店' }, { content: '烤鱼' }, { content: '自助' }],
    isHistorySearchShow: false,
    searchList: [],
    contentListShow: false,
    contentList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.dataStatus = true;
    let log = wx.getStorageSync("searchLogList");
    if (log === undefined || log === null || log === '') {
      return
    } else {
      this.setData({
        isHistorySearchShow: true,
        searchList: log
      })
    }
  },
  //输入框方法
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
  //删除输入框内容
  tapCancel: function (e) {
    this.setData({
      isShow: false,
      inputValue: ""
    });
  },
  //清空历史搜索
  deleteTap: function (e) {
    wx.removeStorageSync('searchLogList')
    this.setData({
      searchList: [],
      isHistorySearchShow: false,
    });
  },
  //搜索关键字
  bindChange: function (e) {
    if (app.isLogin()) {
      console.log('登陆啦')
    } else {
      app.login()
      return
    }
    let data = this.data;
    data.inputValue = data.inputValue.replace(/\s+/g, '');
    if ("" == data.inputValue) {
      getApp().showTips('请输入您要搜索的关键字');
    } else {
      this.setHistorySearch(data.inputValue)
      this.getContentList(data.inputValue);
      this.setData({
        inputValue: '',
        isShow: false
      })
      // var url = "../searchResult/index?keyword=" + data.inputValue;
      // wx.navigateTo({
      //   url: url
      // });
    }
  },
  //关键字添加缓存
  setHistorySearch: function (inputValue) {
    if ("" != inputValue) {
      let searchLogData = this.data.searchList;
      let isName = false;
      searchLogData.map(function (item) {
        if (inputValue == item) {
          isName = true;
        }
      })
      if (isName == false) {
        searchLogData.unshift(inputValue);
      }

      if (searchLogData.length > 20) {
        searchLogData.pop(); //移除最后一个元素
      }
      this.setData({
        searchList: searchLogData,
        isHistorySearchShow: true,
      });
      wx.setStorageSync("searchLogList", searchLogData);
    }
  },
  //历史关键字查询
  tapHistorySearch: function (e) {
    if (app.isLogin()) {
      console.log('登陆啦')
    } else {
      app.login()
      return
    }
    this.getContentList(e.currentTarget.dataset.item);
  },
  //热门关键字查询
  tapKeyword: function (e) {
    if (app.isLogin()) {
      console.log('登陆啦')
    } else {
      app.login()
      return
    }
    let keyword = this.data.keywords[parseInt(e.currentTarget.id)].content;
    this.setHistorySearch(keyword)
    this.getContentList(keyword);
  },
  //getContentList
  getContentList: function (searcher) {
    this.setData({
      contentList: [],
      contentListShow: false
    })
    let location = wx.getStorageSync("userLocation");
    let city_id = wx.getStorageSync("city_id");
    let user_id = wx.getStorageSync("user_id");
    let params = {};
    params.lon = location.substring(0, location.indexOf(','));
    params.lat = location.substring(location.indexOf(',') + 1);
    params.city = city_id;
    params.page = 1;
    params.searcher = searcher;
    params.user_id = user_id;
    API.APIBusiness.ShopsSearchList(params).then(d => {
      if (d.data.list_shops.length > 0) {
        this.setData({
          contentList: d.data.list_shops,
          contentListShow: true
        })
      }
    })
  },
  //打开商家详情页
  toChild(e) {
    let id = e.currentTarget.id;
    wx.navigateTo({
      url: "/pages/business/businessInfo/businessInfo?id=" + id
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