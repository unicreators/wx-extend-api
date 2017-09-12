//////////////////////////////
///  yichen

const { ApiExtend } = require('../../api');
const URL_MEDIA = {
    ADD_TEMP: { url: 'http://file.api.weixin.qq.com/cgi-bin/media/upload', method: 'POST' },
    GET_TEMP: { url: 'http://file.api.weixin.qq.com/cgi-bin/media/get', method: 'GET' },

    LIST: { url: 'https://api.weixin.qq.com/cgi-bin/material/batchget_material', method: 'POST' },
    ADD: { url: 'https://api.weixin.qq.com/cgi-bin/material/add_material', method: 'POST' },
    DELETE: { url: 'https://api.weixin.qq.com/cgi-bin/material/del_material', method: 'POST' },
    GET: { url: 'https://api.weixin.qq.com/cgi-bin/material/get_material', method: 'POST' },
    COUNT: { url: 'https://api.weixin.qq.com/cgi-bin/material/get_materialcount', method: 'GET' }
};

const MediaType = { Image: 'image', Voice: 'voice', Video: 'video', Thumb: 'thumb' };


class MediaExtend extends ApiExtend {
    constructor(api) { super(api); }

    async list(type, skip, take) {
        let body = { offset: skip, count: take };
        if (type != undefined) body = Object.assign({ type }, body);
        return await this.invoke(URL_MEDIA.LIST, { body });
    }

    async get(media_id, temporary = false) {
        return await this.invoke((temporary) ?
            URL_MEDIA.GET_TEMP : URL_MEDIA.GET,
            { qs: { media_id } });
    }

    async add(media, temporary = false) {
        return await this.invoke((temporary) ?
            URL_MEDIA.ADD_TEMP : URL_MEDIA.ADD,
            await media.buildInvokeOpts(this.api));
    }

    async remove(media_id) { return await this.invoke(URL_MEDIA.DELETE, { body: { media_id } }); }
    async count() { return await this.invoke(URL_MEDIA.COUNT); }
}





class Media {
    constructor(type) { this.type = type; }
    async buildInvokeOpts(api) { return { qs: { type: this.type } }; }
}

class StreamMedia extends Media {
    constructor(type, stream, fileName = undefined, contentType = undefined) {
        super(type);
        this.stream = stream;
        this.fileName = fileName;
        this.contentType = contentType;
    }

    async buildInvokeOpts(api) {
        let formData = { media: this.stream };
        if (this.fileName) Object.assign(formData, { filename: this.fileName });
        if (this.contentType) Object.assign(formData, { 'content-type': this.contentType });
        let opts = await super.buildInvokeOpts(api);
        opts.formData = Object.assign(formData, opts.formData);
        return opts;
    }

}

class ImageMedia extends StreamMedia { constructor(stream) { super(MediaType.Image, stream); } }

class VoiceMedia extends StreamMedia { constructor(stream) { super(MediaType.Voice, stream); } }

class ThumbMedia extends StreamMedia { constructor(stream) { super(MediaType.Thumb, stream); } }

class VideoMedia extends StreamMedia {
    constructor(stream, title, intro) {
        super(MediaType.Video, stream);
        this.title = title;
        this.intro = intro;
    }
    async buildInvokeOpts(api) {
        let opts = await super.buildInvokeOpts(api), body;
        if (this.title != undefined) body = Object.assign({ title: this.title }, body);
        if (this.intro != undefined) body = Object.assign({ introduction: this.intro }, body);
        opts.body = Object.assign({}, opts.body, body);
        return opts;
    }
}



module.exports = MediaExtend;
module.exports.MediaExtend = MediaExtend;
module.exports.VoiceMedia = VoiceMedia;
module.exports.ThumbMedia = ThumbMedia;
module.exports.VideoMedia = VideoMedia;
module.exports.ImageMedia = ImageMedia;
module.exports.MediaType = MediaType;


