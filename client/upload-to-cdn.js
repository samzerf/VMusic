const JSZip = require('jszip')
const zip = new JSZip()
const path = require('path')
const RawSource = require('webpack-sources').RawSource
const COS = require('cos-nodejs-sdk-v5')
const fs = require('fs')
var cos = new COS({
  SecretId: '',
  SecretKey: ''
})

class UploadToCDN {
  constructor(options) {
    this.options = options
  }
  apply(compiler) {
    compiler.hooks.emit.tapAsync('UploadToCDN', (compilation, callback) => {
      const folder = zip.folder(this.options.filename) // 新建文件夹
      for (let filename in compilation.assets) {
        const source = compilation.assets[filename].source()
        folder.file(filename, source)
      }
      zip.generateAsync({ type: 'nodebuffer' }).then((content) => {
        this.outputPath = path.join(compilation.options.output.path, `${this.options.filename}.zip`)
        const outputRelativePath = path.relative(compilation.options.output.path, this.outputPath)
        compilation.assets[outputRelativePath] = new RawSource(content)
        console.log('<--------------------------- Build zip success!!! ----------------------->')
        callback()
      })
    })

    compiler.hooks.afterEmit.tapAsync('UploadToCDN', (compilation, callback) => {
      cos.putObject({
        Bucket: 'upload-for-zip-1256415834', 
        Region: 'ap-guangzhou', 
        Key: `${this.options.filename}.zip`,              /* 必须 */
        StorageClass: 'STANDARD',
        Body: fs.createReadStream(this.outputPath), // 上传文件对象
        onProgress: progressData => {
          console.log(JSON.stringify(progressData))
        }
      }, (err, data) => {
        if (err) {
          console.error('upload to cdn fail')
          console.error(err)
        }
        console.log(data)
        callback()
      })
    })
  }
}

module.exports = UploadToCDN