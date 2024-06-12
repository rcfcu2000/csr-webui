import { post } from '../../utils/request';

// 获取角色列表
export function getRole(params) {
    return post('/api/v1/authority/getAuthorityList', params)
}
// 删除角色
export function delRole(params) {
    return post('/api/v1/authority/deleteAuthority', params)
}
// 创建角色
export function createRole(params) {
    return post('/api/v1/authority/createAuthority', params)
}
// 更新角色
export function updateRole(params) {
    return post('/api/v1/authority/updateAuthority', params)
}
// 配置角色权限
export function deployRoleJurisdiction(params) {
    return post('/api/v1/menu/addMenuAuthority', params)
}