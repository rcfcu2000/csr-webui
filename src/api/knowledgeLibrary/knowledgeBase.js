import { post, del, put } from '../../utils/request';

/* 
知识库分类查询 区分知识库类型必传字段 keyWord：1通用知识库 2定制知识库 3行业知识库
*/

// 获取知识库列表
export function getList(params) {
    return post('/api/v1/qa/getQaList', params)
}
// 获取知识库types列表
export function getTypesList(params) {
    return post('/api/v1/qatype/biz_qa_types', params)
}
// 添加知识库types内容
export function addTypeList(params) {
    return post('/api/v1/qatype/biz_qa_type', params)
}
// 更新知识库types内容
export function updateTypeList(params) {
    return put('/api/v1/qatype/biz_qa_type', params)
}
// 删除知识库types内容
export function delTypeList(params) {
    return del(`/api/v1/qa/delete/${params.ID}`)
}
// 添加知识库内容
export function addList(params) {
    return post('/api/v1/qa/biz_qa_complex', params)
}
// 添加知识库内容
export function delList(params) {
    return del(`/api/v1/qa/delete/${params.ID}`)
}
// 更新知识库内容
export function updateList(params) {
    return put(`/api/v1/qa/update/${params.ID}`, params)
}