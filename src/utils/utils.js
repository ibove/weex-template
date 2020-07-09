
/**
 * 判断是否为空
 */
export function validatenull(val) {
    if (val instanceof Array) {
        if (val.length === 0) return true;
    } else if (val instanceof Object) {
        if (JSON.stringify(val) === '{}') return true;
    } else {
        if (val === 'null' || val === null || val === 'undefined' || val === undefined || val === '') return true;
        return false;
    }
    return false;
}


/**
 * 加密处理
 */
export const encryption = (params) => {
    let {
        data,
        type,
        param,
        key
    } = params;
    const result = JSON.parse(JSON.stringify(data));
    if (type === 'Base64') {
        param.forEach(ele => {
            result[ele] = btoa(result[ele]);
        });
    } else {
        param.forEach(ele => {
            const data = result[ele];
            key = CryptoJS.enc.Latin1.parse(key);
            const iv = key;
            // 加密
            const encrypted = CryptoJS.AES.encrypt(
                data,
                key,
                {
                    iv,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.ZeroPadding
                });
            result[ele] = encrypted.toString();
        });
    }
    return result;
};