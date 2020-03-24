const Router = require('koa-router')
const cache = require('memory-cache')
const axios = require('axios')
const cacheStore = new cache.Cache()
const debug = require('debug')('music')
const CACHE_TIME = 3600000

const router = new Router({
  prefix: '/api'
})

const commonHeaders = {
  'Referer': 'https://y.qq.com/portal/playlist.html',
  'Origin': 'https://y.qq.com'
}

async function proxyGet(ctx, url, headers) {
  const res = await axios.get(url, {
    headers,
    params: ctx.query
  })
  ctx.body = res.data
}

// 获取移动端推荐列表数据
router.get('/getRecommend', async (ctx, next) => {
  const key = '__recommend__'
  const res = cacheStore.get(key)
  if (res) {
    debug('Get recommend from cache: %o', res)
    ctx.body = res
    return
  }
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  await proxyGet(ctx, url, Object.assign({}, commonHeaders, {
    Referer: 'https://y.qq.com/?ADTAG=myqq'
  }))
  cacheStore.put(key, ctx.body, CACHE_TIME)
})

// 获取pc端全部歌单数据
router.get('/getDiscList', async (ctx, next) => {
  const key = '__discList__'
  const res = cacheStore.get(key)
  if (res) {
    debug('Get discList from cache: %o', res)
    ctx.body = res
    return
  }
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  await proxyGet(ctx, url, commonHeaders)
  cacheStore.put(key, ctx.body, CACHE_TIME)
})

// 获取歌词
router.get('/lyric', async (ctx, next) => {
  const key = '__lyric__'
  const songmid = ctx.query.songmid
  let lyricMap = cacheStore.get(key)
  if (lyricMap && lyricMap[songmid]) {
    debug('Get lyric from cache: %o', lyricMap[songmid])
    ctx.body = lyricMap[songmid]
    return
  }
  const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  await proxyGet(
    ctx,
    url,
    Object.assign({}, commonHeaders, {
      Referer: 'https://y.qq.com/portal/player.html'
  }))
  lyricMap = lyricMap || {}
  lyricMap[songmid] = ctx.body
  cacheStore.put(key, lyricMap, CACHE_TIME)
})

// 获取歌曲vkey
router.get('/getPurlUrl', async (ctx, next) => {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  await proxyGet(ctx, url, commonHeaders)
})

// 搜索歌曲或歌手
router.get('/search', async (ctx, next) => {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  await proxyGet(
    ctx,
    url,
    Object.assign({}, commonHeaders, {
      Referer: 'https://i.y.qq.com/n2/m/',
      Origin: 'https://i.y.qq.com'
  }))
})

// 获取歌单歌曲列表
router.get('/getDiscSongList', async (ctx, next) => {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  await proxyGet(
    ctx,
    url,
    Object.assign({}, commonHeaders, {
      Referer: `https://y.qq.com/n/yqq/playlist/${ctx.query.disstid}.html`
  }))
})

module.exports = router
