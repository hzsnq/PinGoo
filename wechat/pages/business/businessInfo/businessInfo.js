// pages/business/businessInfo/businessInfo.js
const app = getApp();
const API = require('../../../api/api.endpoint.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowModal: true,
    imgUrl: app.globalData.imgUrl,
    //商家全部信息
    businessInfo: [],
    businessBanner: [],
    //推荐商家集合显示
    contentListShow: false,
    //推荐商家集合
    contentList: [],
    //优惠券
    couponList: [],
    //优惠套餐
    packageList: [],
    //商家实照
    businessImg: [],
    businessImgShowNum: 2,
    //商家评论
    commentList: [],
    //商家评分
    businessScore: 0,
    businessScoreCount: 0,
    //举报商家信息
    tipOffInfo: [{ content: '商家信息错误' }, { content: '商家拒绝使用拼Goo' }, { content: '商家已关' }, { content: '商家占用' }],
    tipOffInfoModal: false,
    //是否收藏商家
    isCollection: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.dataStatus = true;
    // console.log(options.id)
    let location = wx.getStorageSync("userLocation");
    let params = {};
    params.lon = location.substring(0, location.indexOf(','));
    params.lat = location.substring(location.indexOf(',') + 1);
    params.id = options.id;
    API.APIBusiness.ShopsQueryId(params).then(d => {
      console.log(d, '商家全部信息')
      console.log(d.data.shops.id, d.data.shops.muser_id)
      let list = [];
      list.push({ image: d.data.shops.coverimg })
      this.setData({
        businessInfo: d.data.shops,
        businessBanner: list,
        couponList: d.data.list_coupon,
        packageList: d.data.list_packages,
        businessImg: d.data.list_shopsImage,
        commentList: d.data.list_evaluate,
        businessScore: d.data.sum_score > 5 ? 5 : d.data.sum_score,
        businessScoreCount: d.data.sum_count,
        isShowModal: false
      })
      this.getRecommend();
      this.isCollection();
    })
  },
  //打开店家详情
  toChild(e) {
    let id = e.currentTarget.id;
    wx.redirectTo({
      url: "/pages/business/businessInfo/businessInfo?id=" + id
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
  //页面滑动加载底部推荐
  onPageScroll: function (e) {
    // if (e.scrollTop > 100 && this.data.contentListShow != true) {
    //   console.log('加载')
    //   this.getRecommend();
    // }
  },
  //获取底部推荐商家
  getRecommend: function () {
    let location = wx.getStorageSync("userLocation");
    let city_id = wx.getStorageSync("city_id");
    let params = {};
    params.lon = location.substring(0, location.indexOf(','));
    params.lat = location.substring(location.indexOf(',') + 1);
    params.city = city_id;
    params.sort_id = this.data.businessInfo.sort_id;
    params.sorter_id = this.data.businessInfo.sorter_id;
    params.muser_id = this.data.businessInfo.muser_id;
    API.APIBusiness.ShopsRandomList(params).then(d => {
      if (d.data.list_shops.length > 0) {
        this.setData({
          contentList: d.data.list_shops,
          contentListShow: true
        })
      }
    })
  },
  //打开优惠券或者套餐页面
  toCouponOrPackage: function (e) {
    if (app.isLogin()) {
      console.log('登陆啦')
    } else {
      app.login()
      return
    }
    let id = e.currentTarget.dataset.id;
    let muser_id = this.data.businessInfo.muser_id;
    let page = e.currentTarget.dataset.page;
    wx.navigateTo({
      url: "/pages/business/couponAndPackage/couponAndPackage?id=" + id + "&muser_id=" + muser_id + "&page=" + page
    })
  },
  //查看更多评论
  showMoreComment: function () {
    let id = this.data.businessInfo.id;
    let muser_id = this.data.businessInfo.muser_id;
    wx.navigateTo({
      url: "/pages/business/comment/comment?muser_id=" + muser_id + '&id=' + id
    })
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
  //举报商家显示隐藏
  hideModal: function () {
    if (app.isLogin()) {
      console.log('登陆啦')
    } else {
      app.login()
      return
    }
    let tipOffInfoModal = !this.data.tipOffInfoModal;
    this.setData({
      tipOffInfoModal: tipOffInfoModal
    })
  },
  //举报原因提交
  tipOffClick: function (e) {
    console.log(e)
  },
  //收藏或取消商家
  collection: function () {
    if (app.isLogin()) {
      console.log('登陆啦')
    } else {
      app.login()
      return
    }
    let isCollection = !this.data.isCollection;
    this.setData({
      isCollection: isCollection
    })
    let user_id = wx.getStorageSync("user_id");
    let muser_id = this.data.businessInfo.id;
    console.log(muser_id)
    let params = {};
    params.user_id = user_id;
    params.shops_id = muser_id;
    params.state = this.data.isCollection ? 1 : 0;
    API.APIBusiness.CollectionEdit(params).then(d => {
      app.showTips(d.data.message)
    })
  },
  //判断当前用户是否收藏该商家
  isCollection: function () {
    if (app.isLogin()) {
      console.log('登陆啦')
    } else {
      return
    }
    let user_id = wx.getStorageSync("user_id");
    let muser_id = this.data.businessInfo.muser_id;
    let params = {};
    params.user_id = user_id;
    API.APIUser.CollectionQueryAll(params).then(d => {
      for (let i = 0; i < d.data.list_shops.length; i++) {
        if (d.data.list_shops[i].shops_id == muser_id) {
          this.setData({
            isCollection: true
          })
        }
      }
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
    this.isCollection()
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