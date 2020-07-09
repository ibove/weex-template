import { validatenull } from '@/utils/utils'
import { getStore } from "@/utils/store";

// 配置API接口地址
// const baseUrl = 'http://192.168.0.167:8061' // 开发环境
// const baseUrl = 'http://192.168.1.115:8061' // 开发环境-盛童
// const baseUrl = 'http://192.168.2.6:8061' // 开发环境
// const baseUrl = 'http://218.85.122.163:48061' // 测式环境
// const baseUrl = 'http://218.85.122.163:60861' // 正式环境
let baseUrl = "http://dev.realsee.net";
const platform = weex.config.env.platform.toLowerCase();
if (platform === "web") {
    baseUrl = "";
}

// 引入 请求数据组件

// 自定义判断元素类型JS
function toType(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

// 参数过滤函数
function filterNull(o) {
    for (let key in o) {
        if (o[key] === null) {
            delete o[key]
        }
        if (toType(o[key]) === 'string') {
            o[key] = o[key].trim()
        } else if (toType(o[key]) === 'object') {
            o[key] = filterNull(o[key])
        } else if (toType(o[key]) === 'array') {
            o[key] = filterNull(o[key])
        }
    }
    return o
}

// 工具方法
function toParams(obj) {
    let param = ''
    for (const name in obj) {
        if (typeof obj[name] !== 'function') {
            param += '&' + name + '=' + encodeURI(obj[name])
        }
    }
    return param.substring(1)
}

function apiStream({ method, url, params, needLogin = true, headers }) {
    // 引入 弹窗组件
    const modal = weex.requireModule('modal')
    // // 过滤参数
    if (params) {
        params = filterNull(params)
    }
    const stream = weex.requireModule('stream')
    return new Promise(async (resolve, reject) => {
        let token = await getStore({
            name: "x-access-token"
        });

        if (token) {
            token = 'Bearer ' + token;
        }

        let otherUrl = "";
        let body;
        if (method.toLowerCase() === 'get') {
            if (!validatenull(params)) {
                otherUrl = '?' + toParams(params)
            }
        } else {
            body = JSON.stringify(params);
        }

        stream.fetch({
            method: method,
            type: 'json',
            url: baseUrl + url + otherUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
                'cataType': 'mes',
                ...headers
            },
            body,
            timeout: 30000
        }, function (res) {

            if (res.ok) {
                let data = res.data
                if (data.code !== 0) {
                    modal.toast({
                        message: data.message
                    });
                    reject(data);

                } else {
                    resolve(data);
                }


            } else {
                reject(res);
                if (res.status === 401) {
                    modal.toast({
                        message: '用户未登录'
                    });
                    const { router } = require('@/router');
                    router.push('/login')
                } else {
                    modal.toast({
                        message: res.status + ' ' + res.statusText,
                        duration: 0.8
                    });
                }
            }
        });


    });
}

// 返回在vue模板中的调用接口
module.exports = {
    get: function (option) {
        return apiStream({
            ...option,
            method: 'GET'
        })
    },
    post: function (option) {
        return apiStream({
            ...option,
            method: 'POST'
        })
    },
    put: function (option) {
        return apiStream({
            ...option,
            method: 'PUT'
        })
    },
    delete: function (option) {
        return apiStream({
            ...option,
            method: 'DELETE'
        })
    },
    request: function (option) {
        return apiStream(option);
    },
    url: baseUrl
}
