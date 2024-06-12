import { post, get,put } from '../../utils/request';

// 创建商户账号
export function createShopAccount(params) {
    return post('/api/v1/shop/create', params)
}
// 获取商户信息
export function getShopInfo(params) {
    return get(`/api/v1/shop/getbyid/${params.shopId}`)
}
// 更新商户信息
export function updateShopInfo(params) {
    return put(`/api/v1/shop/update/${params.ID}`, params)
}
// 获取商户主营类目列表
export function getShopMainCategory() {
    return get(`/api/v1/shop/category_list`)
}