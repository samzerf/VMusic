const path = require('path')
const axios = require('axios')
const CompressionPlugin = require('compression-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  outputDir: resolve('../public'),
  devServer: {
    before(app) {
      // 获取移动端推荐列表数据
      app.get('/api/getRecommend', (req, res) => {
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
        axios.get(url, {
          headers: {
            'Referer': 'https://y.qq.com/?ADTAG=myqq',
            'Origin': 'https://y.qq.com'
          },
          params: req.query,
        }).then(response => {
          res.json(response.data)
        }).catch(e => {
          console.error(e)
        })
      })

      // 获取pc端全部歌单数据
      app.get('/api/getDiscList', (req, res) => {
        const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
        axios.get(url, {
          headers: {
            'Referer': 'https://y.qq.com/portal/playlist.html',
            'Origin': 'https://y.qq.com'
          },
          params: req.query,
        }).then(response => {
          res.json(response.data)
        }).catch(e => {
          console.error(e)
        })
      })

      // 获取歌词
      app.get('/api/lyric', (req, res) => {
        const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
        axios.get(url, {
          headers: {
            'Referer': 'https://y.qq.com/portal/player.html',
            'Origin': 'https://y.qq.com'
          },
          params: req.query,
        }).then(response => {
          res.json(response.data)
        }).catch(e => {
          console.error(e)
        })
      })

      // 获取歌曲vkey
      app.get('/api/getPurlUrl', (req, res) => {
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
        axios.get(url, {
          headers: {
            'Referer': 'https://y.qq.com/portal/playlist.html',
            'Origin': 'https://y.qq.com'
          },
          params: req.query
        }).then(response => {
          res.json(response.data)
        }).catch(e => {
          console.error(e)
        })
      })

      // 搜索歌曲或歌手
      app.get('/api/search', (req, res) => {
        const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
        axios.get(url, {
          headers: {
            'Referer': 'https://i.y.qq.com/n2/m/',
            'Origin': 'https://i.y.qq.com'
          },
          params: req.query
        }).then(response => {
          res.json(response.data)
        }).catch(e => {
          console.error(e)
        })
      })

      // 获取歌单歌曲列表
      app.get('/api/getDiscSongList', (req, res) => {
        const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
        axios.get(url, {
          headers: {
            'Referer': `https://y.qq.com/n/yqq/playlist/${req.query.disstid}.html`,
            'Origin': 'https://y.qq.com'
          },
          params: req.query
        }).then(response => {
          res.json(response.data)
        }).catch(e => {
          console.error(e)
        })
      })
    }
  },
  configureWebpack: () => {
    if (process.env.NODE_ENV === 'production') {
     return {
       plugins: [
         new CompressionPlugin({
           test: /\.js$|\.html$|\.css$|\.jpg$|\.jpeg$|\.png/, // 需要压缩的文件类型
           threshold: 10240, // 归档需要进行压缩的文件大小最小值(k)
           deleteOriginalAssets: false // 是否删除原文件
         })
       ]
     }
   }
 },
  chainWebpack(config) {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('components', resolve('src/components'))
      .set('common', resolve('src/common'))
      .set('api', resolve('src/api'))
      .set('base', resolve('src/base'))
      .set('views', resolve('src/views'))
  },
  publicPath: ''
}
