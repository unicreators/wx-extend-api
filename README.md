## wx-extend-api

wechat/weixin extend api.


### Install

```sh
$ npm install wx-extend-api
```


### Usage

#### STEP 1: Custom extend


```js

const { WeixinApi, ApiExtend } = require('wx-extend-api');

let MessageExtend = class MessageExtend extends ApiExtend {
    async send(to, content) {
        return await this.invoke(
            'https://api.weixin.qq.com/cgi-bin/message/custom/send',
            {
                body: {
                    touser: to, msgtype: 'text',
                    text: { content }
                }
            }, 'POST');
    }
};


```


#### STEP 2: Register extend


```js


let api = new WeixinApi('appId', 'appSecret');


// register
api.extend('message', MessageExtend);


```



#### STEP 3: Use


```js


api.message.send('openId', 'content')
    .then(function (result) {
        // ..
    }).catch(function (err) {
        // ..
    });

    
// or
// await api.message.send('openId', 'content');


```






### License

[MIT](LICENSE)