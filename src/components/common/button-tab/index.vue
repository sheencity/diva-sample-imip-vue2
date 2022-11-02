<template>
  <app-dialog :header="header">
    <div class="main">
      <button
        class="resource"
        :class="{ 'item-selected': selectItem === index }"
        v-for="(item, index) in dataSource.data"
        :key="item.title"
        @click="select(item, index)"
      >
        <div class="content">
          <div v-if="item.icon">
            <img v-show="selectItem === index" :src="item.icon.select" />
            <img v-show="selectItem !== index" :src="item.icon.unselect" />
          </div>
          {{ item.title }}
        </div>
      </button>
    </div>
  </app-dialog>
</template>

<script>
import AppDialog from '../dialog/dialog';

export default {
  props: ["header", "dataSource"],
  data() {
    return {
      selectItem: 0,
    };
  },
  methods: {
    select(item, index) {
      this.selectItem = index;
      this.$emit('select', index);
    },
  },
  components: {
    AppDialog,
  },
};
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  justify-content: space-between;
  .resource {
    width: 100%;
    height: 2.25rem;
    margin-right: 10px;
    border: 1px solid rgba(5, 205, 157, 0.3);
    border-radius: 4px;
    background: transparent;
    font-weight: 500;
    font-size: 0.88rem;
    color: #ffffff;
    vertical-align: middle;
    &:last-child {
      margin-right: 0;
    }
    .content {
      display: flex;
      justify-content: center;
      align-items: center;
      pointer-events: none;
      img {
        width: 1.13rem;
        height: 1.13rem;
        margin-right: 6px;
      }
    }
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
}
</style>
