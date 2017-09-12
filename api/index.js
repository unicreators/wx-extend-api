//////////////////////////////
///  yichen

const Api = require('./api'), ApiExtend = require('./api-extend');
module.exports = Object.assign(Api, { Api, ApiExtend }, require('./error'));

