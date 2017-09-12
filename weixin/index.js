//////////////////////////////
///  yichen

const { Api, ArgumentError } = require('../api'),
    WeixinToken = require('./token'),
    WeixinApiError = require('./error');

class WeixinApi extends Api {

    constructor(appId, appSecret) {

        if (typeof appId !== 'string' || (appId = appId.trim()).length == 0)
            throw new ArgumentError('appId', `'appId' must be non-empty string.`);
        if (typeof appSecret !== 'string' || (appSecret = appSecret.trim()).length == 0)
            throw new ArgumentError('appSecret', `'appSecret' must be non-empty string.`);

        super(require('./extends'));

        this.appId = appId;
        this.appSecret = appSecret;

        this.weixinToken = new WeixinToken(this);

    }

    // override
    async buildApiReqOpts(extendOpts) {
        let token = await this.weixinToken.ensure();
        extendOpts.qs = Object.assign({ access_token: token }, extendOpts.qs);
        return extendOpts;
    }

    async afterInvoke(result) {
        if (result
            && result.errcode != undefined) {
            // errcode == 0 to true;
            if (result.errcode === 0)
                return true;

            throw new WeixinApiError(result.errcode, result.errmsg);
        }

        return result;
    }

}

module.exports = Object.assign(WeixinApi, { WeixinApi, WeixinApiError }, require('../api'));

