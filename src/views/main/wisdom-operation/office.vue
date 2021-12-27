<template>
  <article v-if="initDivaData" class="space-between">
    <aside class="space-left all">
      
    </aside>
    <aside class="space-right all">
      <app-statistics-panel class="top10" :dataSource="staPanelData"></app-statistics-panel>
      
      <app-echarts 
        class="top10" 
        :header="basicPieData.header"
        :dataSource="basicPieData.content"
      ></app-echarts>

      <app-echarts
        class="top10"
        :header="basicLineData.header"
        :dataSource="basicLineData.content"
      ></app-echarts>
    </aside>
  </article>
</template>

<script>
import { diva } from 'services/global'
import AppStatisticsPanel from 'components/common/statistics-panel'
import AppEcharts from 'components/common/echarts'

export default {
  data() {
    return {
      initDivaData: null,


      staPanelData: null,
      basicPieData: null,
      basicLineData: null,
    };
  },
  created() {
      this.init();
  },
  methods: {
    async init() {
      await this.getConfig()
      this.initScene(this.initDivaData.init.scene_name)
    },
    async getConfig() {
      const { data } = await this.axios.get('config/page/office.json');
      this.initDivaData = data.diva;

      this.staPanelData = data['panel-right'][0];
      this.basicPieData = data['panel-right'][1];
      this.basicLineData = data['panel-right'][2];
    },
    /**
     * 初始化场景
     */
    initScene(name) {
      diva.client?.applyScene(name);
    },
    
  },
  beforeDestroy(){
  },
  destroyed(){
  },
  components: {
    AppStatisticsPanel,
    AppEcharts
  },
};
</script>
<style lang="scss" scoped>


</style>
