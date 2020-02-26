import Axios from "axios"

export function request(config) {
    // 1. 创建axios实例
    const instance = Axios.create({
        // baseURL: 'http://123.207.32.32:8000',
        baseURL: "http://123.207.32.32:8000/api/hy",
        // baseURL: "http://106.54.54.237:8000/api/hy",
        timeout: 5000,
    })

    // 2. axios的拦截器
    // 2.1 请求拦截的作用
    // instance.interceptors.request.use(config => {
    //         return config
    //     }, err => {
    //         console.log(err);
    //     })
    //     // 2.2 响应拦截
    // instance.interceptors.request.use(res => {
    //     return res.data
    // }, err => {
    //     console.log(err);
    // })

    // 3. 发送正真正的网络请求
    return instance(config)
}