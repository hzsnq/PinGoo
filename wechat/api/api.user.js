const CONFIG = require('./../config/config.js');

const fetch = require('./fetch');

/**
 * 获取列表类型的数据
 * @return {Promise}       包含抓取任务的Promise
 */

//用户登录
function wxLogin(params) {
    return fetch(CONFIG.API_HOST, 'UserWx', params);
}

//查询用户全部收藏商家
function CollectionQueryAll(params) {
    return fetch(CONFIG.API_HOST, 'CollectionQueryAll', params);
}

//获取用户收藏数，红包等信息
function UserInfo(params) {
    return fetch(CONFIG.API_HOST, 'UserInfo', params);
}

//用户删除收藏
function CollectionDel(params) {
    return fetch(CONFIG.API_HOST, 'CollectionDel', params);
}

//用户提现信息
function UserMoney(params) {
    return fetch(CONFIG.API_HOST, 'UserMoney', params);
}

//用户邀请规则
function UserLoginCheck(params) {
    return fetch(CONFIG.API_HOST, 'UserLoginCheck', params);
}

//用户消息
function UserPushList(params) {
    return fetch(CONFIG.API_HOST, 'UserPushList', params);
}

//用户提交意见
function OpinionUser(params) {
    return fetch(CONFIG.API_HOST, 'OpinionUser', params);
}

//用户红包
function UserRedList(params) {
    return fetch(CONFIG.API_HOST, 'UserRedList', params);
}
//用户积分
function UserIntegraldList(params) {
    return fetch(CONFIG.API_HOST, 'UserIntegraldList', params);
}

module.exports = {
    wxLogin: wxLogin,
    CollectionQueryAll: CollectionQueryAll,
    UserInfo: UserInfo,
    CollectionDel: CollectionDel,
    UserMoney: UserMoney,
    UserLoginCheck: UserLoginCheck,
    UserPushList: UserPushList,
    OpinionUser: OpinionUser,
    UserRedList: UserRedList,
    UserIntegraldList: UserIntegraldList
};