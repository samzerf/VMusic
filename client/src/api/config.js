export const ERR_OK = 0

export const commonParams = {
  _: '1557220809368',
  g_tk: '1928093487',
  uin: '745492651',
  format: 'json',
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  platform: 'h5',
  needNewCode: 1
}

export const options = {
  param: 'jsonpCallback',
  prefix: 'jp'
}

export const recommandRequestConfigData = {
  comm: {
    ct: 24
  },
  category: {
    method: 'get_hot_category',
    param: {
      qq: ''
    },
    module: 'music.web_category_svr'
  },
  recomPlaylist: {
    method: 'get_hot_recommend',
    param: {
      async: 1,
      cmd: 2
    },
    module: 'playlist.HotRecommendServer'
  },
  playlist: {
    method: 'get_playlist_by_category',
    param: {
      id: 8,
      curPage: 1,
      size: 40,
      order: 5,
      titleid: 8
    },
    module: 'playlist.PlayListPlazaServer'
  },
  new_song: {
    module: 'newsong.NewSongServer',
    method: 'get_new_song_info',
    param: {
      type: 5
    }
  },
  new_album: {
    module: 'newalbum.NewAlbumServer',
    method: 'get_new_album_info',
    param: {
      area: 1,
      sin: 0,
      num: 10
    }
  },
  new_album_tag: {
    module: 'newalbum.NewAlbumServer',
    method: 'get_new_album_area',
    param: {}
  },
  toplist: {
    module: 'musicToplist.ToplistInfoServer',
    method: 'GetAll',
    param: {}
  },
  focus: {
    module: 'QQMusic.MusichallServer',
    method: 'GetFocus',
    param: {}
  }
}
