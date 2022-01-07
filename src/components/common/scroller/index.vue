<template>
  <main>
    <div
      class="content"
      :style="{ height: contentHeight + 'px', overflowY: scroll ? 'hidden' : 'scroll', }"
      @mouseenter="mouseEnterScroll()"
      @mouseleave="mouseLeaveScroll()"
    >
      <div
        :class="{ scroller: hasTransform, 'scroll-direct': !hasTransform }"
        :style="{ transform: `translateY(-${step * height}px)` }"
      >
        <slot></slot>
      </div>
    </div>
  </main>
</template>

<script>
// 自动滚动组件
export default {
  // dataLength: 数据条数  height:每条数据所占高度  contentHeight: 可滚动视区域高度
  props: ['dataLength', 'height', 'contentHeight', 'scroll'],
  data() {
    return {
      hasTransform: true,
      timer: null,
      step: 0,
    };
  },
  methods: {
    mouseEnterScroll() {
      clearInterval(this.timer);
    },
    mouseLeaveScroll() {
      this.isOverHeight();
    },
    isOverHeight() {
      if (this.height * this.dataLength >= this.contentHeight && this.scroll) {
        this.autoScroll();
      }
    },
    autoScroll() {
      this.timer = setInterval(() => {
        if (this.step === this.dataLength) {
          this.hasTransform = false;
          this.step = 0;
          window.requestAnimationFrame(() =>
            window.requestAnimationFrame(() => (this.hasTransform = true))
          );
        } else {
          this.step++;
          this.$emit('roll', this.step);
        }
      }, 3000);
    },
  },
  watch: {
    dataLength() {
      if (this.timer) {
        this.step = 0;
        clearInterval(this.timer);
      }
      this.isOverHeight();
    },
  },
  mounted() {
    this.isOverHeight();
  },
  destroyed() {
    clearInterval(this.timer);
  },
};
</script>

<style lang="scss" scoped>
.content {
  overflow: hidden;
  cursor: pointer;
  .scroller {
    transition: transform 1s;
  }
  .scroll-direct {
    transition: transform;
  }
}
</style>
