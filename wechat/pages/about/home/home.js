// pages/about/home/home.js
const app = getApp();
const API = require('../../../api/api.endpoint.js');
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    userInfo: null,
    userParameters: []
  },
  /*组件生命周期*/
  lifetimes: {
    created() {
      console.log('----------------about----------------')
      console.log("在组件实例刚刚被创建时执行")
    },
    attached() {
      console.log("在组件实例进入页面节点树时执行")
      this.isCollection()
    },
    ready() {
      console.log("在组件在视图层布局完成后执行")
    },
    moved() {
      console.log("在组件实例被移动到节点树另一个位置时执行")
    },
    detached() {
      console.log("在组件实例被从页面节点树移除时执行")
      app.globalData.dataStatus = false;
    },
    error() {
      console.log("每当组件方法抛出错误时执行")
    },
    /*组件所在页面的生命周期 */
    pageLifetimes: {
      show: function () {
        // 页面被展示
        console.log("页面被展示")
      },
      hide: function () {
        // 页面被隐藏
        console.log("页面被隐藏")
      },
      resize: function (size) {
        // 页面尺寸变化
        console.log("页面尺寸变化")
      }
    }

  },
  methods: {
    tapListItem: function (e) {
      if (app.isLogin()) {
        console.log('登陆啦')
      } else {
        app.login();
        return
      }
      console.log(e.currentTarget.dataset.url)
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      })
    },
    //获取当前用户收藏等信息
    isCollection: function () {
      if (app.isLogin()) {
        console.log('登陆啦')
      } else {
        return
      }
      let user = wx.getStorageSync("user_info")
      this.setData({
        userInfo: user
      })
      let user_id = wx.getStorageSync("user_id");
      let params = {};
      params.user_id = user_id;
      API.APIUser.UserInfo(params).then(d => {
        console.log(d)
        if (d.data.code == 200) {
          this.setData({
            userParameters: d.data
          })
        }
      })
    },
  }
})