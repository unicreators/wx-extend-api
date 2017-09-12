//////////////////////////////
///  yichen

const request = require('request-promise-native');
const { ExtendTypeError, ArgumentError } = require('./error');

module.exports = class Api {

    constructor($extends = undefined) {

        this.extends = {};
        let _extends = $extends || {};

        Object.keys(_extends).forEach(function (name) {
            let extend = _extends[name] || {};
            extend = (extend instanceof Function) ?
                { type: extend } :
                { type: extend.type, opts: extend.opts };
            this.extend(name, extend.type, extend.opts);
        }, this);
    }

    extend(name, Extend, opts = undefined) {
        if (typeof name !== 'string' || (name = name.trim()).length == 0)
            throw new ArgumentError('name', `'name' must be non-empty string.`);
        if (Extend == undefined || (Extend.prototype instanceof ExtendType) == false)
            throw new ExtendTypeError(`'Extend' must extend ApiExtend.`);
        let extend = new Extend(this, opts);
        extend.exports = Extend;
        this[name] = this.extends[name] = extend;
    }

    /// virtual
    async buildApiReqOpts(extendInvokeOpts) { return extendInvokeOpts; }
    async afterInvoke(result, reqOpts) { return result; }

    /// virtual
    normalizeOpts(url, opts, method = 'GET') {
        // default
        let defOpts = { json: true };
        return Object.assign(defOpts, opts, { url, method });
    }

    ////////////////////////////////////////
    ///
    /// url
    ///
    /// opts (see: https://github.com/request/request#requestoptions-callback)  
    /// 
    /// method (default 'GET')
    ///
    async invoke(url, opts, method = 'GET') {
        let extendInvokeOpts = this.normalizeOpts(url, opts, method);
        let reqOpts = (await this.buildApiReqOpts(extendInvokeOpts)) || extendInvokeOpts;
        let result = await request(reqOpts);
        return this.afterInvoke ? (await this.afterInvoke(result, reqOpts)) : result;
    }






};


/// warn: 循环引用 必须在 Api exports 之后 require
const ExtendType = require('./api-extend');


