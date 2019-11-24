// pages/about/recommend/recommend.js
const app = getApp();
const API = require('../../../api/api.endpoint.js');
const CONFIG = require('../../../config/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: [],
    text: [],
    imgList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.dataStatus = true;
    let user_id = wx.getStorageSync("user_id");
    let params = {};
    params.user_id = user_id;
    API.APIUser.UserMoney(params).then(d => {
      if (d.data.code == 200) {
        // console.log(d.data)
        d.data.user_erweima = CONFIG.API_HOST + d.data.user_erweima
        this.setData({
          userInfo: d.data
        })
      }
    })
    API.APIUser.UserLoginCheck().then(d => {
      this.setData({
        text: d.data
      })
    })
  },  //复制邀请码
  copyClick: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            app.showTips(res)
          }
        })
      }
    })
  },
  changeCover: function (e) {
    let state = e.currentTarget.dataset.state;
    let src = e.currentTarget.dataset.src;
    let that = this;
    if (state == 0) {
      wx.showModal({
        title: '提示',
        content: '请上传图片',
        success: function (res) {
          if (res.confirm) {
            that.ChooseImage();
          } else if (res.cancel) {
            console.log('取消')
          }
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请选择修改logo或者保存',
        cancelText: '更换图片',
        confirmText: '保存预览',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击预览')
            let list = [];
            list.push(src)
            wx.previewImage({
              current: src,
              urls: list
            })
          } else if (res.cancel) {
            console.log('用户点击修改')
            that.ChooseImage();
          }
        }
      })
    }
  },
  //选择添加图片
  ChooseImage: function () {
    let that = this;
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        console.log(res.tempFilePaths)
        that.setData({
          imgList: res.tempFilePaths
        })
        wx.uploadFile({
          url: CONFIG.API_HOST + 'ImageUpload',
          filePath: that.data.imgList[0],
          method: 'GET',
          name: 'businessLicense',
          header: {
            "Content-Type": "multipart/form-data"
          },
          success: function (res) {
            if (res.statusCode == 200 && res.data.length != 0) {
              let path = res.data.substr(14, 17);
              that.updateCodeCover(path);
            } else {
              return false
            }
          },
          fail: function (res) {
            app.showTips('封面上传失败');
            return false
          }
        });
      },
      fail: () => {
        app.showTips('取消上传')
      }
    });
  },
  updateCodeCover: function (path) {
    let params = {};
    params.user_id = wx.getStorageSync('user_id');
    params.imageName = path;
    API.APIUser.UserErweima(params).then(d => {
      if (d.data.code == 200) {
        let cover = this.data.userInfo;
        cover.user_erweima = CONFIG.API_HOST + d.data.user_erweima;
        this.setData({
          userInfo: cover
        })
        app.showTips('修改成功')
      } else {
        app.showTips('修改失败')
      }
    })
  },
  money: function () {
    let moneyer = this.data.userInfo.user.moneyer;
    let money = this.data.userInfo.user.money;
    let ali_name = this.data.userInfo.user.ali_name;
    let ali_zhifubao = this.data.userInfo.user.ali_zhifubao;
    let id = this.data.userInfo.user.id;
    wx.navigateTo({
      url: '/pages/about/userIncome/userIncome?moneyer=' + moneyer + '&money=' + money + '&name=' + ali_name + '&num=' + ali_zhifubao + '&id=' + id
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