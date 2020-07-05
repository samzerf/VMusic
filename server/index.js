"use strict"

const koa = require('koa')
const logger = require('koa-logger')
const serve = require('koa-static')
const path = require('path')
const fs = require('fs')
const koaBody = require('koa-body')
const { historyApiFallback } = require('koa2-connect-history-api-fallback');
const app = new koa()
app.keys = ['koa-vue-music']
app.use(logger())

////////////////////////
/// 处理请求与文件上传  ///
///////////////////////
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 200 * 1024 * 1024	// 设置上传文件大小最大限制，默认200M
  }
}))

app.use(historyApiFallback({
  whiteList: ['/api']
}))

////////////////////////
///      静态资源     ///
///////////////////////
app.use(serve(path.join(__dirname, '../public'), {
  maxAge: 24 * 3600 * 1000,
  gzip: true,
  setHeaders: (res, reqPath, stats) => {
    if (path.basename(reqPath) === 'index.html') {
      res.setHeader('Cache-Control', 'no-cache')
    }
  }
}))

////////////////////////
///      挂载路由     ///
///////////////////////
const RoutesDir = path.join(__dirname, './route')
fs.readdirSync(RoutesDir)
  .filter(filename => /\.js$/.test(filename))
  .forEach(filename => {
    app.use(require(path.join(RoutesDir, filename)).routes())
  })


module.exports = (opts = {}) => {
  const server = app.listen(8000,  () => {
    console.log('Koa server listening on %s:%d', server.address().address, server.address().port)
  })
  return server
}
