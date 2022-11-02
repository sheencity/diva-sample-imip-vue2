<template>
  <main>
    <div v-if="thead && thead.length > 1" class="thead">
      <span class="col-1">{{ thead[0].title }}</span>
      <span class="col-2">{{ thead[1].title }}</span>
    </div>

    <app-scroller
      :dataLength="dataLength"
      :height="height"
      :contentHeight="contentHeight"
    >
      <div v-for="(item, index) in data" :key="index" class="tbody">
        <span class="col-1">{{ item.room }}</span>
        <span class="col-2">{{ item.name }}</span>
      </div>
      <div v-for="(item, index) in data" :key="index + 999" class="tbody">
        <span class="col-1">{{ item.room }}</span>
        <span class="col-2">{{ item.name }}</span>
      </div>
    </app-scroller>
  </main>
</template>

<script>
import AppScroller from '../scroller/index';

export default {
  props: ['data', 'contentHeight', 'dataLength', 'height', 'thead'],
  components: {
    AppScroller,
  },
};
</script>

<style lang="scss" scoped>
.thead {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 10px;
  span {
    text-align: center;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.5);
  }
  .col-1 {
    width: 45px;
  }
  .col-2 {
    width: 180px;
  }
}

.roll {
  overflow: hidden;
  max-height: 36px * 6;
}

.tbody {
  @extend .thead;
  width: 320px;
  height: 36px;
  margin-bottom: 0;
  border-top: 1px dashed rgba(255, 255, 255, 0.4);
}
</style>
