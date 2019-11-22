// pages/admin/businessDecorationEdit/businessDecorationEdit.js
const app = getApp();
const API = require('../../../api/api.endpoint.js');
const util = require('../../../utils/util.js');
const CONFIG = require('../../../config/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    isShowModal: true,
    //商家封面
    coverList: [],
    //商家实照
    shopImgListGlobalData: [],
    //商家信息
    formData: { businessName: '', startTime: '7:00', endTime: '24:00', businessTel: '', businessConsume: '', businessAddress: '', businessAddressDetail: '', businessIntroduce: '', latitude: '', longitude: '' },
    //图片修改状态 0=>未修改 1=>已修改
    coverState: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAll();
  },
  //获取全部数据
  getAll: function () {
    let muser_id = wx.getStorageSync("muser_key");
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
      API.APIBusiness.ShopsLookId(params).then(d => {
        if (d.statusCode == 200) {
          //商家封面
          let coverList = [this.data.imgUrl + d.data.shops.coverimg];
          //把商家实照放入全局图片列表
          app.globalData.shopImgList = [];
          for (let i = 0; i < d.data.list_shopsImage.length; i++) {
            let extraLine = {
              imgTitle: d.data.list_shopsImage[i].introduce,
              imgPath: d.data.list_shopsImage[i].image,
              imgId: d.data.list_shopsImage[i].id
            };
            app.globalData.shopImgList.push(extraLine);
          }
          //商家地址拆分
          let index = d.data.shops.address.indexOf('|') + 1;
          let position2 = d.data.shops.address.substring(index);
          let position1 = d.data.shops.address.substring(0, index - 1);
          //时间拆分
          var businessTime = d.data.shops.business_time.split('-')
          //把商家信息放入formData中
          let formData = this.data.formData;
          formData = {
            businessName: d.data.shops.name,
            startTime: businessTime[0].replace(/^\s+|\s+$/g, ""),
            endTime: businessTime[1].replace(/^\s+|\s+$/g, ""),
            businessTel: d.data.shops.tel,
            businessConsume: d.data.shops.average,
            businessAddress: position1,
            businessAddressDetail: position2,
            businessIntroduce: d.data.shops.texts,
            latitude: d.data.shops.lat,
            longitude: d.data.shops.lon
          }
          this.setData({
            shopImgListGlobalData: app.globalData.shopImgList,
            coverList: coverList,
            formData: formData,
            isShowModal: false,
          })
        }
      }).catch(f => {
        console.log(f)
      })
    }
  },
  //编辑商家实照
  toUpload: function (e) {
    let imgId = e.currentTarget.dataset.index == undefined ? 0 : e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/admin/businessImgUpload/businessImgUpload?id=' + imgId
    })
  },
  //时间选择
  TimeChange(e) {
    let formData = this.data.formData;
    let state = e.currentTarget.dataset.name;
    if (state == 'startTime') {
      formData.startTime = e.detail.value
    } else {
      formData.endTime = e.detail.value
    }
    this.setData({
      formData: formData
    })
  },
  //输入框方法
  bindInput: function (e) {
    let itemName = e.currentTarget.dataset.name;
    let itemData = e.detail.value
    let formData = this.data.formData;
    if (itemName == 'businessName') {
      formData.businessName = itemData;
    } else if (itemName == 'businessTel') {
      formData.businessTel = itemData;
    } else if (itemName == 'businessConsume') {
      formData.businessConsume = itemData;
    } else if (itemName == 'businessAddressDetail') {
      formData.businessAddressDetail = itemData;
    } else if (itemName == 'businessIntroduce') {
      formData.businessIntroduce = itemData;
    }
    this.setData({
      formData: formData
    })
  },
  //获取实时定位
  getLocation: function () {
    let that = this;
    let formData = that.data.formData;
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        formData.businessAddress = res.address;
        formData.latitude = res.latitude;
        formData.longitude = res.longitude;
        formData.businessAddressDetail = formData.businessAddressDetail == '' ? res.name : formData.businessAddressDetail;
        that.setData({
          formData: formData
        })
      },
      fail: function () {
        wx.getSetting({
          success: function (res) {
            let status = res.authSetting;
            if (!status['scope.userLocation']) {
              wx.showModal({
                title: '是否授权当前位置',
                content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                success: function (tip) {
                  if (tip.confirm) {
                    wx.openSetting({
                      success: function (data) {
                        if (data.authSetting["scope.userLocation"] === true) {
                          app.showTips('授权成功')
                          //授权成功之后，再调用chooseLocation选择地方
                          wx.chooseLocation({
                            success: function (res) {
                              formData.businessAddress = res.address;
                              formData.latitude = res.latitude;
                              formData.longitude = res.longitude;
                              formData.businessAddressDetail = formData.businessAddressDetail == '' ? res.name : formData.businessAddressDetail;
                              that.setData({
                                formData: formData
                              })
                            }
                          })
                        } else {
                          app.showTips('授权失败')
                        }
                      }
                    })
                  }
                }
              })
            }
          },
          fail: function (res) {
            app.showTips('调用授权窗口失败')
          }
        })
      }
    })
  },
  //表单提交    暂时不验证输入的是电话号码or手机号 util.tel(this.data.formData.businessUserTel)
  formSubmit: function (e) {
    // console.log(e.detail.value, '表单信息')
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定提交吗？',
      success(res) {
        if (res.confirm) {
          let submitArr = Object.values(e.detail.value);
          let coverList = that.data.coverList.length;
          console.log(coverList)
          if (submitArr.includes("") || submitArr.includes(undefined) || submitArr.includes(null) || coverList == 0 || app.globalData.shopImgList.length == 0) {
            app.showTips('您还有内容没添加哦!')
            return
          } else {
            that.setData({
              isShowModal: true
            })
            if (that.data.coverState == 0) {
              that.updateBusiness();
            } else {
              that.uploadImg();
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
        // console.log(res.tempFilePaths)
        this.setData({
          coverList: res.tempFilePaths,
          coverState: 1
        })
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
          this.data.coverList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            coverList: this.data.coverList,
            coverState: 1
          })
        }
      }
    })
  },
  //上传图片到服务器
  uploadImg: function () {
    console.log('-----------------上传图片再改变商家信息-----------------')
    let that = this;
    wx.uploadFile({
      url: CONFIG.API_HOST + 'ImageUpload',
      filePath: that.data.coverList[0],
      method: 'GET',
      name: 'businessLicense',
      header: {
        "Content-Type": "multipart/form-data"
      },
      success: function (res) {
        if (res.statusCode == 200 && res.data.length != 0) {
          let path = res.data.substr(14, 17);
          that.updateBusiness(path);
        } else {
          return false
        }
      },
      fail: function (res) {
        app.showTips('商家封面上传失败');
        return false
      }
    });
  },
  //修改商家信息
  updateBusiness: function (path) {
    console.log('-----------------开始改变商家信息-----------------')
    let muser_id = wx.getStorageSync("muser_key");
    let city_id = wx.getStorageSync("city_id");
    let formData = this.data.formData;
    let index = this.data.coverList[0].indexOf('com/') + 4;
    let coverImg = path === undefined ? this.data.coverList[0].substring(index) : path;
    let uploadImgList = app.globalData.shopImgList;
    let image = '';
    for (let i = 0; i < uploadImgList.length; i++) {
      image += uploadImgList[i].imgPath + 'a' + uploadImgList[i].imgTitle + ',';
    }
    if (muser_id === null || muser_id === undefined || muser_id === '') {
      app.showTips('未登录商家后台');
      setTimeout(function () {
        wx.redirectTo({
          url: '/pages/admin/businessLogin/businessLogin'
        })
      }, 1000);
    } else {
      let params = {};
      params.city_id = city_id;
      params.muser_id = muser_id;
      params.name = formData.businessName;
      params.coverimg = coverImg;
      params.texts = formData.businessIntroduce;
      params.business_time = formData.startTime + '-' + formData.endTime;
      params.average = formData.businessConsume;
      params.address = formData.businessAddress + '|' + formData.businessAddressDetail;
      params.lon = formData.latitude;
      params.lat = formData.longitude;
      params.tel = formData.businessTel;
      params.image = image;
      console.log(params, '提交信息');
      API.APIBusiness.ShopsEdit(params).then(d => {
        if (d.statusCode == 200) {
          this.getAll();
          app.showTips(d.data.message);
        }
      }).catch(f => {
        console.log(f)
      })
    }
  },
  //
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      shopImgListGlobalData: app.globalData.shopImgList,
    })
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
    app.globalData.shopImgList = [];
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