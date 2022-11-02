<template>
  <app-dialog :header="header">
    <div ref="echarts" :style="customStyle"></div>
  </app-dialog>
</template>

<script>
import * as echarts from 'echarts';
import { merge } from 'lodash';
import AppDialog from 'components/common/dialog/dialog';
import { echartService } from 'services/global';

export default {
  props: ['header', 'dataSource'],
  data() {
    return {
      customStyle: {
        width: '320px',
        height: '180px',
      },
      type: this.dataSource.type,
    };
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      const chart = echarts.init(this.$refs.echarts);
      let mergeOpt;
      if (this.type) {
        const option = echartService.echartsMap.get(this.type)();
        mergeOpt = merge(option, this.dataSource.option);
      } else {
        mergeOpt = this.dataSource.option;
      }
      chart.setOption(mergeOpt);
    }
  },
  components: {
    AppDialog,
  },
};
</script>

<style lang="scss" scoped>
</style>
