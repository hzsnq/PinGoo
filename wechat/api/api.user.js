const CONFIG = require('./../config/config.js');

const fetch = require('./fetch');

/**
 * 获取列表类型的数据
 * @return {Promise}       包含抓取任务的Promise
 */

function wxLogin(params) {
    return fetch(CONFIG.API_HOST, 'UserWx', params);
}

module.exports = { wxLogin };