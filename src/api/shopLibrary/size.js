import { del, post, put,get } from '../../utils/request';

// 获取尺码列表
export function getList(params) {
    return post('/api/v1/clothsize/getList', params)
}
// 编辑尺码表
export function updateSize(params) {
    return put(`/api/v1/clothsize/update/${params.ID}`, params)
}
// 编辑尺码表
export function delSize(params) {
    return del(`/api/v1/clothsize/delete/${params.ID}`)
}
// 尺码表绑定商品
export function sizeBindCommodity(params) {
    return put(`/api/v1/clothsize/updateMerchantList`,params)
}
// 尺码表绑定商品数组
export function getSizeBindCommodity(params) {
    return get(`/api/v1/clothsize/getMerchantList/${params.ID}`,params)
}