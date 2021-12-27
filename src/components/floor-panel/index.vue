<template>
  <main class="floor-panel">
    <app-button-group 
      :items="elevatorData"
      @change="selectElevator"
    ></app-button-group>

    <app-button-tab 
      class="top10"
      :header="leftModuleA.header"
      :dataSource="leftModuleA.content"
    ></app-button-tab>

    <app-table-col3
      class="top10"
      v-show="currFloorTableData.length"
      :maxItem="4"
      :header="leftModuleB.header"
      :thead="leftModuleB.content.head"
      :dataSource="currFloorTableData"
    ></app-table-col3>

    <app-scroller-table
      class="top10"
      v-show="currFloorScrollTableData.length"
      :header="leftModuleC.header"
      :thead="leftModuleC.content.header"
      :dataSource="currFloorScrollTableData"
      :dataLength="currFloorScrollTableData.length"
      :autoScroll="leftModuleC.content.scroll"
      :height="36"
      :contentHeight="180"
    ></app-scroller-table>

    <app-switcher-list-panel
      class="top10"
      :header="leftModuleD.header"
      :dataSource="leftModuleD.content.data"
    ></app-switcher-list-panel>
  </main>
  
</template>

<script>
import AppButtonTab from 'components/common/button-tab'
import AppTableCol3 from 'components/common/table/table-col3'
import AppScrollerTable from 'components/common/table/scroller-table'
import AppSwitcherListPanel from 'components/common/switcher-list-panel'
import AppButtonGroup from 'components/common/button-group'

export default {
  props: ['dataSource'],
  data(){
    return{
      elevatorData: this.dataSource.data,
      DIVA: null,

      leftModuleA: this.dataSource['panel-left'][0],
      leftModuleB: this.dataSource['panel-left'][1],
      leftModuleC: this.dataSource['panel-left'][2],
      leftModuleD: this.dataSource['panel-left'][3],

      currFloorScrollTableData: [],
      currFloorTableData: [],
    }
  },
  created(){
    console.log(this.dataSource);
  }, 
  methods: {
    selectElevator(e){
      this.currFloorScrollTableData = e.item.companies;
      this.currFloorTableData = e.item.devices;
    }
  },
  components: {
    AppButtonTab,
    AppTableCol3,
    AppScrollerTable,
    AppSwitcherListPanel,
    AppButtonGroup
  }
}
</script>

<style lang="scss" scoped>
  .floor-panel {
    position: relative;
    ::v-deep .analyse{
      min-height: 0;
      padding: 0;
    }
  }
  
</style>>
