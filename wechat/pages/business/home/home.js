// pages/business/home/home.js
const app = getApp();
const API = require('../../../api/api.endpoint.js');
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    // 系统参数
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    //服务器图片位置
    serverImgUrl: app.globalData.serverImgUrl,
    imgUrl: app.globalData.imgUrl,
    //用户信息
    userInfo: null,
    //页面参数
    contentList: [],
    defaultImg: 'https://iqqia.com/wximage/index_banner1.png',
    swiperList: [],
    scrollTo: 0,
    isShowModal: false,
    classifyList: null,
    pageNum: 1,
    bgColor: '',
    isShow: false,
    isLoad: true,
    contentListShow: false,
    loadMore: false,
    cityName: app.globalData.cityName,
    //判断如何加载
    contentLoad: false,
    showAdvert: true
  },
  /*组件生命周期*/
  lifetimes: {
    created() {
      console.log('----------------business----------------')
      console.log("在组件实例刚刚被创建时执行")
    },
    attached() {
      console.log("在组件实例进入页面节点树时执行")
      this.setData({
        isShowModal: true,
      })
      this.data.classifyList = wx.getStorageSync("classify_list");
      if (this.data.classifyList.length > 1) {
        // console.log(this.data.classifyList)
        console.log('判断缓存')
        API.APIBanner.getBannerList().then(d => {
          // console.log(d)
          if (d.data.code == 200) {
            if (d.data.list_banner.length == 0) {
              let url = [{ cover: this.data.defaultImg }]
              this.setData({
                swiperList: url
              })
            } else {
              this.setData({
                swiperList: d.data.list_banner
              })
            }
          }
        }).catch(e => {
          this.setData({
            isShowModal: false
          })
          app.showTips('出错啦' + e);
        });
        this.showBusiness()
      } else {
        API.APIBusiness.SortQueryAll().then(d => {
          // console.log(d)
          if (d.data.code == 200) {
            this.setData({
              classifyList: d.data.list_sort
            })
            wx.setStorageSync("classify_list", d.data.list_sort);
          }
        }).catch(e => {
          this.setData({
            isShowModal: false
          })
          app.showTips('出错啦' + e);
        });
        API.APIBanner.getBannerList().then(d => {
          // console.log(d)
          if (d.data.code == 200) {
            if (d.data.list_banner.length == 0) {
              let url = [{ cover: this.data.defaultImg }]
              this.setData({
                swiperList: url
              })
            } else {
              this.setData({
                swiperList: d.data.list_banner
              })
            }
          }
        }).catch(e => {
          this.setData({
            isShowModal: false
          })
          app.showTips('出错啦' + e);
        });
        this.showBusiness()
      }
    },
    ready() {
      console.log("在组件在视图层布局完成后执行")
      let list = this.data.classifyList;
      this.setData({
        classifyList: list
      })
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
    loadMore: function () {
      let that = this;
      if (that.data.loadMore) {
        app.showTips('拼命加载中')
        return
      } else {
        let pageNum = that.data.pageNum + 1
        this.setData({
          isShow: true,
          pageNum: pageNum,
          bgColor: '',
          isLoad: true,
          contentLoad: true
        })
        that.showBusiness()
      }
    },
    cardSwiper(e) {
      this.setData({
        cardCur: e.detail.current
      })
    },
    showBusiness() {
      let that = this;
      let id = wx.getStorageSync("city_id")
      let location = wx.getStorageSync("userLocation")
      let cname = wx.getStorageSync("city_name")
      if (id === null || location === null) {
        console.log(id, location, '获取位置失败')
        that.setData({
          isShow: true,
          isLoad: false,
          bgColor: 'bg-white',
          isShowModal: false
        })
        app.showTips('获取位置失败')
      } else if (id === '' || location === '') {
        console.log('无缓存，显示提示信息')
        that.setData({
          isShow: true,
          isLoad: false,
          bgColor: 'bg-white',
          isShowModal: false
        })
        app.showTips('获取位置失败')
      }
      else {
        console.log(id, location, '获取位置成功')
        that.setData({
          cityName: cname
        })
        // console.log(that.data.contentList.length, '数组长度')
        that.getContentList(id, location);
      }
    },
    getContentList(id, location) {
      app.globalData.dataStatus = true;
      let that = this;
      that.setData({
        loadMore: true
      })
      let params = {};
      params.city = id;
      params.lon = location.substring(0, location.indexOf(','));
      params.lat = location.substring(location.indexOf(',') + 1);
      params.page = that.data.pageNum;
      console.log('推荐商家当前页' + params.page)
      // console.log(params)
      API.APIBusiness.ShopsRecommendList(params).then(d => {
        if (d.data.status == 200) {
          for (var i = 0; i < d.data.list_shops.length; i++) {
            let index = d.data.list_shops[i].address.indexOf('|') + 1;
            let position2 = d.data.list_shops[i].address.substring(index);
            let position1 = d.data.list_shops[i].address.substring(0, index - 1);
            d.data.list_shops[i].address = position1 + position2;
          }
          let contentList = that.data.contentList
          if (that.data.contentLoad) {
            contentList = contentList.concat(d.data.list_shops);
          } else {
            contentList = d.data.list_shops;
          }
          that.setData({
            contentList: contentList,
            contentListShow: true,
            isShow: false,
            isShowModal: false,
            loadMore: false,
            contentLoad: false,
          })
          // console.log(that.data.contentList[0].score_fraction)
        } else if (d.data.status == 400) {
          setTimeout(function () {
            that.setData({
              isShow: true,
              isLoad: false,
              bgColor: 'bg-white',
              loadMore: false,
              isShowModal: false,
              contentLoad: false,
            })
          }, 1000)
        }
      }).catch(e => {
        app.showTips(e);
      });
    },
    goToClassify(e) {
      let page_cur = 'classify';
      let id = e.target.id;
      let item_id = e.target.dataset.id;
      wx.redirectTo({
        url: "/pages/index/index?id=" + id + '&page_cur=' + page_cur + '&item_id=' + item_id
      })
    },
    toSelectCity() {
      wx.navigateTo({
        url: "/pages/business/selectCity/selectCity"
      })
    },
    toSearch() {
      wx.navigateTo({
        url: "/pages/business/search/search"
      })
    },
    toChild(e) {
      let id = e.currentTarget.id;
      wx.navigateTo({
        url: "/pages/business/businessInfo/businessInfo?id=" + id
      })
    },
    toView() {
      if (app.isLogin()) {
        console.log('登陆啦')
      } else {
        app.login();
        return
      }
      wx.navigateTo({
        url: "/pages/about/recommend/recommend"
      })
    },
    toMessage() {
      if (app.isLogin()) {
        console.log('登陆啦')
      } else {
        app.login();
        return
      }
      wx.navigateTo({
        url: "/pages/about/message/message"
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