<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart="touchstart"
        @touchmove="touchmove"
        @touchend="touchend">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { prefixStyle } from 'common/js/dom'
const progressBtnWidth = 16
const transform = prefixStyle('transform')
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  watch: {
    percent(newPercent) {
      if (newPercent < 0 || this.touch.init) {
        return
      }
      let barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      let offset = newPercent * barWidth
      this._offset(offset)
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    _offset(offset) {
      this.$refs.progress.style.width = `${offset}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offset}px, 0, 0)`
    },
    _getPercent() {
      let barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      let progressWidth = this.$refs.progress.clientWidth
      let percent = progressWidth / barWidth
      return percent
    },
    touchstart(e) {
      this.touch.init = true
      this.touch.left = this.$refs.progress.clientWidth
      this.touch.startX = e.touches[0].pageX
    },
    touchmove(e) {
      if (!this.touch.init) {
        return
      }
      let deltaX = e.touches[0].pageX - this.touch.startX
      let offset = Math.min(Math.max(0, this.touch.left + deltaX), this.$refs.progressBar.clientWidth - progressBtnWidth)
      this._offset(offset)
    },
    touchend(e) {
      this.touch.init = false
      this.$emit('change', this._getPercent())
    },
    progressClick(e) {
      let rect = this.$refs.progress.getBoundingClientRect()
      let offset = e.pageX - rect.left
      this._offset(offset)
      this.$emit('change', this._getPercent())
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
