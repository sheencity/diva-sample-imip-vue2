<template>
  <article>
    <div
      :key="item.num"
      v-for="(item, index) in items"
      :class="{ selected: index === currentIndex }"
      @click="switchItem(item, index)"
    >
      {{ item.name }}
    </div>
  </article>
</template>

<script>
export default {
  props: ['items'],
  data() {
    return {
      currentIndex: null,
    };
  },
  methods: {
    switchItem(item, index) {
      this.currentIndex = index;
      this.$emit('change', { item, index });
    },
  },
};
</script>

<style lang="scss" scoped>
article {
  position: absolute;
  display: flex;
  flex-direction: column;
  z-index: 1;
  top: 0px;
  right: -120px;
  div {
    width: 52px;
    height: 36px;
    margin-bottom: 4px;
    font-weight: 500;
    font-size: 14px;
    line-height: 36px;
    text-align: center;
    background: rgba(4, 14, 29, 0.6);
    border: 1px solid rgba(5, 205, 157, 0.6);
    box-sizing: border-box;
    border-radius: 4px;
    text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.5);
    &:hover {
      background: rgba(5, 205, 157, 0.6);
    }
    &.selected {
      background: rgba(5, 205, 157, 0.6) !important;
    }
  }
}
</style>