<template>
  <transition appear name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { createSong, processSongsUrl, isValidMusic } from 'common/js/song'
import { ERR_OK } from 'api/config'

export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters(['singer']),
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.avatar
    }
  },
  created() {
    this._getDetail()
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist && playlist.length ? '60px' : 0
      this.$refs.recommed.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    _getDetail() {
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSongs(res.data.list)).then(songs => {
            this.songs = songs
            console.log(this.songs)
          })
        }
      })
    },
    _normalizeSongs(songs) {
      let ret = []
      songs.forEach(item => {
        let { musicData } = item
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
