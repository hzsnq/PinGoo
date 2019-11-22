// pages/admin/businessPackageEdit/businessPackageEdit.js
const app = getApp();
const API = require('../../../api/api.endpoint.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    isShowModal: true,
    packagesId: 0,
    //商家实照
    shopImgListGlobalData: [],
    //套餐详情
    packagesListGlobalData: [],
    //商家信息
    formData: { packageName: '', packagePrice: '', packageGroupPrice: '', startTime: '', endTime: '', packageBespeak: '' },
    //不可用日期
    dateList: [{
      text: "周末法定节假日通用",
      click: false
    }, {
      text: "春节期间不可用",
      click: false
    }, {
      text: "法定节假日不可用",
      click: false
    }, {
      text: "周末不可用",
      click: false
    }],
    //适合范围
    changeList: [{
      text: "全场通用",
      click: false
    }, {
      text: "酒水除外",
      click: false
    }, {
      text: "特价商品除外",
      click: false
    }, {
      text: "不与其他优惠并用",
      click: false
    }, {
      text: "需提前两小时预约",
      click: false
    }],
    //可叠加
    repeats: true,
    //免预约
    bespeak: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(util.formatTimeYear(new Date));
    let startTime = util.formatTimeYear(new Date);
    let endTime = util.formatTimeYear(new Date);
    let formData = this.data.formData;
    this.setData({
      packagesId: options.id
    })
    if (options.id != '') {
      this.getAll(options.id)
    } else {
      formData.startTime = startTime;
      formData.endTime = endTime;
      this.setData({
        isShowModal: false,
        formData: formData
      })
    }
  },
  //获取全部数据
  getAll: function (id) {
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
      params.id = id;
      API.APIBusiness.PackagesLookId(params).then(d => {
        console.log(d)
        if (d.statusCode == 200) {
          //把商家实照放入全局图片列表
          app.globalData.shopImgList = [];
          for (let i = 0; i < d.data.list_packageImage.length; i++) {
            let extraLine = {
              imgTitle: d.data.list_packageImage[i].introduce,
              imgPath: d.data.list_packageImage[i].image,
              imgId: d.data.list_packageImage[i].id
            };
            app.globalData.shopImgList.push(extraLine);
          }
          //把套餐信息放在全局list里
          app.globalData.packagesList = [];
          let list_packageContent = d.data.list_packageContent;
          for (let i = 0; i < list_packageContent.length; i++) {
            let extraLine = {
              packageName: list_packageContent[i].content_name,
              packageNum: list_packageContent[i].number,
              packageMoney: list_packageContent[i].price,
              packageId: list_packageContent[i].id
            };
            app.globalData.packagesList.push(extraLine)
          }
          //循环商家不可用日期
          let dateList = this.data.dateList;
          let disabled = d.data.packages.disabled.split(',')
          for (let i = 0; i < dateList.length; i++) {
            for (let j = 0; j < disabled.length; j++) {
              if (dateList[i].text == disabled[j]) {
                dateList[i].click = true
              }
            }
          }
          //循环商家适合范围
          let changeList = this.data.changeList;
          let ranges = d.data.packages.ranges.split(',')
          for (let i = 0; i < changeList.length; i++) {
            for (let j = 0; j < ranges.length; j++) {
              if (changeList[i].text == ranges[j]) {
                changeList[i].click = true
              }
            }
          }
          //可叠加  免预约
          let repeats = d.data.packages.repeats == 0 ? false : true;
          //免预约
          let bespeak = d.data.packages.bespeak == 0 ? false : true;
          //把套餐信息放入formData中
          let formData = this.data.formData;
          formData = {
            packageName: d.data.packages.package_name,
            packagePrice: d.data.packages.money,
            packageGroupPrice: d.data.packages.money_single,
            startTime: d.data.packages.validitytime,
            endTime: d.data.packages.validitytimes,
            packageBespeak: d.data.packages.yuyue,
          }
          this.setData({
            shopImgListGlobalData: app.globalData.shopImgList,
            packagesListGlobalData: app.globalData.packagesList,
            dateList: dateList,
            changeList: changeList,
            repeats: repeats,
            bespeak: bespeak,
            formData: formData,
            isShowModal: false,
          })
        }
      }).catch(f => {
        console.log(f)
      })
    }
  },
  //点击切换
  click: function (e) {
    let index = e.currentTarget.dataset.index;
    let name = e.currentTarget.dataset.name;
    let date = this.data.dateList;
    let change = this.data.changeList;
    if (name == 'date') {
      date[index].click = !date[index].click;
    } else {
      change[index].click = !change[index].click;
    }
    this.setData({
      dateList: date,
      changeList: change
    })
  },
  //免预约 可叠加
  changeState: function (e) {
    let name = e.currentTarget.dataset.name;
    let repeats = this.data.repeats;
    //免预约
    let bespeak = this.data.bespeak;
    if (name == 'repeats') {
      repeats = !repeats;
    } else {
      bespeak = !bespeak;
    }
    this.setData({
      repeats: repeats,
      bespeak: bespeak
    })
  },
  //编辑套餐图片
  toUpload: function (e) {
    let imgId = e.currentTarget.dataset.index == undefined ? 0 : e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/admin/businessImgUpload/businessImgUpload?id=' + imgId
    })
  },
  //添加套餐信息
  toAddPackages: function (e) {
    let id = e.currentTarget.dataset.index == undefined ? 0 : e.currentTarget.dataset.index;
    console.log(id)
    wx.navigateTo({
      url: '/pages/admin/businessAddPackagesInfo/businessAddPackagesInfo?id=' + id
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
    if (itemName == 'packageName') {
      formData.packageName = itemData;
    } else if (itemName == 'packagePrice') {
      formData.packagePrice = itemData;
    } else if (itemName == 'packageGroupPrice') {
      formData.packageGroupPrice = itemData;
    } else if (itemName == 'packageBespeak') {
      formData.packageBespeak = itemData;
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
          if (submitArr.includes("") || submitArr.includes(undefined) || submitArr.includes(null) || app.globalData.shopImgList.length == 0 || app.globalData.packagesList.length == 0) {
            app.showTips('您还有内容没填写哦!')
            return
          } else {
            that.setData({
              isShowModal: true
            })
            that.packageChange()
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
  //添加或更改套餐信息
  packageChange: function () {
    console.log('-----------------开始改变或上传套餐信息-----------------');
    let muser_id = wx.getStorageSync("muser_key");
    let formData = this.data.formData;
    let id = this.data.packagesId;
    let uploadImgList = app.globalData.shopImgList;
    let packagesList = app.globalData.packagesList;
    let repeats = this.data.repeats ? 1 : 0;
    let bespeak = this.data.bespeak ? 1 : 0;
    let addTime = util.formatTimeYear(new Date);
    //设置套餐图片,套餐内容上传形式
    let image = new Array();
    for (let i = 0; i < uploadImgList.length; i++) {
      image += uploadImgList[i].imgPath + 'a' + uploadImgList[i].imgTitle + ',';
    }
    let content = new Array();
    for (var i = 0; i < packagesList.length; i++) {
      content += packagesList[i].packageName + 'a' + packagesList[i].packageNum + 'b' + packagesList[i].packageMoney + ',';
    }
    //循环商家不可用日期和适合范围
    let dateList = this.data.dateList;
    let date = '';
    for (let i = 0; i < dateList.length; i++) {
      if (dateList[i].click) {
        date += dateList[i].text + ',';
      }
    }
    let changeList = this.data.changeList;
    let change = '';
    for (let i = 0; i < changeList.length; i++) {
      if (changeList[i].click) {
        change += changeList[i].text + ',';
      }
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
      params.id = id;
      params.muser_id = muser_id;
      params.package_name = formData.packageName;
      params.money = formData.packagePrice;
      params.money_single = formData.packageGroupPrice;
      params.money_many = formData.packageGroupPrice;
      params.people_max = 1;
      params.repeats = repeats;
      params.bespeak = bespeak;
      params.validitytime = formData.startTime;
      params.validitytimes = formData.endTime;
      params.disabled = date;
      params.ranges = change;
      params.people_min = 1;
      params.state = 2;
      params.addtime = addTime;
      params.image = image;
      params.package_content = content;
      params.yuyue = formData.packageBespeak;
      // console.log(params, '提交信息');
      if (this.data.packagesId != '') {
        console.log('update')
        API.APIBusiness.PackagesEdit(params).then(d => {
          if (d.statusCode == 200) {
            this.setData({
              isShowModal: false
            })
            app.showTips('修改成功');
            wx.navigateBack({
              delta: 1
            })
          }
        })
      } else {
        API.APIBusiness.PackagesAdd(params).then(d => {
          if (d.statusCode == 200) {
            this.setData({
              isShowModal: false
            })
            app.showTips('添加成功');
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
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
    this.setData({
      packagesListGlobalData: app.globalData.packagesList,
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
    app.globalData.packagesList = [];
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