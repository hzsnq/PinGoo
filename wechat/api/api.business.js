const CONFIG = require('./../config/config.js');

const fetch = require('./fetch');

/**
 * 获取列表类型的数据
 * @return {Promise}       包含抓取任务的Promise
 */

function SortQueryAll(params) {
    return fetch(CONFIG.API_HOST, 'SortQueryAll', params);
}

function SorterQueryAll(params) {
    return fetch(CONFIG.API_HOST, 'SorterQueryAll', params);
}

function ShopsRecommendList(params) {
    return fetch(CONFIG.API_HOST, 'ShopsRecommendList', params);
}

function ShopsScreeningList(params) {
    return fetch(CONFIG.API_HOST, 'ShopsScreeningList', params);
}

module.exports = {
    SortQueryAll: SortQueryAll,
    ShopsRecommendList: ShopsRecommendList,
    ShopsScreeningList: ShopsScreeningList,
    SorterQueryAll: SorterQueryAll
};