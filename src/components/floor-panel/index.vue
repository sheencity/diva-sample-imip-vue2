<template>
  <main class="floor-panel">
    <app-button-group
      :items="elevatorData"
      @change="selectElevator"
      ref="elevatorBtn"
    ></app-button-group>

    <app-button-tab
      class="top10"
      :header="leftModuleA.header"
      :dataSource="leftModuleA.content"
      @select="switchFloorRendering"
    ></app-button-tab>

    <app-table-col3
      class="top10"
      v-show="currentFloor.currFloorTableData.length"
      :maxItem="4"
      :header="leftModuleB.header"
      :thead="leftModuleB.content.head"
      :dataSource="currentFloor.currFloorTableData"
      @select="selectFloor"
      @unselect="unselectFloor"
    ></app-table-col3>

    <app-scroller-table
      class="top10"
      v-show="currentFloor.currFloorScrollTableData.length"
      :header="leftModuleC.header"
      :thead="leftModuleC.content.header"
      :dataSource="currentFloor.currFloorScrollTableData"
      :dataLength="currentFloor.currFloorScrollTableData.length"
      :autoScroll="leftModuleC.content.scroll"
      :height="36"
      :contentHeight="180"
    ></app-scroller-table>

    <app-switcher-list-panel
      class="top10"
      :header="leftModuleD.header"
      :dataSource="leftModuleD.content.data"
      @checked="explodeFloor"
    ></app-switcher-list-panel>
  </main>
</template>

<script>
import AppButtonTab from 'components/common/button-tab';
import AppTableCol3 from 'components/common/table/table-col3';
import AppScrollerTable from 'components/common/table/scroller-table';
import AppSwitcherListPanel from 'components/common/switcher-list-panel';
import AppButtonGroup from 'components/common/button-group';

export default {
  props: ['dataSource'],
  data() {
    return {
      elevatorData: this.dataSource.data,

      leftModuleA: this.dataSource['panel-left'][0],
      leftModuleB: this.dataSource['panel-left'][1],
      leftModuleC: this.dataSource['panel-left'][2],
      leftModuleD: this.dataSource['panel-left'][3],

      modeIndex: 0,

      currentFloor: {
        currFloorScrollTableData: [],
        currFloorTableData: [],
      },
    };
  },
  created() {},
  methods: {
    selectElevator(e) {
      this.currentFloor.currFloorScrollTableData = e.item.companies;
      this.currentFloor.currFloorTableData = e.item.devices;
      this.$emit('changeElevator', e);
    },
    /**
     * 切换模式按钮
     * @param i [number] 按钮索引值
     */
    switchFloorRendering(i) {
      if (i !== this.modeIndex) {
        this.currentFloor.currFloorScrollTableData = [];
        this.currentFloor.currFloorTableData = [];
      }
      this.$refs.elevatorBtn.currentIndex = null;
      this.modeIndex = i;
      this.$emit('switchMode', this.leftModuleA.content.data[i]);
    },
    /**
     * 炸开楼层
     */
    explodeFloor(e) {
      this.$emit('explode', e);
    },
    /**
     * 选择楼层内对应设备
     */
    selectFloor(name, obj) {
      this.$emit('selectFloor', name, obj);
    },
    unselectFloor(name, obj) {
      this.$emit('unselectFloor', name, obj);
    },
  },
  components: {
    AppButtonTab,
    AppTableCol3,
    AppScrollerTable,
    AppSwitcherListPanel,
    AppButtonGroup,
  },
};
</script>

<style lang="scss" scoped>
.floor-panel {
  position: relative;
  ::v-deep .analyse {
    min-height: 0;
    padding: 0;
  }
}
</style>>
