<template>
  <article class="space-between">
    <aside class="space-left all">
      <app-statistics-panel
        v-if="statistics"
        :dataSource="statistics"
      ></app-statistics-panel>

      <app-basic-info
        class="card-mt"
        v-if="basicInfo"
        :header="basicInfo.header"
        :dataSource="basicInfo.content.data"
      ></app-basic-info>

      <app-scroller-table
        class="card-mt"
        v-if="textList"
        :header="textList.header"
        :dataSource="textList.content.data"
        :thead="textList.content.header"
        :dataLength="textList.content.data.length"
        :autoScroll="textList.content.scroll"
        :height="36"
        :contentHeight="220"
      ></app-scroller-table>
    </aside>
    <aside class="space-right all">
      <app-echarts
        v-if="ringPie"
        :header="ringPie.header"
        :dataSource="ringPie.content"
      ></app-echarts>

      <app-echarts
        class="card-mt"
        v-if="basicBar"
        :header="basicBar.header"
        :dataSource="basicBar.content"
      ></app-echarts>

      <app-echarts
        class="card-mt"
        v-if="horBar"
        :header="horBar.header"
        :dataSource="horBar.content"
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
      divaParams: null,
      statistics: null,
      basicInfo: null,
      textList: null,
      ringPie: null,
      basicBar: null,
      horBar: null
    };
  },
  async created() {
    this.init();
  },
  methods: {
    async init(){
      await this.initConfig();
      await this.initScene();
    },
    async initConfig() {
      const { data } = await this.axios.get('config/page/achievement.json');
      this.divaParams = data.diva;
      [this.statistics, this.basicInfo, this.textList] = data['panel-left'];
      [this.ringPie, this.basicBar, this.horBar] = data['panel-right'];
    },
    async initScene() {
      await diva.applySceneByName(this.divaParams.init.scene_name);
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
