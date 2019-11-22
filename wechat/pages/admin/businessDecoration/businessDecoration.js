// pages/admin/businessDecoration/businessDecoration.js
const app = getApp();
const API = require('../../../api/api.endpoint.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    isShowModal: true,
    businessInfo: [],
    businessBanner: [],
    businessImg: [],
    businessImgShowNum: 2,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  //查看地图
  map: function (e) {
    wx.openLocation({
      longitude: e.currentTarget.dataset.lon,
      latitude: e.currentTarget.dataset.lat,
      name: e.currentTarget.dataset.name,
      address: e.currentTarget.dataset.address,
    })
  },
  //致电商家
  callBusiness: function (e) {
    let phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  toEdit: function () {
    wx.navigateTo({
      url: "/pages/admin/businessDecorationEdit/businessDecorationEdit"
    })
  },
  //展开更多，闭合更多
  showMoreImg() {
    let businessImgNum = this.data.businessImg.length;
    if (businessImgNum > this.data.businessImgShowNum) {
      this.setData({
        businessImgShowNum: businessImgNum
      })

    } else {
      this.setData({
        businessImgShowNum: 2
      })
    }
  },
  //在新页面中全屏预览图片
  previewImage(e) {
    let src = e.currentTarget.dataset.src;
    let imgList = e.currentTarget.dataset.list;
    let list = [];
    for (let i = 0; i < imgList.length; i++) {
      list.push(this.data.imgUrl + imgList[i].image)
    }
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: list // 需要预览的图片http链接列表
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
    let muser_id = wx.getStorageSync("muser_key");
    let location = wx.getStorageSync("userLocation");
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
      params.lon = location.substring(0, location.indexOf(','));
      params.lat = location.substring(location.indexOf(',') + 1);
      API.APIBusiness.ShopsLookId(params).then(d => {
        if (d.statusCode == 200) {
          let list = [];
          list.push({ image: d.data.shops.coverimg })
          let index = d.data.shops.address.indexOf('|') + 1;
          let position2 = d.data.shops.address.substring(index);
          let position1 = d.data.shops.address.substring(0, index - 1);
          d.data.shops.address = position1 + position2;
          this.setData({
            businessInfo: d.data.shops,
            businessBanner: list,
            businessImg: d.data.list_shopsImage,
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