<template>
  <app-dialog :header="header">
    <div :key="item.title" v-for="item in dataSource">
      <div class="prod-area">
        <h3>{{ item.title }}</h3>
      </div>
      <app-card-panel
        :key="index"
        v-for="(childItem, index) in item.list"
        class="area-module"
        :class="{ 'item-selected': childItem.checked }"
        :dataSource="childItem.content"
        @click.native="selectItem(childItem)"
      ></app-card-panel>
    </div>
  </app-dialog>
</template>

<script>
import AppDialog from '../common/dialog/dialog';
import AppCardPanel from '../common/card-panel';

export default {
  props: ['header', 'dataSource'],
  data() {
    return {};
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.dataSource.forEach((area) => {
        area.list.forEach((ele) => {
          this.$set(ele, 'checked', false);
        });
      });
    },
    selectItem(e) {
      this.dataSource.forEach((area) => {
        area.list.forEach((ele) => {
          ele.checked = false;
        });
      });
      e.checked = true;
      this.$emit('select', e);
    },
  },
  components: {
    AppDialog,
    AppCardPanel,
  },
};
</script>

<style lang="scss" scoped>
.prod-area,
.life-area {
  h3 {
    padding-bottom: 0.6rem;
    font-weight: 500;
    font-size: 1rem;
    line-height: 1.38rem;
    text-align: center;
    text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.5);
    background: url("/public/assets/images/theme/title.png")
      no-repeat 50% 10%;
  }
}
.life-area {
  margin-top: 1rem;
}
.area-module:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: #00f7ff;
}
</style>>

