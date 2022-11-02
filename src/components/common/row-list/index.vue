<template>
  <app-dialog :header="header">
    <div class="main">
      <div
        class="rows"
        v-for="(item, index) in rowList"
        :key="item.title"
        :class="{ 'row-selected': selectedIndex === index, disabled: disabled }"
        @click="select(item, index)"
      >
        <span v-if="item.color" :style="{ background: item.color }"></span>
        <div>{{ item.title }}</div>
        <div
          v-if="selectedIndex === index && item['child-panel']"
          class="topFrame-absolute"
        >
          <img
            class="topFrame-line"
            src="assets/images/theme/left-line.png"
          />
          <app-basic-info
            class="topHeader"
            :header="item['child-panel'].header"
            :dataSource="item['child-panel'].content.data"
          >
            <div class="closeBtn">
              <img
                @click.stop="closeTopFrame()"
                src="assets/images/icon/close.svg"
              />
            </div>
          </app-basic-info>
        </div>
      </div>
    </div>
  </app-dialog>
</template>

<script>
import AppDialog from '../dialog/dialog';
import AppBasicInfo from '../basic-info';

export default {
  props: ['header', 'dataSource', 'disabled'],
  data() {
    return {
      rowList: this.dataSource.data,
      selectedIndex: -1,
    };
  },
  methods: {
    select(item, index) {
      this.selectedIndex = index;
      this.$emit('select', item, index);
    },
    closeTopFrame() {
      this.selectedIndex = -1;
    },
  },
  components: {
    AppDialog,
    AppBasicInfo,
  },
};
</script>

<style lang="scss" scoped>
.rows {
  width: 320px;
  height: 60px;
  border: 1px solid rgba(5, 205, 157, 0.3);
  border-radius: 4px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  & > * {
    pointer-events: none;
  }
  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
  &:not(:last-child) {
    margin-bottom: 8px;
  }
  &.row-selected {
    border: 1px solid #00f7ff;
    color: #00f7ff;
  }
  span {
    width: 40px;
    height: 20px;
    border-radius: 4px;
  }
}

.topFrame-absolute {
  position: absolute;
  .topFrame-line {
    position: absolute;
    top: -30px;
    left: 298px;
  }
  .topHeader {
    position: absolute;
    top: -74px;
    left: 340px;
    color: #fff;
  }
  .closeBtn {
    width: 20px;
    height: 20px;
    position: absolute;
    right: 10px;
    top: 10px;
    pointer-events: all;
    img {
      padding: 0 5px;
      cursor: pointer;
    }
  }
}
</style>
