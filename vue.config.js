module.exports = {
  devServer: {
    // proxy: {
    //   '/dataSource': {
    //     target: 'http://192.168.0.10:8080/api/dataSource/', 
    //     changeOrigin: true
    //   }
    // }
    proxy: {
      '/': {
        target: 'http://demo1.wanjuanlink.com/',
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/': ''
        }
      }
    }
  },
  productionSourceMap: false 
}
