<template>
  <article class="space-between">
    <aside class="space-left all">
      <template v-if="parkingPanelData">
        <app-parking-panel
          :header="parkingPanelData.header"
          :dataSource="parkingPanelData.content"
          :switchValue="parkingPanelData.content.analysis.default"
          @switch="switchChange"
          @areaClick="areaChange"
        >
        </app-parking-panel>
      </template>
    </aside>
    <aside class="space-right all">
      <template v-if="echartsPieData">
        <echarts
          :header="echartsPieData.header"
          :dataSource="echartsPieData.content"
        >
        </echarts>
      </template>
      <template v-if="echartsLineData">
        <echarts
          class="top10"
          :header="echartsLineData.header"
          :dataSource="echartsLineData.content"
        >
        </echarts>
      </template>
    </aside>
  </article>
</template>

<script>
import Echarts from "components/common/echarts";
import AppParkingPanel from "components/common/parking-panel";

export default {
  data() {
    return {
      parkingPanelData: null,
      echartsPieData: null,
      echartsLineData: null,
      textListData: null,
    };
  },
  created() {
    this.axios.get('/config/page/park.json').then((res) => {
      this.parkingPanelData = res.data['panel-left'][0];
      this.echartsPieData = res.data['panel-right'][0];
      this.echartsLineData = res.data['panel-right'][1];
      this.textListData = res.data['panel-right'][2];
    });
  },
  methods: {
    switchChange(v) {
      console.log(v);
    },
    areaChange(e) {
      console.log(e);
    }
  },
  components: {
    AppParkingPanel,
    Echarts,
  }
};
</script>

<style lang="scss" scoped>

</style>
