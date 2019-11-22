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

module.exports = {
    FightListUserid: FightListUserid,
    FightListUse: FightListUse,
    FightUserCoupon: FightUserCoupon,
    FightUserList: FightUserList
};