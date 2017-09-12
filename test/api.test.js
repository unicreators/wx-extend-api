const { server_url } = require('./server.mock');
const assert = require('assert');

const { Api, ApiExtend, ExtendTypeError, ArgumentError } = require('../api');

describe('api.test.js', function () {

    it('constructor', function () {
        assert(new Api());
        assert(new Api(undefined));
        assert(new Api({}));
    });

    it('constructor($extends)', function () {
        assert.throws(function () { new Api({ '': undefined }) }, ArgumentError);
        assert.throws(function () { new Api({ 'extend1': undefined }) }, ExtendTypeError);
    });


    it('api invoke', async function () {
        let result = await new Api().invoke(server_url, { qs: { v: 'v1' } });
        assert(result && (typeof result.time) == 'number');
        assert(result && result.query && result.query.v == 'v1');
    });


    it('custom api', async function () {

        let CustomApi = class customApi extends Api {
            constructor(token) { super(); this.token = token; }
            async buildApiReqOpts(extendInvokeOpts) {
                extendInvokeOpts.qs = Object.assign({ token: this.token }, extendInvokeOpts.qs);
                return extendInvokeOpts;
            }
        };

        let result = await new CustomApi('qwer')
            .invoke(server_url, { qs: { v: 'v1' } });

        assert(result && (typeof result.time) == 'number');
        assert(result && result.query && result.query.token == 'qwer');

    });

    it('custom Extend', function () {
        let api = new Api();

        let customExtend = class customExtend extends ApiExtend { };
        assert.doesNotThrow(function () { api.extend('extend1', customExtend); });

        customExtend = class customExtend extends ApiExtend { constructor() { super(undefined) } };
        assert.throws(function () { api.extend('extend1', customExtend); }, ExtendTypeError);

        customExtend = class customExtend extends ApiExtend { constructor() { super({}) } };
        assert.throws(function () { api.extend('extend1', customExtend); }, ExtendTypeError);

    });

    it('extend(name, Extend, opts)', function () {
        let api = new Api();

        let customExtend = class customExtend extends ApiExtend { };
        assert.doesNotThrow(function () { api.extend('extend1', customExtend); });
        assert(api['extend1'] instanceof customExtend);
        assert(api.extends['extend1'] instanceof customExtend);

        assert.throws(function () { api.extend(); }, ArgumentError);
        assert.throws(function () { api.extend(1); }, ArgumentError);
        assert.throws(function () { api.extend('extend1', undefined); }, ExtendTypeError);
        assert.throws(function () { api.extend('extend1', function () { }); }, ExtendTypeError);

    });

    it('extend(name, Extend, opts) - override', function () {
        let api = new Api();

        let customExtend1 = class customExtend extends ApiExtend { };
        let customExtend2 = class customExtend extends ApiExtend { };

        api.extend('extend1', customExtend1);
        assert(api['extend1'] instanceof customExtend1);

        api.extend('extend1', customExtend2);
        assert(api['extend1'] instanceof customExtend2);

    });

    it('extend invoke', async function () {

        // custom extend
        let customExtend = class customExtend extends ApiExtend {
            async getServerTime() {
                return await this.invoke(server_url, { qs: { v: 'v1' } });
            }
        };


        let api = new Api();
        api.extend('extend1', customExtend);

        let result = await api.extend1.getServerTime();
        assert(result && (typeof result.time) == 'number');
        assert(result && result.query && result.query.v == 'v1');

    });


    it('extend exports', async function () {

        // custom extend
        let customExtend = class customExtend extends ApiExtend { };
        customExtend.exports1 = 'exports1';


        let api = new Api();
        api.extend('extend1', customExtend);

        assert(api.extend1.exports.exports1 == 'exports1');
    });


});
