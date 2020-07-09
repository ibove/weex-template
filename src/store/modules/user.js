import { setStore, getStore, removeStore } from "@/utils/store";


export  async function user() {
    return {
        state: {

        },
        actions: {
            // 根据用户名登录
            LoginByUsername({
                commit,
                state,
                dispatch
            }, userInfo) {



            },
            // 根据手机号登录
            LoginByPhone({
                commit,
                state,
                dispatch
            }, userInfo) {

            }, GetUserInfo({
                commit,
                state,
                dispatch
            }) {

            },
            // 登出
            LogOut({
                commit,
                state
            }) {

            },
            // 注销session
            FedLogOut({
                commit
            }) {

            }

        },
        mutations: {
            SET_ACCESS_TOKEN: (state, access_token) => {
                state.access_token = access_token;
                setStore({
                    name: 'access_token',
                    content: state.access_token,
                    type: 'session'
                });
            },
            SET_MENU: (state, menu) => {
                state.menu = menu;
                setStore({
                    name: 'menu',
                    content: state.menu,
                    type: 'session'
                });
            },
            SET_MENU_GROUP: (state, menuGroup) => {
                state.menuGroup = menuGroup.data;
                setStore({
                    name: 'menuGroup',
                    content: state.menuGroup,
                    type: 'session'
                });
            },
            SET_USER_INFO: (state, userInfo) => {
                state.userInfo = userInfo;
                setStore({
                    name: 'userInfo',
                    content: state.userInfo,
                    type: 'session'
                });
            },
            SET_REFRESH_TOKEN: (state, rfToken) => {
                state.refresh_token = rfToken;
                setStore({
                    name: 'refresh_token',
                    content: state.refresh_token,
                    type: 'session'
                });
            },
            SET_ROLES: (state, roles) => {
                state.roles = roles;
                setStore({
                    name: 'roles',
                    content: state.roles,
                    type: 'session'
                });
            },
            SET_PERMISSIONS: (state, permissions) => {
                const list = {};
                for (let i = 0; i < permissions.length; i++) {
                    list[permissions[i]] = true;
                }
                state.permissions = list;
                setStore({
                    name: 'permissions',
                    content: state.permissions,
                    type: 'session'
                });
            }
        }
    };
};
