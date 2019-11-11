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

module.exports = {
    wxLogin: wxLogin,
    CollectionQueryAll: CollectionQueryAll,
    UserInfo: UserInfo,
    CollectionDel: CollectionDel
};