<template>
  <transition appear name="slide">
    <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import { ERR_OK } from 'api/config'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
import {getMusicList} from 'api/rank'

export default {
  data() {
    return {
      songs: [],
      rank: true
    }
  },
  computed: {
    ...mapGetters(['topItem']),
    title() {
      return this.topItem.topTitle
    },
    bgImage() {
      if (this.songs.length) {
        return this.songs[0].image
      }
      return ''
    }
  },
  created() {
    this._getMusicList()
  },
  methods: {
    _getMusicList() {
      if (!this.topItem.id) {
        this.$router.push('/rank')
        return
      }
      getMusicList(this.topItem.id).then(res => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSongs(res.songlist)).then(songs => {
            this.songs = songs
          })
        }
      })
    },
    _normalizeSongs(songs) {
      let ret = []
      songs.forEach(song => {
        let musicData = song.data
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
