const _promise = require('../libs/promise/es6-promise.min.js');

/**
 * 抓取远端API的结构
 * @param  {String} api    api 根地址
 * @param  {String} path   请求路径
 * @param  {Object} params 参数
 * @return {Promise}       包含抓取任务的Promise
 */

module.exports = function (api, path, params) {
    return new _promise((resolve, reject) => {

        function appNetworkResponseResolve(response) {
            resolve(response);
        }

        function appNetworkResponseReject(response) {
            console.log('大事不好了');
            console.log(response)
            {
                if (response.data && response.data.data) {
                    reject(response);
                }
            }
        }

        let headers = {};

        headers['Content-Type'] = 'application/x-www-form-urlencoded';

        if (params == undefined) {
            params = {};
        }

        let data = params;

        if (api.charAt(api.length - 1) == '/') {
            api = api.substr(0, api.length - 1);
        }
        if (path.charAt(0) == '/') {
            path = path.substr(1, path.length - 1);
        }

        if (data) {
            wx.request({
                url: `${api}/${path}`,
                method: 'POST',
                data: Object.assign(data),
                header: headers,
                success: appNetworkResponseResolve,
                fail: appNetworkResponseReject
            });
        }
        else {
            wx.request({
                url: `${api}/${path}`,
                method: 'POST',
                header: headers,
                success: appNetworkResponseResolve,
                fail: appNetworkResponseReject
            });
        }

    })
}
