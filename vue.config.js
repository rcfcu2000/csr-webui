const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://192.168.2.8:8080', //本地 
        // target: 'https://www.zhihuige.cc/csrb', //线上
        // ws: true, // 如果代理 WebSocket 连接，设置为 true
        changeOrigin: true, // 跨域请求时，需要设置为 true
      },
    },
  },
})
