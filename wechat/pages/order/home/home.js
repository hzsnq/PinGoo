// pages/order/home/home.js
const API = require('../../../api/api.endpoint.js');
const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    imgUrl: app.globalData.imgUrl,
    isShowModal: true,
    orderList: [],
    navList: [{ id: 1, name: '待使用', index: 0 }, { id: 2, name: '待评价', index: 1 }, { id: 3, name: '已完成', index: 2 }, { id: 10, name: '退订单', index: 3 }],
    TabCur: 0,
    showAdvert: true
  },
  /*组件生命周期*/
  lifetimes: {
    created() {
      console.log('----------------order----------------')
      console.log("在组件实例刚刚被创建时执行")
    },
    attached() {
      console.log("在组件实例进入页面节点树时执行");
      if (app.isLogin()) {
        console.log('登陆啦')
      } else {
        app.showTips('未登录')
        this.setData({
          isShowModal: false
        })
        return
      }
      this.getOrderList(1);
    },
    ready() {
      console.log("在组件在视图层布局完成后执行")

      // //在页面中定义激励视频广告
      // let videoAd = null

      // // 在页面onLoad回调事件中创建激励视频广告实例
      // if (wx.createRewardedVideoAd) {
      //   videoAd = wx.createRewardedVideoAd({
      //     adUnitId: 'adunit-dc29d8bb171acc3b'
      //   })
      //   videoAd.onLoad(() => { })
      //   videoAd.onError((err) => { })
      //   videoAd.onClose((res) => { })
      // }

      // // 用户触发广告后，显示激励视频广告
      // if (videoAd) {
      //   videoAd.show().catch(() => {
      //     // 失败重试
      //     videoAd.load()
      //       .then(() => videoAd.show())
      //       .catch(err => {
      //         console.log('激励视频 广告显示失败')
      //       })
      //   })
      // }
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
    showOrder: function () {
      this.setData({
        TabCur: 0,
        isShowModal: true
      })
      this.getOrderList(1);
    },
    //nav切换
    tabSelect: function (e) {
      let index = e.currentTarget.dataset.index;
      let id = e.currentTarget.dataset.id;
      this.setData({
        TabCur: index,
        isShowModal: true
      });
      this.getOrderList(id);
    },
    //获取订单列表
    getOrderList: function (id) {
      let params = {};
      params.user_id = wx.getStorageSync("user_id");
      params.use_state = id;
      API.APIOrder.FightListUse(params).then(d => {
        // console.log(d)
        if (d.statusCode == 200) {
          this.setData({
            orderList: d.data.list_fight,
            isShowModal: false
          })
        }
      })
    },
    //优惠券或者套餐
    toPackageOrCoupon: function (e) {
      if (app.isLogin()) {
        console.log('登陆啦')
      } else {
        app.login()
        return
      }
      let id = e.currentTarget.dataset.id;
      let muser_id = e.currentTarget.dataset.muser;
      let page = e.currentTarget.dataset.page;
      wx.navigateTo({
        url: "/pages/business/couponAndPackage/couponAndPackage?id=" + id + "&muser_id=" + muser_id + "&page=" + page
      })
    },
    //申请退款
    toRefund: function (e) {
      if (app.isLogin()) {
        console.log('登陆啦')
      } else {
        app.login()
        return
      }
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/order/refund/refund?id=' + id,
      })
    },
    toViewOrder: function (e) {
      if (app.isLogin()) {
        console.log('登陆啦')
      } else {
        app.login()
        return
      }
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/order/viewOrder/viewOrder?id=' + id,
      })
    },
    toProgress: function (e) {
      app.showTips('正在开发中...')
    },
    toComment: function (e) {
      if (app.isLogin()) {
        console.log('登陆啦')
      } else {
        app.login()
        return
      }
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/order/orderComment/orderComment?id=' + id,
      })
    },
    toEvaluate: function (e) {
      if (app.isLogin()) {
        console.log('登陆啦')
      } else {
        app.login()
        return
      }
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/order/orderEvaluate/orderEvaluate?id=' + id,
      })
    },
    advertState: function (e) {
      console.log(e)
      if (e.type == 'load') {
        this.setData({
          showAdvert: true
        })
      } else {
        this.setData({
          showAdvert: false
        })
      }
    }
  }
})