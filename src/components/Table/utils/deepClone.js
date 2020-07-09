/**
 * 深度拷贝
 */
export default function deepClone(obj) {
    if (!(typeof obj === 'object' && obj !== null)) {
        return obj;
    }

    let result;
    if (Array.isArray(obj)) {
        result = [];
        obj.forEach(item => {
            result.push(deepClone(item));
        })
    } else {
        result = {};
        Object.keys(obj).forEach(key => {
            result[key] = deepClone(obj[key]);
        });
    }


    return result

}