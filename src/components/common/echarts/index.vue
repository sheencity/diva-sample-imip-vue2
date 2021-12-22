<template>
  <div ref="echarts" :style="customStyle"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  props: ["width", "height", "dataSource"],
  data() {
    return {
      customStyle: {
        width: (this.width || '360') + 'px',
        height: (this.height || '180') + 'px',
      },
    };
  },
  mounted() {
    const chart = echarts.init(this.$refs.echarts);
    const option = this.getEchartsOptionByType('type');

    const options = {...option, ...this.dataSource.option};
    chart.setOption(options);
  },
  methods: {
    getEchartsOptionByType(type) {
      // TODO
    },
  }
};
</script>

<style lang="scss" scoped>

</style>
