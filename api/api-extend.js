//////////////////////////////
///  yichen

const Api = require('./api');
const { ExtendTypeError } = require('./error');

module.exports = class ApiExtend {

    constructor(api) {
        if ((api instanceof Api) == false)
            throw new ExtendTypeError(`'api' must extend Api.`);
        this.api = api;
    }

    async invoke(url, opts = undefined, method = undefined) {
        if (typeof url == 'string') url = { url };
        if (method != undefined) url = Object.assign(url, { method });
        return await this.api.invoke(url.url, opts, url.method);
    }

};



