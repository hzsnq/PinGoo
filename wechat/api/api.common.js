const CONFIG = require('./../config/config.js');

const fetch = require('./fetch');

/**
 * 获取列表类型的数据
 * @return {Promise}       包含抓取任务的Promise
 */

function cityName(params) {
    return fetch(CONFIG.API_HOST, 'CityName', params);
}

//支付宝账号查询
function AliPayExtract(params) {
    return fetch(CONFIG.API_HOST, 'AliPayExtract', params);
}
//商家收入余额提现
function MuserExtractAliPay(params) {
    return fetch(CONFIG.API_HOST, 'MuserExtractAliPay', params);
}
module.exports = {
    cityName: cityName,
    AliPayExtract: AliPayExtract,
    MuserExtractAliPay: MuserExtractAliPay
};