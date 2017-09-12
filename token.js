//////////////////////////////
///  yichen

const request = require('request-promise-native');

const URL = { TOKEN: { url: 'https://api.weixin.qq.com/cgi-bin/token' } };

const _fn_ensureToken = Symbol('Token#ensureToken'),
    _timeout_id = Symbol('Token#timeoutId'),
    _storedToken = Symbol('Token#storedToken');

module.exports = class Token {
    
    constructor(api) { this.api = api; }

    async ensure() {
        if (this[_storedToken] == undefined
            || this[_storedToken].expire < Date.now()) {

            let qs = { grant_type: 'client_credential', appid: this.api.appId, secret: this.api.appSecret };
            let { access_token, expires_in } = await request({ url: URL.TOKEN.url, qs, method: 'GET', json: true });

            let expireMilliseconds = (expires_in * 1000);
            this[_storedToken] = { token: access_token, expire: Date.now() + expireMilliseconds };

            if (this[_timeout_id]) { clearTimeout(this[_timeout_id]); delete this[_timeout_id]; }
            this[_timeout_id] = setTimeout(async function (self) { await self.ensure(); }, expireMilliseconds, this);
        }

        return this[_storedToken].token;
    }

    async refresh() {
        this[_storedToken] = undefined;
        return await this.ensure();
    }

};

