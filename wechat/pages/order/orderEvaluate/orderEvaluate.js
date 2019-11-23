// pages/order/orderEvaluate/orderEvaluate.js
const app = getApp();
const API = require('../../../api/api.endpoint.js');
const CONFIG = require('../../../config/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    isShowModal: true,
    evaluateId: '',
    shopInfo: {},
    imgList: [],
    //分数 状态0=>灰 1=>红 下标 标语
    startList: [{ score: 1, state: 0, index: 0, text: '非常差' }, { score: 2, state: 0, index: 1, text: '差' }, { score: 3, state: 0, index: 2, text: '一般' }, { score: 4, state: 0, index: 3, text: '好' }, { score: 5, state: 0, index: 4, text: '非常好' }],
    //当前分数
    tabStar: -1,
    formData: { orderIntroduce: '' },
    upload: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    this.setData({
      evaluateId: options.id
    })
    let params = {};
    params.id = id;
    API.APIOrder.EvaluatePre(params).then(d => {
      console.log(d.data)
      this.setData({
        shopInfo: d.data.fight,
        isShowModal: false
      })
    })
  },
  startChange: function (e) {
    let score = e.currentTarget.dataset.score;
    let index = e.currentTarget.dataset.index;
    let start = this.data.startList;
    for (let i = 0; i <= 4; i++) {
      start[i].state = 0;
    }
    for (let i = 0; i <= index; i++) {
      start[i].state = 1;
    }
    this.setData({
      tabStar: index,
      startList: start
    })
  },
  //输入框方法
  bindInput: function (e) {
    let itemName = e.currentTarget.dataset.name;
    let itemData = e.detail.value
    let formData = this.data.formData;
    if (itemName == 'orderIntroduce') {
      formData.orderIntroduce = itemData;
    }
    this.setData({
      formData: formData
    })
  },
  //表单提交
  formSubmit: function (e) {
    // console.log(e.detail.value, '表单信息')
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定提交吗？',
      success(res) {
        if (res.confirm) {
          let submitArr = Object.values(e.detail.value);
          if (submitArr.includes("") || submitArr.includes(undefined) || submitArr.includes(null) || that.data.tabStar == -1) {
            app.showTips('您还有内容没填写哦!')
            return
          } else {
            that.setData({
              isShowModal: true
            })
            if (that.data.imgList.length == 0) {
              that.insertEvaluate();
            } else {
              console.log('上传图片')
              for (let i = 0; i < that.data.imgList.length; i++) {
                that.uploadImg(i);
              }
            }
          }
        } else if (res.cancel) {
          return
        }
      },
      fail(res) {
        app.showTips('发生未知错误')
      }
    })
  },
  //选择添加图片
  ChooseImage: function () {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        console.log(res.tempFilePaths)
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      },
      fail: () => {
        app.showTips('取消上传')
      }
    });
  },
  //删除图片
  DelImg(e) {
    wx.showModal({
      title: '',
      content: '确定要删除这张图片吗？',
      cancelText: '取消',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  //上传图片到服务器
  uploadImg: function (i) {
    let that = this;
    wx.uploadFile({
      url: CONFIG.API_HOST + 'ImageUpload',
      filePath: that.data.imgList[i],
      method: 'GET',
      name: 'businessLicense',
      header: {
        "Content-Type": "multipart/form-data"
      },
      success: function (res) {
        if (res.statusCode == 200 && res.data.length != 0) {
          let path = res.data.substr(14, 17);
          let upload = that.data.upload;
          upload.push(path);
          that.setData({
            upload: upload
          })
          if (that.data.upload.length == that.data.imgList.length) {
            that.insertEvaluate();
          }
        } else {
          app.showTips('评论照片上传失败');
          return false
        }
      },
      fail: function (res) {
        app.showTips('评论照片上传失败');
        return false
      }
    });
  },
  //添加评论
  insertEvaluate: function () {
    console.log(this.data.upload)
    let image = '';
    for (let i = 0; i < this.data.upload.length; i++) {
      image += this.data.upload[i] + ',';
    }
    let params = {};
    params.id = this.data.evaluateId;
    params.score = this.data.startList[this.data.tabStar].score;
    params.content = this.data.formData.orderIntroduce;
    params.image = image;
    console.log(params)
    API.APIOrder.EvaluateAdd(params).then(d => {
      app.showTips(d.data.msg);
      this.setData({
        isShowModal: false
      })
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        })
      }, 2500)
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