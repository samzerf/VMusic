import axios from 'axios'
import { commonParams, recommandRequestConfigData } from './config'
axios.defaults.baseURL = 'https://music.samzherf.cn'

// 获取推荐列表轮播数据
export function getRecommend () {
  const url = '/api/getRecommend'
  const data = Object.assign({
    '-': 'recom' + (Math.random() + '').replace('0.', ''),
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    data: recommandRequestConfigData
  }, commonParams)

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

// 获取歌单列表
export function getDiscList () {
  const url = '/api/getDiscList'

  const data = Object.assign({}, commonParams, {
    picmid: 1,
    rnd: Math.random(),
    loginUin: '745492651',
    hostUin: 0,
    platform: 'yqq.json',
    categoryId: 10000000,
    sortId: 5,
    ein: 19,
    sin: 0
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

// 获取某个歌单歌曲列表
export function getDiscSongList (disstid) {
  const url = '/api/getDiscSongList'

  const data = Object.assign({}, commonParams, {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    new_format: 1,
    disstid,
    loginUin: 0,
    hostUin: 0,
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
