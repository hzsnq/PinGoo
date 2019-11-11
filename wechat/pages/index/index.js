//index.js
const API = require('../../api/api.endpoint.js');
const mapFile = require('../../libs/map/amap-wx.js')
const uitls = require('../../utils/util.js')
const app = getApp();

Page({
  data: {
    PageCur: 'business',
    toView: 'toView0'
  },
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
  onLoad: function (options) {
    // if (app.isLogin()) {
    //   console.log('登陆啦')
    // } else {
    //   app.login()
    // }
    console.log(options.id, options.page_cur, 'onload判断是否有page_cur')
    //判断是否有参数
    if (options.id != undefined && options.page_cur != undefined && options.item_id != undefined) {
      this.setData({
        toView: 'toView' + options.id,
        PageCur: options.page_cur
      })
      this.selectComponent("#classify").showClassify(this.data.toView, options.item_id);
    }
  },
  onShow: function () {
    //需要获取实时位置，是否需要位置信息，减少网络请求
    let that = this;
    if (that.data.PageCur == 'business' || that.data.PageCur == 'classify') {
      let myMapFun = new mapFile.AMapWX({
        key: '0c12c7fc0bb7937d5cf2b0f2df3d79ff'
      });
      myMapFun.getRegeo({
        success: function (data) {
          // console.log(data[0].latitude, 'latitude')
          // console.log(data[0].longitude, 'longitude')
          let province = data[0].regeocodeData.addressComponent.province;
          let city = data[0].regeocodeData.addressComponent.city;
          let district = data[0].regeocodeData.addressComponent.district;
          let cityName = uitls.cityName(province, district, city);
          let cname = wx.getStorageSync('city_name')
          if (cname != undefined && cname != null && cname != '') {
            cityName = cname
          }
          app.globalData.cityName = cityName;
          wx.setStorageSync("city_name", cityName);
          // console.log(data)
          API.APICity.CityName(cityName).then(d => {
            if (d.data.code == 200) {
              wx.setStorageSync("city_id", d.data.city.id);
              console.log(d.data.city.id, 'city_id', '暂时获取到的city_id都为1')
              if (app.globalData.dataStatus) {
                console.log('首页内容已加载')
                return
              } else if (that.data.PageCur == 'business') {
                app.showTips('获取位置成功')
                console.log('首页内容没加载')
                that.selectComponent("#business").showBusiness();
              } else if (that.data.PageCur == 'classify') {
                that.selectComponent("#classify").showClassify();
              }
            }
          })
        },
        fail: function (info) {
          //失败回调
          wx.showToast({
            title: '位置信息未授权',
            icon: "none",
            success: function (res) {
              wx.setStorageSync("userLocation", null)
              wx.setStorageSync("city_id", null)
              if (that.data.PageCur == 'business') {
                that.selectComponent("#business").showBusiness();
              } else if (that.data.PageCur == 'classify') {
                that.selectComponent("#classify").showClassify();
              }
            }
          })
        }
      })
    } else if (that.data.PageCur == 'about') {
      that.selectComponent("#about").isCollection();
    }
  },
  onShareAppMessage() {
    return {
      title: 'ColorUI-高颜值的小程序UI组件库',
      imageUrl: '/images/share.jpg',
      path: '/pages/index/index'
    }
  }
})
