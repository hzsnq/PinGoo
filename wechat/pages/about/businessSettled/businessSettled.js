// pages/about/businessSettled/businessSettled.js
const app = getApp();
const util = require('../../../utils/util.js');
const API = require('../../../api/api.endpoint.js');
const CONFIG = require('../../../config/config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowModal: false,
    imgList: [],
    //表单数据
    formData: { businessName: '', businessAddress: '', businessTrade: '', businessUserName: '', businessUserTel: '' },
    picker: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    API.APIBusiness.SortQueryAll().then(d => {
      let pickerData = d.data.list_sort;
      let arr = Array();
      for (var i = 0; i < pickerData.length; i++) {
        arr.push(pickerData[i].sort_name)
      }
      this.setData({
        picker: arr
      })
    })
  },
  //表单提交
  formSubmit: function (e) {
    // console.log(e.detail.value, '表单信息')
    let submitArr = Object.values(e.detail.value);
    if (submitArr.includes("") || submitArr.includes(undefined) || submitArr.includes(null)||this.data.imgList.length==0) {
      app.showTips('您还有内容没填写哦!')
      return
    } else if (util.tel(this.data.formData.businessUserTel)) {
      this.setData({
        isShowModal: true
      })
      console.log("-------------添加商家-------------");
      this.uploadImg();
    } else {
      app.showTips('请检查输入的联系电话')
      return
    }
  },
  //输入框方法
  bindInput: function (e) {
    let itemName = e.currentTarget.dataset.name;
    let itemData = e.detail.value
    let formData = this.data.formData;
    if (itemName == 'businessName') {
      formData.businessName = itemData;
    } else if (itemName == 'businessUserName') {
      formData.businessUserName = itemData;
    } else if (itemName == 'businessUserTel') {
      formData.businessUserTel = itemData;
    }
    this.setData({
      formData: formData
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
        this.setData({
          imgList: res.tempFilePaths
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
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  //填写所属行业
  pickerChange: function (e) {
    // console.log(e.detail.value)
    let formData = this.data.formData;
    formData.businessTrade = this.data.picker[e.detail.value];
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
        formData.businessAddress = res.address;
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
                        console.log(data);
                        if (data.authSetting["scope.userLocation"] === true) {
                          app.showTips('授权成功')
                          //授权成功之后，再调用chooseLocation选择地方
                          wx.chooseLocation({
                            success: function (res) {
                              formData.businessAddress = res.address;
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
  //上传图片到服务器
  uploadImg: function () {
    let that = this;
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
          that.insertBusiness(path);
        } else {
          return false
        }
      },
      fail: function (res) {
        app.showTips('营业执照上传失败');
        return false
      }
    });
  },
  //添加商家
  insertBusiness: function (path) {
    console.log(this.data.formData, path)
    let formData = this.data.formData
    let params = {};
    params.name = formData.businessName;
    params.address = formData.businessAddress;
    params.industry = formData.businessTrade;
    params.username = formData.businessUserName;
    params.phone = formData.businessUserTel;
    params.yy_image = path;
    params.pid = ''
    API.APIBusiness.ShopsEnter(params).then(d => {
      console.log(d.data)
      if (d.data.code == 200) {
        this.setData({
          isShowModal: false
        })
        app.showTips(d.data.message);
        setTimeout(function () {
          wx.navigateBack({
            delta: 2
          })
        }, 2500)
      } else {
        this.setData({
          isShowModal: false
        })
        app.showTips('入驻失败');
      }
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