import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'
import axios from 'axios'
axios.defaults.baseURL = 'https://music.samzherf.cn'

export function getHotKey () {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  return jsonp(url, data, options)
}

// 搜索歌曲或歌手
export function search (searchKey, page, showSinger, perpage) {
  const url = '/api/search'

  const data = Object.assign({}, commonParams, {
    w: searchKey,
    zhidaqu: 1,
    catZhida: showSinger ? 1 : 0,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage,
    n: perpage,
    p: page,
    remoteplace: 'txt.mqq.all'
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
