<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches :switches="switches" :current-index="currentIndex" @switch="switchItem"></switches>
      </div>
      <div class="play-btn" ref="playBtn" @click="randomPlaySongs">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll ref="favoriteList" :key="0" class="list-scroll" v-if="currentIndex===0" :data="favoriteList">
          <div class="list-inner">
            <song-list :songs="favoriteList" @select="selectSong"></song-list>
          </div>
        </scroll>
        <scroll ref="playHistory" :key="1" class="list-scroll" v-if="currentIndex===1" :data="playHistory">
          <div class="list-inner">
            <song-list :songs="playHistory" @select="selectSong"></song-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :title="noResultDesc"></no-result>
      </div>
    </div>
  </transition>
</template>

<script>
import Switches from 'base/switches/switches'
import SongList from 'base/song-list/song-list'
import Scroll from 'base/scroll/scroll'
import Song, { processSongsUrl } from 'common/js/song'
import { mapGetters, mapActions } from 'vuex'
import { playlistMixin } from 'common/js/mixin'
import NoResult from 'base/no-result/no-result'

export default {
  mixins: [playlistMixin],
  components: {
    Switches,
    SongList,
    Scroll,
    NoResult
  },
  data () {
    return {
      switches: [
        { name: '我的收藏' },
        { name: '最近播放' }
      ],
      currentIndex: 0
    }
  },
  computed: {
    ...mapGetters([
      'playHistory',
      'favoriteList'
    ]),
    noResult () {
      if (this.currentIndex === 0) {
        return !this.favoriteList.length
      } else {
        return !this.playHistory.length
      }
    },
    noResultDesc () {
      if (this.currentIndex === 0) {
        return '你没有收藏歌曲'
      } else {
        return '你最近没有播放歌曲'
      }
    }
  },
  methods: {
    ...mapActions([
      'insertSong',
      'randomPlay'
    ]),
    handlePlaylist (playlist) {
      const bottom = playlist && playlist.length ? '60px' : 0
      this.$refs.listWrapper.style.bottom = bottom
      this.$refs.favoriteList && this.$refs.favoriteList.refresh()
      this.$refs.playHistory && this.$refs.playHistory.refresh()
    },
    switchItem (index) {
      this.currentIndex = index
    },
    back () {
      this.$router.back()
    },
    selectSong (song) {
      processSongsUrl([new Song(song)]).then(data => {
        this.insertSong(data[0])
      })
    },
    randomPlaySongs () {
      let songs = this.currentIndex === 0 ? this.favoriteList : this.playHistory
      if (!songs.length) {
        return
      }
      songs = songs.map(song => {
        return new Song(song)
      })
      processSongsUrl(songs).then(data => {
        this.randomPlay({
          list: data
        })
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .user-center
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .switches-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-text-l
      color: $color-text-l
      border-radius: 100px
      font-size: 0
      .icon-play
        display: inline-block
        vertical-align: middle
        margin-right: 6px
        font-size: $font-size-medium-x
      .text
        display: inline-block
        vertical-align: middle
        font-size: $font-size-small
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
