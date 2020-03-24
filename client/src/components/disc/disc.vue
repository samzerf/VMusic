<template>
  <transition appear name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import { ERR_OK } from 'api/config'
import {getDiscSongList} from 'api/recommend'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'

export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters(['disc']),
    title() {
      return this.disc.dissname
    },
    bgImage() {
      return this.disc.imgurl
    }
  },
  created() {
    this._getDiscSongList()
  },
  methods: {
    _getDiscSongList() {
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
        return
      }
      getDiscSongList(this.disc.dissid).then(res => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSongs(res.cdlist[0].songlist)).then(songs => {
            this.songs = songs
            console.log(this.songs)
          })
        }
      })
    },
    _normalizeSongs(songs) {
      let ret = []
      songs.forEach(musicData => {
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
  .slide-leave-active, .slide-enter-active
    transition: all 0.3s
  .slide-leave-to, .slide-enter
    transform: translate3d(100%, 0, 0)
</style>
