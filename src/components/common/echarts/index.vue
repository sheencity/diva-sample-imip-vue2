<template>
  <app-dialog :header="header">
    <div ref="echarts" :style="customStyle"></div>
  </app-dialog>
</template>

<script>
import * as echarts from "echarts";
import AppDialog from "components/common/dialog/dialog";
import { echartService } from 'services/global';

export default {
  props: ["header", "dataSource"],
  data() {
    return {
      customStyle: {
        width: "320px",
        height: "180px",
      },
      type: this.dataSource.type,
    };
  },
  mounted() {
    const chart = echarts.init(this.$refs.echarts);
    console.log(echartService.echartsMap.get(this.type));

    const option = echartService.echartsMap.get(this.type);

    const options = {...option, ...this.dataSource.option};
    chart.setOption(options);
  },
  methods: {},
  components: {
    AppDialog,
  }
};
</script>

<style lang="scss" scoped>

</style>
