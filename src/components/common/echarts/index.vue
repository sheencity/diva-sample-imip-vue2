<template>
  <div ref="echarts" :style="customStyle"></div>
</template>

<script>
import * as echarts from "echarts";
import { echartService } from 'services/global';

export default {
  props: ["width", "height", "dataSource"],
  data() {
    return {
      customStyle: {
        width: (this.width || '320') + 'px',
        height: (this.height || '180') + 'px',
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
};
</script>

<style lang="scss" scoped>

</style>
