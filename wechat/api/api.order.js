const CONFIG = require('./../config/config.js');

const fetch = require('./fetch');

// 用户拼单订单
function FightListUserid(params) {
    return fetch(CONFIG.API_HOST, 'FightListUserid', params);
}

//用户拼单订单成员
function FightUserList(params) {
    return fetch(CONFIG.API_HOST, 'FightUserList', params);
}

//查看劵码 
function FightUserCoupon(params) {
    return fetch(CONFIG.API_HOST, 'FightUserCoupon', params);
}

//用户的订单
function FightListUse(params) {
    return fetch(CONFIG.API_HOST, 'FightListUse', params);
}

//退订单
function FightTui(params) {
    return fetch(CONFIG.API_HOST, 'FightTui', params);
}

//验证
function ShopsFightVerification(params) {
    return fetch(CONFIG.API_HOST, 'ShopsFightVerification', params);
}

//评论
function EvaluateQueryIds(params) {
    return fetch(CONFIG.API_HOST, 'EvaluateQueryIds', params);
}

//评论准备
function EvaluatePre(params) {
    return fetch(CONFIG.API_HOST, 'EvaluatePre', params);
}

//评论添加
function EvaluateAdd(params) {
    return fetch(CONFIG.API_HOST, 'EvaluateAdd', params);
}

module.exports = {
    FightListUserid: FightListUserid,
    FightListUse: FightListUse,
    FightUserCoupon: FightUserCoupon,
    FightUserList: FightUserList,
    FightTui: FightTui,
    ShopsFightVerification: ShopsFightVerification,
    EvaluateQueryIds: EvaluateQueryIds,
    EvaluatePre: EvaluatePre,
    EvaluateAdd: EvaluateAdd
};