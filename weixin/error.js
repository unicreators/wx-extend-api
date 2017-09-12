//////////////////////////////
///  yichen

module.exports = class WeixinApiError extends Error {
    constructor(errcode, errmsg) {
        super();
        this.errcode = errcode;
        this.errmsg = errmsg;
    }
};