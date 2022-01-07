<template>
  <app-dialog :header="header">
    <main :class="'column' + thead.length">
      <div v-if="thead && thead.length > 1" class="thead">
        <span
          v-for="(head, index) in thead"
          :key="index"
          :class="'col-' + index"
        >
          {{ head.title }}
        </span>
      </div>
      <app-scroller
        :dataLength="dataLength"
        :height="height"
        :contentHeight="contentHeight"
        :scroll="autoScroll"
      >
        <div v-for="(item, index) in dataSource" :key="index" class="tbody">
          <span
            v-for="(key, index) in Object.keys(item)"
            :key="index"
            :class="'col-' + index"
          >
            {{ item[key] }}
          </span>
        </div>
        <div
          v-for="(item, index) in dataSource"
          :key="index + 999"
          class="tbody"
        >
          <span
            v-for="(key, index) in Object.keys(item)"
            :key="index"
            :class="'col-' + index"
          >
            {{ item[key] }}
          </span>
        </div>
      </app-scroller>
    </main>
  </app-dialog>
</template>

<script>
import AppDialog from '../dialog/dialog';
import AppScroller from '../scroller';

export default {
  props: [
    'header',
    'dataSource',
    'contentHeight',
    'dataLength',
    'height',
    'thead',
    'autoScroll',
  ],
  components: {
    AppDialog,
    AppScroller,
  },
};
</script>

<style lang="scss" scoped>
.column2 {
  .col-0 {
    width: 45px;
  }
  .col-1 {
    width: 180px;
  }
}
.column3 {
  .col-0 {
    width: 140px;
    text-align: left;
  }
  .col-1 {
    width: 100px;
    text-align: left;
  }
  .col-2 {
    width: 40px;
  }
}
.column4 {
  .col-0 {
    width: 80px;
  }
}
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
