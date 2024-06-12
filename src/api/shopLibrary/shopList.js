import { post, del, put } from '../../utils/request';

// 获取商品列表
export function getShopList(params) {
    return post('/api/v1/merchant/getMerchantList', params)
}
// excel删除商品
export function delShop(params) {
    return del(`/api/v1/merchant/delete/${params.merchantId}`, params)
}
// excel编辑商品
export function editShop(params) {
    return put(`/api/v1/merchant/update/${params.merchantId}`, params)
}