import { post, put } from '../../utils/request';

// 获取自动回复列表
export function getList(params) {
    return post('/api/v1/autoreply/getList', params)
}
// 更新自动回复
export function updateReply(params) {
    return put(`/api/v1/autoreply/update/${params.ID}`, params)
}