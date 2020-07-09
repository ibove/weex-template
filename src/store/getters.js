/**
 * 全局框架类的派生状态gatters
 */
const getters = {   
    access_token: state => state.user.access_token,
    refresh_token: state => state.user.refresh_token,
    roles: state => state.user.roles,
    permissions: state => state.user.permissions,
  
};
export default getters;
