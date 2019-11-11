const CONFIG = require('./../config/config.js');

const fetch = require('./fetch');

function CityName(params) {
    return fetch(CONFIG.API_HOST, 'CityName', params);
}

function CityAll(params) {
    return fetch(CONFIG.API_HOST, 'CityAll', params);
}

module.exports = {
    CityName: CityName,
    CityAll: CityAll
};