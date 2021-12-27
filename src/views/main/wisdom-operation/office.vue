<template>
  <article v-if="initDivaData" class="space-between">
    <aside class="space-left all">
      <app-floor-panel 
        class="top10" 
        :dataSource="floorPanelData"
        @explode="explodeFloor"
        @switchMode="switchFloorRendering"
        @selectFloor="selectFloor"
        @unselectFloor="unselectFloor"
      ></app-floor-panel>
    </aside>
    <aside class="space-right all">
      <app-statistics-panel 
        class="top10" 
        :dataSource="staPanelData"
      ></app-statistics-panel>

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
import AppFloorPanel from 'components/floor-panel'
import AppStatisticsPanel from 'components/common/statistics-panel'
import AppEcharts from 'components/common/echarts'

export default {
  data() {
    return {
      initDivaData: null,

      floorPanelData: null,
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
      this.floorPanelData = data['panel-left'][0];
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
    /**
     * 炸开楼层
     */
    explodeFloor(e){
      console.log(e)
    },
    /**
     * 切换楼梯渲染模式
     */
    switchFloorRendering(i){
      console.log(i)
    },
    /**
     * 选择楼层对应设备
     */
    selectFloor(name,item){
      console.log({name,item})
    },
    /**
     * 取消上次选择的设备
     */
    unselectFloor(oldName,item){
      console.log({oldName,item})
    }
  },
  beforeDestroy(){
  },
  destroyed(){
  },
  components: {
    AppStatisticsPanel,
    AppEcharts,
    AppFloorPanel
  },
};
</script>
<style lang="scss" scoped>


</style>
