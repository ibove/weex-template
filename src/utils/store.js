import { validatenull } from '@/utils/utils';


/**
 * 存储localStorage
 */
export function setStore(params) {
    const {
        name,
        content,
        type,
        datetime
    } = params;
    const storage = weex.requireModule('storage');
    const obj = {
        dataType: typeof (content),
        content,
        type,
        datetime: new Date().getTime()
    };
    storage.setItem(name, JSON.stringify(obj));

}

/**
 * 获取localStorage
 */
export function getStore(params) {
    const {
        name,
        type
    } = params;
    let content;
    const storage = weex.requireModule('storage');
    return new Promise((resolve, reject) => {       
        storage.getItem(name, event => {
            let obj = event.data;         
            if (!validatenull(obj)) {
                obj = JSON.parse(obj);
                if (obj.dataType === 'string') {
                    content = obj.content;
                } else if (obj.dataType === 'number') {
                    content = Number(obj.content);
                } else if (obj.dataType === 'boolean') {
                    content = eval(obj.content);
                } else if (obj.dataType === 'object') {
                    content = obj.content;
                }
            }
            resolve(content);
        });
    });

};
/**
 * 删除localStorage
 */
export async function removeStore(params) {
    const storage = weex.requireModule('storage');
    const {
        name
    } = params;

    storage.removeItem(name);
    return r;
};

export function getAllKey() {
    const storage = weex.requireModule('storage');
    return new Promise((resolve, reject) => {
        storage.getAllKeys(event => {
            console.log(event)
            resolve(event.data);
        });
    });
}
