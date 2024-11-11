import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:80/api',  // 假设后端服务运行在3000端口
    timeout: 10000
})

// 添加请求拦截器，自动带上 token
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers['Authorization'] = `${token}`
    }
    return config
}, error => {
    return Promise.reject(error)
})

// 用户注册
export const register = (data) => api.post('/registry', data)

// 用户登录
export const login = (data) => api.post('/login', data)

// 获取用户信息
export const getUserInfo = () => api.get('/uinfo')

// 获取设备列表
export const getDevices = () => api.get('/devices')

// 获取设备详情
export const getDeviceDetails = (deviceId) => api.get(`/device_logs/${deviceId}`)

// 操作设备（启动/停止等）
export const controlDevice = (deviceId, action) => api.get(`/device/${action}/${deviceId}`)

export default api
