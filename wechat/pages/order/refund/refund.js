// pages/order/refund/refund.js
const API = require('../../../api/api.endpoint.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
      text: "预约不上"
    }, {
      text: "商家营业但不接待"
    }, {
      text: "店里活动更优惠"
    }, {
      text: "商家停业/装修/转让"
    }, {
      text: "去过了，不太满意"
    }, {
      text: "朋友/网上评价不好"
    }, {
      text: "买多了/买错了"
    }, {
      text: "计划有变，没时间消费"
    }, {
      text: "后悔了，不想要了"
    }, {
      text: "联系不上商家"
    }],
    text: '',
    insertList: [],
    id: '',
    isShowModal: false
  },
  //添加退单信息
  insertItem: function (e) {
    let list = JSON.stringify(this.data.insertList);
    if (this.data.insertList.length == 0) {
      app.showTips('请选择退款理由')
      return
    } else {
      console.log(list);
      this.setData({
        isShowModal: true
      })
      let params = {};
      params.tuidan = list;
      params.id = this.data.id;
      API.APIOrder.FightTui(params).then(d => {
        if (d.statusCode == 200) {
          this.setData({
            isShowModal: false
          })
          app.showTips(d.data.msg);
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 2000);
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
  },

  checkItem: function (e) {
    let that = this;
    let item = e.detail.value;
    let id = e.currentTarget.id;
    if (item.length != 0) {
      let list = that.data.insertList;
      list.push({
        item,
        id
      });
      that.setData({
        insertList: list,
      })
    } else {
      let index = that.data.insertList.indexOf(id);
      that.data.insertList.splice(index, 1);
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