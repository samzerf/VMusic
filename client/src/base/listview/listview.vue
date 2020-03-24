<template>
  <scroll
    :data="data"
    class="listview"
    ref="listview"
    :listenScroll="listenScroll"
    :probeType="probeType"
    @scroll="scroll">
    <ul>
      <li v-for="(group,index) in data" :key="index" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="(item,idx) in group.items" @click="selectItem(item)" :key="idx" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut"
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
      @touchend.stop>
      <ul>
        <li v-for="(item, index) in shortcutList" :data-index="index" class="item" :key="index"
            :class="{'current':currentIndex===index}">{{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixedTitle" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from '../scroll/scroll'
import Loading from '../loading/loading'
import { getData } from 'common/js/dom'

const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30

export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  components: {
    Scroll,
    Loading
  },
  created() {
    this.listenScroll = true
    this.probeType = 3
    this.touch = {}
    this.listHeight = []
  },
  data() {
    return {
      currentIndex: 0,
      scrollY: -1,
      diff: -1
    }
  },
  computed: {
    shortcutList() {
      return this.data.map(d => d.title.substring(0, 1))
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this._calculateListHeight()
      }, 20)
    },
    scrollY(newY) {
      // 当滚动到顶部，newY>0
      if (newY >= 0) {
        this.currentIndex = 0
        return
      }
      // 中间
      for (let i = 0, len = this.listHeight.length - 1; i < len; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          this.diff = height2 + newY
          return
        }
      }
      // 底部
      if (-newY >= this.listHeight[this.listHeight.length - 1]) {
        this.currentIndex = this.listHeight.length - 2
      }
    },
    diff(newDiff) {
      let fixedTop = (newDiff > 0 && newDiff < TITLE_HEIGHT) ? TITLE_HEIGHT - newDiff : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixedTitle.style.transform = `translate3d(0, -${fixedTop}px, 0)`
    }
  },
  methods: {
    selectItem(item) {
      this.$emit('select', item)
    },
    onShortcutTouchStart(e) {
      let anchorIndex = parseInt(getData(e.target, 'index'))
      this.touch.y1 = e.touches[0].pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove(e) {
      this.touch.y2 = e.touches[0].pageY
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      let anchorIndex = this.touch.anchorIndex + delta
      this._scrollTo(anchorIndex)
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    _scrollTo(index) {
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      }
      if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    _calculateListHeight() {
      const listGroup = this.$refs.listGroup
      let height = 0
      this.listHeight = []
      this.listHeight.push(height)
      for (let i = 0, len = listGroup.length; i < len; i++) {
        let item = listGroup[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    refresh() {
      this.$refs.listview.refresh()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      right: 0
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        box-sizing: border-box
        background: $color-highlight-background
        font-size: $font-size-small
        color: $color-text-l
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
