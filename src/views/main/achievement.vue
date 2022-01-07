<template>
  <article class="space-between">
    <aside class="space-left all">
      <app-statistics-panel
        v-if="statisticsData"
        :dataSource="statisticsData"
      ></app-statistics-panel>

      <app-basic-info
        class="top10"
        v-if="basicInfoData"
        :header="basicInfoData.header"
        :dataSource="basicInfoData.content.data"
      ></app-basic-info>

      <app-scroller-table
        class="top10"
        v-if="textListData"
        :header="textListData.header"
        :dataSource="textListData.content.data"
        :thead="textListData.content.header"
        :dataLength="textListData.content.data.length"
        :autoScroll="textListData.content.scroll"
        :height="36"
        :contentHeight="220"
      ></app-scroller-table>
    </aside>
    <aside class="space-right all">
      <app-echarts
        v-if="ringPieData"
        :header="ringPieData.header"
        :dataSource="ringPieData.content"
      ></app-echarts>

      <app-echarts
        class="top10"
        v-if="basicBarData"
        :header="basicBarData.header"
        :dataSource="basicBarData.content"
      ></app-echarts>

      <app-echarts
        class="top10"
        v-if="horBarData"
        :header="horBarData.header"
        :dataSource="horBarData.content"
      ></app-echarts>
    </aside>
  </article>
</template>

<script>
import AppDialog from 'components/common/dialog/dialog';
import AppBasicInfo from 'components/common/basic-info';
import AppStatisticsPanel from 'components/common/statistics-panel';
import AppScrollerTable from 'components/common/table/scroller-table';
import AppEcharts from 'components/common/echarts';
import { diva } from 'services/global';

export default {
  data() {
    return {
      initDivaData: null,
      statisticsData: null,
      basicInfoData: null,
      textListData: null,
      ringPieData: null,
      basicBarData: null,
      horBarData: null
    };
  },
  async created() {
    this.init();
  },
  methods: {
    async init(){
      // 获取 json 配置数据
      await this.getConfig();
      this.initScene();
    },
    async getConfig(){
      const { data } = await this.axios.get('/config/page/achievement.json');
      this.initDivaData = data.diva;
      this.statisticsData = data['panel-left'][0];
      this.basicInfoData = data['panel-left'][1];
      this.textListData = data['panel-left'][2];
      this.ringPieData = data['panel-right'][0];
      this.basicBarData = data['panel-right'][1];
      this.horBarData = data['panel-right'][2];
    },
    initScene() {
      diva?.client?.applyScene(this.initDivaData.init.scene_name);
    },
  },
  components: {
    AppDialog,
    AppBasicInfo,
    AppStatisticsPanel,
    AppScrollerTable,
    AppEcharts,
  },
};
</script>

<style lang="scss" scoped>

</style>
