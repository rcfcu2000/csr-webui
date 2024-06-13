import { post } from '../../utils/request';

// 登录
export function login(params) {
    return post('/api/v1/base/login', params)
}
// 获取用户信息
export function getUserInfo(params) {
    return post('/api/v1/base/userinfo', params)
}