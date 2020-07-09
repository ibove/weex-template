
import { request } from '@/utils/request';

export const loginByUsername = (username, password, code, randomStr) => {
    const grant_type = 'password';
    const scope = 'server';
    return request({
        url: '/auth/oauth/token?username=' + username + '&password+' + password + '&code=' + code + '&grant_type=password',
        headers: {
            'Authorization': 'Basic cG9zOnBvcw=='
        },
        method: 'post'
    });
};

export function fetchToolPage(params) {
    return request({
        url: '/ttmes/equipmentToolList/page',
        method: 'get',
        params
    });
}

export function fetchWorkOrderPage(params) {
    return request({
        url: '/malata/workOrderFeedingInfo/workOrderFeedingPage',
        method: 'get',
        params
    })
}