import axios from 'axios';
import { Message } from "@arco-design/web-vue";
import router from '../router/index';

// 创建axios实例，设置配置得默认值
const instance = axios.create({
    // baseUrl: 'http://192.168.2.8:8080',   // 本地地址
    // baseUrl: 'https://www.zhihuige.cc/csrb',   // 线上地址
    baseURL: 'https://www.zhihuige.cc/csrb',   // 打包地址
    timeout: 60000,  // 设置请求超时的默认值
    headers: {
        'Content-Type': 'application/json', //配置请求头
    }
})
// 请求拦截
instance.interceptors.request.use(
    config => {
        // 判断当前是否有token，有则在请求头上加上token
        if (sessionStorage.getItem('token')) {
            config.headers['x-token'] = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : ''
        }
        return config
    },
    error => {
        // 请求错误进行拦截并返回错误信息
        // return Promise.reject(error)
        Message.error(error)
    }
)
// 响应拦截
instance.interceptors.response.use(
    reponse => {
        const res = reponse.data
        if (reponse.config.url == '/api/v1/base/login') {
            return res
        } else {
            if (reponse.config.headers['x-token'] || sessionStorage.getItem('token')) {
                return res
            } else {
                Message.error('登陆已过期，请重新登录')
                setTimeout(() => {
                    router.push('/login')
                }, 1000)
            }
        }
    },
    error => {
        // return Promise.reject(error)
        Message.error(error)
    }
)
//封装post请求
export function post(url, data_ = {}) {
    return new Promise((resolve, reject) => {
        instance.post(url, JSON.stringify(data_)).then((res) => {
            return resolve(res)
        }).catch((err) => {
            return reject(err)
        })
    })
}
//封装put请求
export function put(url, data_ = {}) {
    return new Promise((resolve, reject) => {
        instance.put(url, JSON.stringify(data_)).then((res) => {
            return resolve(res)
        }).catch((err) => {
            return reject(err)
        })
    })
}

//封装get请求
export function get(url, params) {
    return new Promise((resolve, reject) => {
        instance.get(url, { params }).then((res) => {
            return resolve(res)
        }).catch((err) => {
            return reject(err)
        })
    })
}
//封装del请求
export function del(url, params) {
    return new Promise((resolve, reject) => {
        instance.delete(url, { params }).then((res) => {
            return resolve(res)
        }).catch((err) => {
            return reject(err)
        })
    })
}
// 向外暴露axios实例
export default instance
