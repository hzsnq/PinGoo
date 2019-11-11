// pages/business/comment/comment.js
const app = getApp();
const API = require('../../../api/api.endpoint.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 系统参数
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    imgUrl: app.globalData.imgUrl,
    commentList: [],
    muser_id: '',
    page: 1,
    bgColor: '',
    isShow: false,
    isLoad: true,
    isShowModal: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.setData({
      muser_id: options.muser_id
    })
    let params = {};
    params.muser_id = options.muser_id;
    params.page = 1;
    this.getComment(params);
  },
  getComment: function (params) {
    API.APIBusiness.ShopsEvaluateList(params).then(d => {
      if (d.data.code == 200) {
        if (d.data.list_evaluate.length == 0) {
          this.setData({
            isShow: true,
            isLoad: false,
            bgColor: 'bg-white',
            isShowModal: false
          })
        } else {
          let commentList = this.data.commentList.concat(d.data.list_evaluate);
          this.setData({
            commentList: commentList,
            isShow: false,
            isLoad: true,
            bgColor: '',
            isShowModal: false
          })
        }
      }
    })
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
  loadMore: function () {
    let params = {};
    params.muser_id = this.data.muser_id;
    params.page = this.data.page + 1;
    this.getComment(params);
    this.setData({
      isShow: true
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