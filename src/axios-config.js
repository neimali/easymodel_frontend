import axios from 'axios';

// 创建 Axios 实例
const apiClient = axios.create({
    baseURL: 'https://api.backend.com', // 后端 API 的基础 URL
    withCredentials: true,             // 允许发送跨域请求时附带 Cookies
    headers: {
        'Content-Type': 'application/json', // 默认使用 JSON 格式
    },
    timeout: 10000,                     // 设置超时时间（10秒）
});