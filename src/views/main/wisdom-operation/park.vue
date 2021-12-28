<template>
  <article class="space-between">
    <aside class="space-left all">
      <template v-if="parkingPanelData">
        <app-parking-panel
          :header="parkingPanelData.header"
          :dataSource="parkingPanelData.content"
          :checked="parkingPanelData.content.analysis.default"
          @switch="switchChange"
          @areaClick="areaChange"
        >
        </app-parking-panel>
      </template>
    </aside>
    <aside class="space-right all">
      <template v-if="echartsPieData">
        <echarts
          :header="echartsPieData.header"
          :dataSource="echartsPieData.content"
        >
        </echarts>
      </template>
      <template v-if="echartsLineData">
        <echarts
          class="top10"
          :header="echartsLineData.header"
          :dataSource="echartsLineData.content"
        >
        </echarts>
      </template>
      <template v-if="textListData">
        <app-scroller-table
          class="top10"
          :header="textListData.header"
          :dataSource="textListData.content.data"
          :thead="textListData.content.header"
          :dataLength="textListData.content.data.length"
          :autoScroll="textListData.content.scroll"
          :height="36"
          :contentHeight="220"
        >
        </app-scroller-table>
      </template>
    </aside>
  </article>
</template>

<script>
import Echarts from "components/common/echarts";
import AppParkingPanel from "components/common/parking-panel";
import AppScrollerTable from "components/common/table/scroller-table";
import { diva } from "services/global";

export default {
  data() {
    return {
      divaData: null,
      parkingPanelData: null,
      echartsPieData: null,
      echartsLineData: null,
      textListData: null,
      // 当前显示的模型路径
      currentShowPath: new Map(),
    };
  },
  created() {
    this.axios.get('/config/page/park.json').then((res) => {
      this.divaData = res.data.diva;
      this.parkingPanelData = res.data['panel-left'][0];
      this.echartsPieData = res.data['panel-right'][0];
      this.echartsLineData = res.data['panel-right'][1];
      this.textListData = res.data['panel-right'][2];

      this.initScene();
    });
  },
  destroyed() {
    Array.from(this.currentShowPath.values())
      .forEach((path) => diva.setEntityVisibleByGroup(path, false));
  },
  methods: {
    // 初始化场景
    async initScene() {
      this.getBasicInfo();

      await diva.client?.applyScene(this.divaData.init.scene_name);
      await diva.setEntityVisibleByGroup(this.currentShowPath.get('carsPath'), true);

      // 计算场景模型中的汽车数量
      const models = await diva.client?.getEntitiesByGroupPath(this.currentShowPath.get('carsPath'));
      this.parkingPanelData.content.data.forEach((item) => {
        item.rest =
          models.filter((entity) => entity.group.match(item.title)).length || item.rest;
      });
    },
    // 获取需要设置显示隐藏的路径信息
    getBasicInfo() {
      const carsPath = this.divaData.init.model
        .map((model) => model.group)[0];
      const areaPath = this.parkingPanelData.content.analysis.diva.model
        .map((model) => model.group)[0];
      this.currentShowPath.set('carsPath', carsPath);
      this.currentShowPath.set('areaPath', areaPath);
    },
    // 车位使用透视开关
    switchChange(v) {
      console.log(v);
      diva.client?.applyScene(this.divaData.init.scene_name, {
        camera: true,
        visibility: false,
      });
      diva.setEntityVisibleByGroup(this.currentShowPath.get('areaPath'), v);
    },
    // 停车区点击聚焦和显示对应体块
    async areaChange(e) {
      console.log(e);
      await diva.setEntityVisibleByGroup(this.currentShowPath.get('areaPath'), false);
      const focusOption = this.parkingPanelData.content.diva.action
        .filter((action) => action.name === 'focus')[0]
        .param;

      e.diva.model.forEach((model) => {
        if (model.name) {
          diva.focusOnModelByName(model.name, focusOption.distance, focusOption.pitch);
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
    Echarts,
  }
};
</script>

<style lang="scss" scoped>

</style>
