import { post } from '../../utils/request';

// 获取账号/用户列表
export function getAccount(params) {
    return post('/api/v1/user/getUserList', params)
}
// 注册账号/用户
export function createAccount(params) {
    return post('/api/v1/user/admin_register', params)
}
// 删除账号/用户
export function delAccount(params) {
    return post('/api/v1/user/deleteUser', params)
}
// 修改账号/用户密码
export function changePasswordAccount(params) {
    return post('/api/v1/user/changePassword', params)
}
// 修改账号/用户所属角色
export function changeAccountRole(params) {
    return post('/api/v1/user/setUserAuthorities', params)
}