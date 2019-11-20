const CONFIG = require('./../config/config.js');

const fetch = require('./fetch');

/**
 * 获取列表类型的数据
 * @return {Promise}       包含抓取任务的Promise
 */
//查询分类接口
function SortQueryAll(params) {
    return fetch(CONFIG.API_HOST, 'SortQueryAll', params);
}

//查询子分类接口
function SorterQueryAll(params) {
    return fetch(CONFIG.API_HOST, 'SorterQueryAll', params);
}

//首页商家列表
function ShopsRecommendList(params) {
    return fetch(CONFIG.API_HOST, 'ShopsRecommendList', params);
}

//商家分类列表
function ShopsScreeningList(params) {
    return fetch(CONFIG.API_HOST, 'ShopsScreeningList', params);
}
//随机推荐商家
function ShopsRandomList(params) {
    return fetch(CONFIG.API_HOST, 'ShopsRandomList', params);
}

//商家详情
function ShopsQueryId(params) {
    return fetch(CONFIG.API_HOST, 'ShopsQueryId', params);
}

//查询商家优惠券
function CouponSee(params) {
    return fetch(CONFIG.API_HOST, 'CouponSee', params);
}
//查询商家套餐
function PackagesSee(params) {
    return fetch(CONFIG.API_HOST, 'PackagesSee', params);
}
//关键字查询商家
function ShopsSearchList(params) {
    return fetch(CONFIG.API_HOST, 'ShopsSearchList', params);
}
//举报商家
function ReportAdd(params) {
    return fetch(CONFIG.API_HOST, 'ReportAdd', params);
}
//收藏商家
function CollectionEdit(params) {
    return fetch(CONFIG.API_HOST, 'CollectionEdit', params);
}

//确认订单信息
function CouponFightId(params) {
    return fetch(CONFIG.API_HOST, 'CouponFightId', params);
}

//用户拼单接口
function FightAdd(params) {
    return fetch(CONFIG.API_HOST, 'FightAdd', params);
}

//用户下单
function xiadan(params) {
    return fetch(CONFIG.API_HOST, 'xiadan', params);
}

//获取用户评论
function IdsEvaluateList(params) {
    return fetch(CONFIG.API_HOST, 'IdsEvaluateList', params);
}

//获取用户评论
function ShopsEvaluateList(params) {
    return fetch(CONFIG.API_HOST, 'ShopsEvaluateList', params);
}

//添加商家
function ShopsEnter(params) {
    return fetch(CONFIG.API_HOST, 'ShopsEnter', params);
}

//商家登录后台
function MuserLogin(params) {
    return fetch(CONFIG.API_HOST, 'MuserLogin', params);
}

//商家信息
function MuserLoginInfo(params) {
    return fetch(CONFIG.API_HOST, 'MuserLoginInfo', params);
}

//商家模糊查询劵码内容接口
function ShopsFightLooker(params) {
    return fetch(CONFIG.API_HOST, 'ShopsFightLooker', params);
}

//验证记录查询
function ShopsFightVerificationRecord(params) {
    return fetch(CONFIG.API_HOST, 'ShopsFightVerificationRecord', params);
}

// 商家积分充值
function ShopsIntegralRecharge(params) {
    return fetch(CONFIG.API_HOST, 'ShopsIntegralRecharge', params);
}

// 商家账户明细
function ShopsMoneydList(params) {
    return fetch(CONFIG.API_HOST, 'ShopsMoneydList', params);
}

//商家收藏
function CollectionShopsAll(params) {
    return fetch(CONFIG.API_HOST, 'CollectionShopsAll', params);
}

//商家查看评价列表
function EvaluateList(params) {
    return fetch(CONFIG.API_HOST, 'EvaluateList', params);
}

//商家资金
function ShopsMoney(params) {
    return fetch(CONFIG.API_HOST, 'ShopsMoney', params);
}

//资金详情
function ShopsMoneyS(params) {
    return fetch(CONFIG.API_HOST, 'ShopsMoneyS', params);
}

//商家编辑查询
function ShopsLookId(params) {
    return fetch(CONFIG.API_HOST, 'ShopsLookId', params);
}

//商家优惠券查询
function CouponQueryAll(params) {
    return fetch(CONFIG.API_HOST, 'CouponQueryAll', params);
}

//商家删除优惠券
function CouponDelId(params) {
    return fetch(CONFIG.API_HOST, 'CouponDelId', params);
}

//上下架优惠券
function CouponShelves(params) {
    return fetch(CONFIG.API_HOST, 'CouponShelves', params);
}

//商家套餐查询
function PackagesQueryAll(params) {
    return fetch(CONFIG.API_HOST, 'PackagesQueryAll', params);
}

//商家删除套餐
function PackagesDelId(params) {
    return fetch(CONFIG.API_HOST, 'PackagesDelId', params);
}

//上下架套餐
function PackageShelves(params) {
    return fetch(CONFIG.API_HOST, 'PackageShelves', params);
}

module.exports = {
    SortQueryAll: SortQueryAll,
    ShopsRecommendList: ShopsRecommendList,
    ShopsScreeningList: ShopsScreeningList,
    SorterQueryAll: SorterQueryAll,
    ShopsRandomList: ShopsRandomList,
    ShopsQueryId: ShopsQueryId,
    CouponSee: CouponSee,
    PackagesSee: PackagesSee,
    ShopsSearchList: ShopsSearchList,
    ReportAdd: ReportAdd,
    CollectionEdit: CollectionEdit,
    CouponFightId: CouponFightId,
    FightAdd: FightAdd,
    xiadan: xiadan,
    IdsEvaluateList: IdsEvaluateList,
    ShopsEvaluateList: ShopsEvaluateList,
    ShopsEnter: ShopsEnter,
    MuserLogin: MuserLogin,
    MuserLoginInfo: MuserLoginInfo,
    ShopsFightLooker: ShopsFightLooker,
    ShopsFightVerificationRecord: ShopsFightVerificationRecord,
    ShopsIntegralRecharge: ShopsIntegralRecharge,
    ShopsMoneydList: ShopsMoneydList,
    CollectionShopsAll: CollectionShopsAll,
    EvaluateList: EvaluateList,
    ShopsMoney: ShopsMoney,
    ShopsMoneyS: ShopsMoneyS,
    ShopsLookId: ShopsLookId,
    CouponQueryAll: CouponQueryAll,
    CouponDelId: CouponDelId,
    CouponShelves: CouponShelves,
    PackagesQueryAll: PackagesQueryAll,
    PackageShelves: PackageShelves,
    PackagesDelId: PackagesDelId
};