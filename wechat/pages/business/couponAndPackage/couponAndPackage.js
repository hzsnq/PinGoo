// pages/business/couponAndPackage/couponAndPackage.js
const app = getApp();
const API = require('../../../api/api.endpoint.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowModal: true,
    imgUrl: app.globalData.imgUrl,
    pageName: '',
    bannerList: [],
    businessInfo: [],
    packagesList: [],
    couponList: [],
    packageContent: [],
    businessImgShowNum: 2,
    packageImg: [],
    dan_zhekou: '',
    muser_id: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.isLogin()) {
      console.log('登陆啦')
    } else {
      return
    }
    this.setData({
      pageName: options.page,
      muser_id: options.muser_id
    })
    console.log(options.id, options.page, options.muser_id)
    let location = wx.getStorageSync("userLocation");
    let params = {};
    params.lon = location.substring(0, location.indexOf(','));
    params.lat = location.substring(location.indexOf(',') + 1);
    params.id = options.id;

    if (options.page == 'coupon') {
      this.getCouponList(params);
    } else {
      this.getPackagesList(params);
    }
  },
  //getCouponList
  getCouponList: function (params) {
    API.APIBusiness.CouponSee(params).then(d => {
      console.log(d.data)
      let list = [];
      list.push({ image: d.data.shops.coverimg });
      let index = d.data.shops.address.indexOf('|') + 1;
      let position2 = d.data.shops.address.substring(index);
      let position1 = d.data.shops.address.substring(0, index - 1);
      d.data.shops.address = position1 + position2;
      this.setData({
        businessInfo: d.data.shops,
        bannerList: list,
        couponList: d.data.coupon,
        commentList: d.data.list_evaluate,
        businessScore: d.data.sum_score > 5 ? 5 : d.data.sum_score,
        businessScoreCount: d.data.sum_count,
        dan_zhekou: d.data.dan_zhekou,
        isShowModal: false
      })
    })
  },
  //getPackageList
  getPackagesList: function (params) {
    API.APIBusiness.PackagesSee(params).then(d => {
      console.log(d.data)
      let index = d.data.shops.address.indexOf('|') + 1;
      let position2 = d.data.shops.address.substring(index);
      let position1 = d.data.shops.address.substring(0, index - 1);
      d.data.shops.address = position1 + position2;
      this.setData({
        businessInfo: d.data.shops,
        bannerList: d.data.list_packageImage,
        packagesList: d.data.packages,
        commentList: d.data.list_evaluate,
        businessScore: d.data.sum_score > 5 ? 5 : d.data.sum_score,
        businessScoreCount: d.data.sum_count,
        packageContent: d.data.list_packageContent,
        packageImg: d.data.list_packageImage,
        dan_zhekou: d.data.dan_zhekou,
        isShowModal: false
      })
    })
  },//展开更多，闭合更多
  showMoreImg() {
    let businessImgNum = this.data.packageImg.length;
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
  map: function (e) {
    wx.openLocation({
      longitude: e.currentTarget.dataset.lon,
      latitude: e.currentTarget.dataset.lat,
      name: e.currentTarget.dataset.name,
      address: e.currentTarget.dataset.address,
    })
  },
  toPay: function (e) {
    if (app.isLogin()) {
      console.log('登陆啦')
    } else {
      app.login()
      return
    }
    let muser_id = e.currentTarget.dataset.muser;
    let user_id = wx.getStorageSync('user_id');
    let id = e.currentTarget.dataset.id;
    let price = e.currentTarget.dataset.price;
    let type = e.currentTarget.dataset.type;
    let people = e.currentTarget.dataset.people;
    // console.log(muser_id, user_id, id, price, type, people)
    wx.navigateTo({
      url: '/pages/business/payment/payment?price=' + price + '&type=' + type + '&id=' + id + '&people=' + people + '&user_id=' + user_id + '&muser_id=' + muser_id,
    })
  },//查看更多评论
  showMoreComment: function () {
    let muser_id = this.data.muser_id;
    wx.navigateTo({
      url: "/pages/business/comment/comment?muser_id=" + muser_id
    })
  },
  //致电商家
  callBusiness: function (e) {
    let phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
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