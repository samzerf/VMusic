<template>
  <div class="singer" ref="singer">
    <list-view :data="singers" @select="selectSinger" ref="listView"></list-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'
import Singer from 'common/js/singer'
import ListView from 'base/listview/listview'
import { mapMutations } from 'vuex'
import {playlistMixin} from 'common/js/mixin'
const HOT_NAME = '热门'
const HOT_SINGERS_LEN = 10

export default {
  mixins: [playlistMixin],
  components: {
    ListView
  },
  data() {
    return {
      singers: []
    }
  },
  created() {
    this._getSingers()
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist && playlist.length ? '104px' : '44px'
      this.$refs.singer.style.bottom = bottom
      this.$refs.listView.refresh()
    },
    selectSinger(singer) {
      this.setSinger(singer)
      this.$router.push({
        path: `/singer/${singer.id}`
      })
    },
    _getSingers() {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSingers(res.data.list)
        }
      })
    },
    _normalizeSingers(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_SINGERS_LEN) {
          map.hot.items.push(
            new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            })
          )
        }
        const Findex = item.Findex
        if (!map[Findex]) {
          map[Findex] = {
            title: Findex,
            items: []
          }
        }
        map[Findex].items.push(
          new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          })
        )
      })
      let hot = []
      let ret = []
      for (let k in map) {
        let singer = map[k]
        if (/[a-zA-Z]/.test(singer.title)) {
          ret.push(singer)
        } else if (singer.title === HOT_NAME) {
          hot.push(singer)
        }
      }
      ret = ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    ...mapMutations({
      'setSinger': 'SET_SINGER'
    })
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.singer
    position: fixed
    top: 44px
    bottom: 44px
    width: 100%
</style>
