// pages/classify/home/home.js
const app = getApp();
const API = require('../../../api/api.endpoint.js');
let interstitialAd = null;
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    //服务器图片位置
    serverImgUrl: app.globalData.serverImgUrl,
    imgUrl: app.globalData.imgUrl,
    //用户信息
    userInfo: null,
    //页面参数
    toView: 'toView1',
    contentList: [],
    contentListShow: false,
    scrollTo: 0,
    isShowModal: true,
    classifyList: null,
    TabCur: 0,
    subTab: [
      {
        id: 0,
        name: '推荐'
      }, {
        id: 1,
        name: '附近'
      }, {
        id: 2,
        name: '评价'
      }, {
        id: 3,
        name: '人气'
      }],
    subTabCur: 0,
    paramsList: { cidy: '', sort_id: '', sorter_id: '', topmoney: 1, score_fraction: '', score_people: '', later: '', loner: '', page: 1, searcher: '' },
    sorterList: null,
    subNavShow: false,
    subSelectName: '全部',
    loadMore: false
  },
  /*组件生命周期*/
  lifetimes: {
    created() {
      console.log('----------------classify----------------')
      console.log("在组件实例刚刚被创建时执行")
    },
    attached() {
      console.log("在组件实例进入页面节点树时执行")
      if (wx.createInterstitialAd) {
        interstitialAd = wx.createInterstitialAd({ adUnitId: 'adunit-63be1fb43ebfa2e6' })
        interstitialAd.onLoad(() => {
          console.log('onLoad event emit')
        })
        interstitialAd.onError((err) => {
          console.log('onError event emit', err)
        })
        interstitialAd.onClose((res) => {
          console.log('onClose event emit', res)
        })
      }
      this.setData({
        isShowModal: true,
      })
      this.data.classifyList = wx.getStorageSync("classify_list");
      if (this.data.classifyList.length > 1) {
        console.log('判断缓存')
        // if (!this.data.contentListShow) {
        //   this.showClassify();
        // }
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
      }
    },
    ready() {
      console.log("在组件在视图层布局完成后执行")
      console.log(this.data.toView)
      let list = this.data.classifyList;
      let toView = this.data.toView;
      // console.log(toView)
      this.setData({
        classifyList: list
      })
      this.setData({
        toView: toView
      })
      if (app.globalData.dataStatus) {
        this.setData({
          isShowModal: false
        })
        return
      } else {
        this.showClassify();
      }
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
    //页面显示数据前判断
    showClassify(e, f) {
      let that = this;
      if (e != undefined || f != undefined) {
        this.setData({
          toView: e,
          TabCur: f
        })
        console.log(this.data.toView)
      }
      let id = wx.getStorageSync("city_id")
      let location = wx.getStorageSync("userLocation")
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
        that.getSorterList(id);
        that.getContentList(id, location);
      }
    },
    //获取contentList方法
    getContentList(id, location) {
      app.globalData.dataStatus = true;
      let that = this;
      that.setData({
        loadMore: true
      })
      let params = that.data.paramsList;
      params.cidy = id;
      params.sort_id = that.data.toView.substring(that.data.toView.indexOf('w') + 1);
      params.later = location.substring(0, location.indexOf(','));
      params.loner = location.substring(location.indexOf(',') + 1);
      console.log(params, '当前查询参数');
      console.log('推荐商家当前页' + params.page);
      // console.log(params)
      API.APIBusiness.ShopsScreeningList(params).then(d => {
        // console.log(d)
        if (d.data.status == 200) {
          for (var i = 0; i < d.data.list_shops.length; i++) {
            let index = d.data.list_shops[i].address.indexOf('|') + 1;
            let position2 = d.data.list_shops[i].address.substring(index);
            let position1 = d.data.list_shops[i].address.substring(0, index - 1);
            d.data.list_shops[i].address = position1 + position2;
            // d.data.list_shops[i].score_fraction = that.pingfens(parseFloat(d.data.list_shops[i].score_fraction));
          }
          let contentList = that.data.contentList.concat(d.data.list_shops);
          that.setData({
            contentList: contentList,
            contentListShow: true,
            isShow: false,
            isShowModal: false,
            loadMore: false
          })
          // console.log(that.data.contentList[0].score_fraction)
        } else if (d.data.status == 400) {
          console.log('无数据')
          interstitialAd.show().catch((err) => {
            console.error(err)
          })
          that.setData({
            isShow: true,
            isLoad: false,
            bgColor: 'bg-white',
            loadMore: false,
            isShowModal: false
          })
        }
      }).catch(e => {
        app.showTips(e);
      });
    },
    //获取sorterList方法
    getSorterList(city_id) {
      let sort_id = this.data.toView.substring(this.data.toView.indexOf('w') + 1);
      let params = {};
      params.sort_id = sort_id;
      params.city_id = city_id;
      console.log(params, '一级分类和城市id')
      API.APIBusiness.SorterQueryAll(params).then(d => {
        // console.log(d)
        if (d.data.code == 200) {
          this.setData({
            sorterList: d.data.list_sorter
          })
        }
      })
    },
    //上拉加载更多
    loadMore: function () {
      let that = this;
      if (that.data.loadMore) {
        app.showTips('拼命加载中')
        return
      } else {
        let list = that.data.paramsList;
        list.page += 1;
        this.setData({
          isShow: true,
          paramsList: list,
          bgColor: '',
          isLoad: true,
          // isShowModal: true
        })
        that.showClassify()
      }
    },
    //一级分类点击
    tabSelect(e) {
      let that = this;
      let id = e.target.id;
      let item_id = e.target.dataset.id;
      let list = this.data.paramsList;
      list.sorter_id = '';
      list.page = 1;
      if (this.data.sorterList === null) {
        app.showTips('网络错误')
        return
      }
      that.setData({
        toView: id,
        TabCur: item_id,
        contentList: [],
        isShow: false,
        paramsList: list,
        subSelectName: that.data.sorterList[0].sorter_name,
        isShowModal: true
      })
      this.showClassify();
    },
    //二级分类点击
    subNavOpen(e) {
      let sorter_id = e.target.dataset.id == 0 ? '' : e.target.dataset.id;
      let sorter_name = e.target.dataset.name;
      if (sorter_id != undefined) {
        let list = this.data.paramsList;
        list.sorter_id = sorter_id;
        list.page = 1;
        this.setData({
          paramsList: list,
          contentList: [],
          isShow: false,
          subSelectName: sorter_name,
          isShowModal: true
        })
        this.showClassify();
      }
      let subNavShow = !this.data.subNavShow;
      this.setData({
        subNavShow: subNavShow
      })
    },
    //特殊条件查询
    subNavSelect(e) {
      let id = e.target.dataset.id
      let paramsList = this.data.paramsList;
      paramsList.page = 1;
      if (id == 0) {
        paramsList.topmoney = 1;
        paramsList.score_fraction = '';
        paramsList.score_people = ''
      } else if (id == 1) {
        paramsList.topmoney = '';
        paramsList.score_fraction = '';
        paramsList.score_people = ''
      } else if (id == 2) {
        paramsList.topmoney = '';
        paramsList.score_fraction = 1;
        paramsList.score_people = '';
      } else if (id == 3) {
        paramsList.topmoney = '';
        paramsList.score_fraction = '';
        paramsList.score_people = 1;
      }
      this.setData({
        paramsList: paramsList,
        subTabCur: e.target.dataset.id,
        contentList: [],
        isShow: false,
        isShowModal: true
      })
      this.showClassify()
    },
    toChild(e) {
      let id = e.currentTarget.id;
      wx.navigateTo({
        url: "/pages/business/businessInfo/businessInfo?id=" + id
      })
    }
  }
})