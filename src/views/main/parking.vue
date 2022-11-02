<template>
  <article class="space-between">
    <aside class="space-left all">
      <app-parking-panel
        v-if="parkingPanel"
        :header="parkingPanel.header"
        :dataSource="parkingPanel.content"
        :checked="parkingPanel.content.analysis.default"
        @switch="switchChange"
        @areaClick="areaChange"
      ></app-parking-panel>
    </aside>
    <aside class="space-right all">
      <app-echarts
        v-if="echartsPie"
        :header="echartsPie.header"
        :dataSource="echartsPie.content"
      ></app-echarts>

      <app-echarts
        class="top10"
        v-if="echartsLine"
        :header="echartsLine.header"
        :dataSource="echartsLine.content"
      ></app-echarts>

      <app-scroller-table
        class="top10"
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
  </article>
</template>

<script>
import AppEcharts from 'components/common/echarts';
import AppParkingPanel from 'components/common/parking-panel';
import AppScrollerTable from 'components/common/table/scroller-table';
import { diva } from 'services/global';

export default {
  data() {
    return {
      divaParams: null,
      parkingPanel: null,
      echartsPie: null,
      echartsLine: null,
      textList: null,
      // 当前显示的模型路径
      currentShowPath: new Map(),
    };
  },
  async created() {
    await this.init();
  },
  destroyed() {
    Array.from(this.currentShowPath.values())
      .forEach((path) => diva.setEntityVisibleByGroup(path, false));
  },
  methods: {
    async init() {
      await this.initConfig();
      await this.initScene();
    },

    async initConfig() {
      const { data } = await this.axios.get('config/page/park.json');
      this.divaParams = data.diva;
      [this.parkingPanel] = data['panel-left'];
      [this.echartsPie, this.echartsLine, this.textList] = data['panel-right'];
    },

    /**
     * 初始化场景
     */
    async initScene() {
      this.initBasicInfo();

      await diva.applySceneByName(this.divaParams.init.scene_name);
      await diva.setEntityVisibleByGroup(this.currentShowPath.get('carsPath'), true);

      // 计算场景模型中的汽车数量
      const models = await diva.client?.getEntitiesByGroupPath(this.currentShowPath.get('carsPath'));
      this.parkingPanel.content.data.forEach((item) => {
        item.rest =
          models.filter((entity) => entity.group.match(item.title)).length || item.rest;
      });
    },

    /**
     * 获取需要设置显示隐藏的路径信息
     */
    initBasicInfo() {
      const carsPath = this.divaParams.init.model
        .map((model) => model.group)[0];
      const areaPath = this.parkingPanel.content.analysis.diva.model
        .map((model) => model.group)[0];
      this.currentShowPath.set('carsPath', carsPath);
      this.currentShowPath.set('areaPath', areaPath);
    },

    /**
     * 车位使用透视开关
     */
    switchChange(v) {
      diva.applySceneByName(this.divaParams.init.scene_name, {
        camera: true,
        visibility: false,
      });
      diva.setEntityVisibleByGroup(this.currentShowPath.get('areaPath'), v);
    },
    
    /**
     * 停车区点击聚焦和显示对应体块
     */
    async areaChange(e) {
      await diva.setEntityVisibleByGroup(this.currentShowPath.get('areaPath'), false);
      const { distance, pitch } = this.parkingPanel.content.diva.action
        .filter((action) => action.name === 'focus')[0]
        .param;

      e.diva.model.forEach((model) => {
        if (model.name) {
          diva.focusOnModelByName(model.name, distance, pitch);
          diva.setEntityVisibleByName(model.name, true);
        }
        if (model.group) {
          diva.setEntityVisibleByGroup(model.group, true);
        }
      });
    }
  },
  components: {
    AppParkingPanel,
    AppScrollerTable,
    AppEcharts,
  },
};
</script>

<style lang="scss" scoped>

</style>
