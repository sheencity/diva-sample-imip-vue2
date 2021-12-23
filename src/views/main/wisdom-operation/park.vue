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
    };
  },
  created() {
    this.axios.get('/config/page/park.json').then((res) => {
      this.parkingPanelData = res.data['panel-left'][0];
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
