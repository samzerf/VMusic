import { commonParams } from './config'
import { getUid } from 'common/js/uid'
import axios from 'axios'
import { ERR_OK } from 'api/config'

export function getSongsUrl(songs) {
  const url = '/api/getPurlUrl'
  let mids = ['0049T4N609ym6K'] // 发现周杰伦的某些歌，放在mids的第一位会请求不到，这里写死一个hardcode的可以成功的mid
  let types = [0]
  songs.forEach(song => {
    mids.push(song.mid)
    types.push(0)
  })
  const guid = getUid()
  const data = {
    comm: {
      ct: 24,
      cv: 0,
      format: 'json',
      uin: 0
    },
    req: {
      method: 'GetCdnDispatch',
      module: 'CDN.SrfCdnDispatchServer',
      param: {
        calltype: 0,
        guid,
        userip: ''
      }
    },
    req_0: {
      method: 'CgiGetVkey',
      module: 'vkey.GetVkeyServer',
      param: {
        guid,
        loginflag: 1,
        platform: '20',
        songmid: mids,
        songtype: types,
        uin: '0'
      }
    }
  }
  const params = Object.assign({}, commonParams, {
    '-': 'getplaysongvkey7184256423184399',
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    data: JSON.stringify(data)
  })
  delete params._
  delete params.uin
  return new Promise((resolve, reject) => {
    let tryTime = 3
    function request() {
      axios.get(url, {
        params
      }).then(res => {
        res = res.data
        if (res.code === ERR_OK) {
          let res0 = res.req_0
          if (res0.code === ERR_OK) {
            let purlMap = {}
            res0.data.midurlinfo.forEach(song => {
              if (song.purl) {
                purlMap[song.songmid] = song.purl
              }
            })
            if (Object.keys(purlMap).length > 0) {
              resolve(purlMap)
            } else {
              retry()
            }
          } else {
            retry()
          }
        } else {
          retry()
        }
      }).catch(e => {
        retry()
      })
    }
    function retry() {
      if (--tryTime >= 0) {
        request()
      } else {
        reject(new Error('can not get the songs url'))
      }
    }
    request()
  })
}

export function getLyric(mid) {
  const url = '/api/lyric'
  const data = Object.assign({}, commonParams, {
    '-': 'MusicJsonCallback_lrc',
    pcachetime: +new Date(),
    songmid: mid,
    loginUin: 745492651,
    hostUin: 0,
    platform: 'yqq.json',
    needNewCode: 0
  })
  return axios.get(url, {
    params: data
  }).then(res => Promise.resolve(res.data))
}
