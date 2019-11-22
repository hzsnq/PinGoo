// pages/admin/businessImgUpload/businessImgUpload.js
const app = getApp();
const API = require('../../../api/api.endpoint.js');
const util = require('../../../utils/util.js');
const CONFIG = require('../../../config/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: '',
    isShow: true,
    isShowClose: false,
    imgTitle: '',
    imgId: '',
    shopImgList: [{
      imgPath: '',
      imgTitle: '',
      imgId: '',
    }],
    pageState: 'insert',
    imgUrl: app.globalData.imgUrl,
    imgState: 0, //0为改变上传图片   1为未改变上传图片
  },
  //上传封面图片
  chooseImage: function () {
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        let tempFilePaths = that.data.imgPath;
        tempFilePaths = res.tempFilePaths[0];
        that.setData({
          imgPath: tempFilePaths,
          isShow: false,
          imgState: 1
        })
      }
    })
  },
  //获取图片标题
  getImgTitle: function (e) {
    let Title = this.data.imgTitle;
    Title = e.detail.value;
    this.setData({
      imgTitle: Title,
    })
  },
  //删除图片
  deleteImage: function (e) {
    let id = e.currentTarget.id;
    let index = app.globalData.shopImgList.findIndex(item => {
      return item.imgId == id;
    });
    app.globalData.shopImgList.splice(index, 1);
    wx.navigateBack({
      delta: 1
    })
  },
  //上传图片信息
  uploadImgInfo: function () {
    let that = this;
    if (that.data.imgTitle.length == 0 || that.data.imgPath.length == 0) {
      app.showTips('请完善信息')
    } else if (that.data.pageState == 'insert') { //执行insert模式
      console.log('insert')
      wx.uploadFile({
        url: CONFIG.API_HOST + 'ImageUpload',
        filePath: this.data.imgPath,
        name: 'businessLicense',
        header: {
          "Content-Type": "multipart/form-data"
        },
        success: function (res) {
          let jsonStr = res.data;
          jsonStr = jsonStr.replace(" ", "");
          if (typeof jsonStr != 'object') {
            jsonStr = jsonStr.replace(/\ufeff/g, ""); //重点
            let jj = JSON.parse(jsonStr);
            res.data = jj;
          }
          app.globalData.shopImgList.push({
            imgTitle: that.data.imgTitle,
            imgPath: res.data.imageName,
            imgId: Math.random().toString(16).slice(2, 8),
          })
          wx.navigateBack({
            delta: 1
          })
        }
      })
    } else { //执行update模式
      if (that.data.imgState == 0) {
        let id = that.data.imgId;
        let index1 = app.globalData.shopImgList.findIndex(item => {
          return item.imgId == id;
        });
        let index = that.data.imgPath.indexOf('com/') + 4;
        app.globalData.shopImgList[index1] = ({
          imgPath: that.data.imgPath.substring(index),
          imgTitle: that.data.imgTitle,
          imgId: that.data.imgId,
        })
        wx.navigateBack({
          delta: 1
        })
      } else {
        wx.uploadFile({
          url: CONFIG.API_HOST + 'ImageUpload',
          filePath: this.data.imgPath,
          name: 'businessLicense',
          header: {
            "Content-Type": "multipart/form-data"
          },
          success: function (res) {
            let jsonStr = res.data;
            jsonStr = jsonStr.replace(" ", "");
            if (typeof jsonStr != 'object') {
              jsonStr = jsonStr.replace(/\ufeff/g, ""); //重点
              let jj = JSON.parse(jsonStr);
              res.data = jj;
            }
            let id = that.data.imgId;
            let index1 = app.globalData.shopImgList.findIndex(item => {
              return item.imgId == id;
            });
            app.globalData.shopImgList[index1] = ({
              imgPath: res.data.imageName,
              imgTitle: that.data.imgTitle,
              imgId: that.data.imgId,
            })
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    if (id != 0) {
      let index = app.globalData.shopImgList.find(item => {
        return item.imgId == id;
      });
      this.setData({
        imgTitle: index.imgTitle,
        imgPath: app.globalData.imgUrl + index.imgPath,
        imgId: index.imgId,
        isShow: false,
        pageState: 'update',
        isShowClose: true
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