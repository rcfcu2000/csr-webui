import { post } from '../../utils/request';

// 获取所有菜单列表
export function getMenu(params) {
    return post('/api/v1/menu/getBaseMenuTree', params)
}
// 获取用户菜单列表
export function getUserMenu(params) {
    return post('/api/v1/menu/getMenu', params)
}
// 获取指定角色菜单
export function getAssignUserMenu(params) {
    return post('/api/v1/menu/getMenuAuthority', params)
}