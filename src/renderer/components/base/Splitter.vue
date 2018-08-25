<template>
  <div :style="{ cursor, userSelect, flexDirection }" class="cl-splitter" @mouseup="onUp" @mousemove="onMouseMove" @touchmove="onMove" @touchend="onUp">
    <div :style="leftPaneStyle" class="left-pane splitter-pane">
      <slot name="left-pane"></slot>
    </div>
    <div class="splitter" :class="{active}" :style ="splitterStyle" @mousedown="onDown" @click="onClick" @touchstart.prevent="onDown"></div>
    <div :style="rightPaneStyle" class="right-pane splitter-pane">
      <slot name="right-pane"></slot>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      margin: {
        type: Number,
        default: 10
      },
      horizontal: {
        type: Boolean,
        default: false
      },
      initPercent: {
        type: Number,
        default: 50
      }
    },
    data () {
      return {
        active: false,
        percent: this.initPercent,
        hasMoved: false
      }
    },
    computed: {
      flexDirection () { return this.horizontal ? 'column' : 'row' },
      splitterStyle () {
        return this.horizontal ? {
            borderTop: '2px solid transparent',
            botderBottom: '2px solid transparent',
            height: '5px',
            cursor: 'ns-resize'
          } : {
            borderLeft: '2px solid transparent',
            borderRight: '2px solid transparent',
            width: '5px',
            cursor: 'ew-resize'
          }
      },
      leftPaneStyle () { return this.horizontal ? { height: this.percent + '%' } : { width: this.percent + '%' } },
      rightPaneStyle () { return this.horizontal ? { height: 100-this.percent + '%' } : { width: 100-this.percent + '%' } },
      userSelect () { return this.active ? 'none' : '' },
      cursor () { return this.active ? this.horizontal ? 'ns-resize' : 'ew-resize' : '' },
    },
    methods: {
      onClick () {
        if (!this.hasMoved) {
          this.percent = 50;
          this.$emit('resize');
        }
      },
      onDown (e) {
        this.active = true;
        this.hasMoved = false;
      },
      onUp () {
        this.active = false;
      },
      onMove (e) {
        let offset = 0;
        let target = e.currentTarget;
        let percent = 0;
        if (this.active) {
          if (this.horizontal) {
            while (target) {
              offset += target.offsetTop;
              target = target.offsetParent;
            }
            percent =  Math.floor(((e.pageY - offset) / e.currentTarget.offsetHeight)*10000)/100;
          } else {
            while (target) {
              offset += target.offsetLeft;
              target = target.offsetParent;
            }
            percent =  Math.floor(((e.pageX - offset) / e.currentTarget.offsetWidth)*10000)/100;
          }
          if (percent > this.margin && percent < 100 - this.margin) {
            this.percent = percent;
          }
          this.$emit('resize');
          this.hasMoved = true;
        }
      },
      onMouseMove (e) {
        if (e.buttons === 0 || e.which === 0) {
          this.active = false;
        }
        this.onMove(e);
      }
    }
  }
</script>
<style lang="scss" scoped>
@import "@/assets/styles/all-variables.scss";

.cl-splitter {
  width: 100%;
  height: 100%;
  display: flex;
  .splitter-pane {
    height: inherit;
    overflow-y: auto;
  }
  .splitter {
    position: relative;
    box-sizing: border-box;
    &:after {
      position: absolute;
      display: block;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      content: ' ';
      background-color: $cl-panel-border-color;
    }
  }
}
</style>
