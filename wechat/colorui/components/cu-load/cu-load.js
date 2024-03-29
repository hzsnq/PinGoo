const app = getApp();
Component({
    /**
     * 组件的一些选项
     */
    options: {
        addGlobalClass: true,
        multipleSlots: true
    },
    /**
     * 组件的对外属性
     */
    properties: {
        isLoad: {
            type: [Boolean, String],
            default: false
        },
        isShow: {
            type: [Boolean, String],
            default: false
        },
        bgColor: {
            type: String,
            default: ''
        },
    },
    /**
     * 组件的初始数据
     */
    data: {
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom
    },
    /**
     * 组件的方法列表
     */
    methods: {
    }
})