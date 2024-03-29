/**
 * APIHome API 模块
 * @type {Object}
 */
const APIBanner = require('./api.banner.js')
const APIUser = require('./api.user.js')
const APIBusiness = require('./api.business.js')
const APIOrder = require('./api.order.js')
const APIClassify = require('./api.classify.js')
const APICommon = require('./api.common.js')
const APICity = require('./api.city.js')

module.exports = {
    APIBanner: APIBanner,
    APIUser: APIUser,
    APIBusiness: APIBusiness,
    APIOrder: APIOrder,
    APIClassify: APIClassify,
    APICommon: APICommon,
    APICity: APICity
};