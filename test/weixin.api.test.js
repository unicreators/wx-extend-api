const request = require('request-promise-native');
const assert = require('assert');

const { WeixinApi, ApiExtend, ArgumentError } = require('../');

describe('weixin.api.test.js', function () {

    it('constructor', function () {
        assert.throws(function () { new WeixinApi(); }, ArgumentError);
        assert.throws(function () { new WeixinApi(undefined); }, ArgumentError);
        assert.throws(function () { new WeixinApi('appId', undefined); }, ArgumentError);
        assert.throws(function () { new WeixinApi({}); }, ArgumentError);

        assert.doesNotThrow(function () { new WeixinApi('appId', 'appSecret'); });
    });

    // opts
    let api = new WeixinApi('appId', 'appSecret');
    let stream = function () { return request('https://i.pinimg.com/originals/c6/54/79/c654790071a6242a1ef2990ba681f38f.jpg'); };


    it('custom extend', async function () {

        let MessageExtend = class MessageExtend extends ApiExtend {
            async send(to, content) {
                return await this.invoke(
                    'https://api.weixin.qq.com/cgi-bin/message/custom/send',
                    // request opts.   
                    // (see: https://github.com/request/request#requestoptions-callback)
                    {
                        body: {
                            touser: to, msgtype: 'text',
                            text: { content }
                        }
                    }, 'POST');
            }
        };

        api.extend('message', MessageExtend);


        let result = await api.message.send('openId', 'content');

        assert(result);

    });


    it('media add', async function () {

        let { ImageMedia } = api.media.exports;
        let image = new ImageMedia(stream());
        let result = await api.media.add(image);

        assert(result);
        assert(result.media_id);
        assert(result.url);

    });

    it('media add (temporary)', async function () {

        let { ImageMedia } = api.media.exports;
        let image = new ImageMedia(stream());
        let result = await api.media.add(image, true);

        assert(result);
        assert(result.media_id);
        assert(result.created_at);
        assert(result.type == image.type);

    });

    it('media list', async function () {

        let { MediaType } = api.media.exports;
        let result = await api.media.list(MediaType.Image, 0, 20);

        assert(result);
        assert(Array.isArray(result.item));
        assert(typeof result.item_count == 'number');
        assert(typeof result.total_count == 'number');

    });

    it('media count', async function () {

        let result = await api.media.count();

        assert(result);
        assert(typeof result.image_count == 'number');
        assert(typeof result.video_count == 'number');
        assert(typeof result.voice_count == 'number');
        assert(typeof result.news_count == 'number');

    });

    it('media remove', async function () {

        let { ImageMedia } = api.media.exports;
        let image = new ImageMedia(stream());

        let result = await api.media.add(image);
        assert(result);
        assert(result.media_id);

        result = await api.media.remove(result.media_id);
        assert(result);

    });

});
