<template>
  <article class="space-between">
    <aside class="space-left all">
      <template v-if="deviceListData">
        
      </template>
      <template v-if="CH2OData">
        <echarts
          class="top10"
          :header="CH2OData.header"
          :dataSource="CH2OData.content"
        >
        </echarts>
      </template>
      <template v-if="CO2Data">
        <echarts
          class="top10"
          :header="CO2Data.header"
          :dataSource="CO2Data.content"
        >
        </echarts>
      </template>
    </aside>
    <aside class="space-right all">
      <template v-if="tempHumiData">
        <echarts
          :header="tempHumiData.header"
          :dataSource="tempHumiData.content"
        >
        </echarts>
      </template>
      <template v-if="PM25Data">
        <echarts
          class="top10"
          :header="PM25Data.header"
          :dataSource="PM25Data.content"
        >
        </echarts>
      </template>
      <template v-if="VOCData">
        <echarts
          class="top10"
          :header="VOCData.header"
          :dataSource="VOCData.content"
        >
        </echarts>
      </template>
    </aside>
  </article>
</template>

<script>
import Echarts from "components/common/echarts";

export default {
  data() {
    return {
      deviceListData: null,
      CH2OData: null,
      CO2Data: null,
      tempHumiData: null,
      PM25Data: null,
      VOCData: null,
    };
  },
  created() {
    this.axios.get('/config/page/environment.json').then((res) => {
      this.deviceListData = res.data['panel-left'][0];
      this.CH2OData = res.data['panel-left'][1];
      this.CO2Data = res.data['panel-left'][2];
      this.tempHumiData = res.data['panel-right'][0];
      this.PM25Data = res.data['panel-right'][1];
      this.VOCData = res.data['panel-right'][2];
    });
  },
  components: {
    Echarts,
  }
};
</script>

<style lang="scss" scoped>

</style>
