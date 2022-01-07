<template>
  <article v-if="initDivaData" class="space-between">
    <aside class="space-left all">
      <app-table-mulit-col3
        class="top10"
        :dataSource="tablePanelData.content.data"
        :maxItem="4"
        @select="select"
      ></app-table-mulit-col3>
    </aside>
    <aside class="space-right all">
      <app-echarts
        :header="pieChartData.header"
        :dataSource="pieChartData.content"
      ></app-echarts>

      <app-echarts
        class="top10"
        :header="lineChartData.header"
        :dataSource="lineChartData.content"
      ></app-echarts>

      <app-echarts
        class="top10"
        :header="barChartData.header"
        :dataSource="barChartData.content"
      ></app-echarts>
    </aside>
  </article>
</template>

<script>
import { Vector3 } from '@sheencity/diva-sdk-math';
import { POI } from '@sheencity/diva-sdk';
import { diva } from 'services/global';
import AppTableMulitCol3 from 'components/common/table/table-mulit-col3';
import AppEcharts from 'components/common/echarts';

export default {
  data() {
    return {
      initDivaData: null,
      commonConfig: null,
      tablePanelData: null,
      pieChartData: null,
      lineChartData: null,
      barChartData: null,
      /**
       * @type {import("@sheencity/diva-sdk").TypedGroup}
       */
      floorModelGroup: null,
      // 监听应用场景
      cameraSubscription: null,
    };
  },
  async created() {
    await this.init();
    this.initScene(this.initDivaData.init.scene_name);
  },
  async beforeDestroy() {
    // 组件销毁时重置状态
    if (this.floorModelGroup) {
      await diva.drawOutFloor(
        this.floorModelGroup,
        true,
        this.commonConfig.default_floor_index
      );
      await Promise.all(
        Array.from(this.floorModelGroup).map((model) => {
          model instanceof POI
            ? Promise.resolve()
            : model.setRenderingStyleMode('default');
        })
      );
    }
    clearTimeout(this.cameraSubscription);
  },
  methods: {
    async init() {
      await this.getConfig();
      this.commonConfig = this.initDivaData.common;
    },
    async getConfig() {
      const { data } = await this.axios.get('config/page/firecontrol.json');
      this.initDivaData = data.diva;
      this.tablePanelData = data['panel-left'][0];
      this.pieChartData = data['panel-right'][0];
      this.lineChartData = data['panel-right'][1];
      this.barChartData = data['panel-right'][2];
    },
    /**
     * 初始化场景
     * @param[string] e
     */
    async initScene(name) {
      await diva.client?.applyScene(name);
      this.cameraSubscription = setTimeout(() => {
        this.initSceneEffect();
      }, 1500);
    },

    /**
     * 监听应用场景
     */
    async initSceneEffect() {
      this.floorModelGroup = await this.getFloorModelGroup();
      await diva.drawOutFloor(
        this.floorModelGroup,
        false,
        this.commonConfig.default_floor_index
      );
      const floorBoundingInfo = await this.floorModelGroup.getBoundingInfo();
      const floorCoord = floorBoundingInfo.boundingBox.center;
      const focusCoord = floorCoord.add(
        new Vector3(0, this.commonConfig.default_translate_distance, 0)
      );
      await diva.client.request('FocusOnCoord', {
        coord: focusCoord.tuple,
        ...this.commonConfig.floor_focus_param,
      });
    },

    /**
     * 获取当前模型组
     */
    async getFloorModelGroup() {
      const result = await diva.getFloorInfoByName(
        this.commonConfig.resource_group_name
      );
      return result;
    },

    /**
     * 点击列表事件
     * @param name 点击设备名
     * @param e 点击对象
     */
    async select(name, e) {
      const { distance, pitch } = e.focus_param;
      const mode = e.render_mode;
      await this.floorModelGroup.setRenderingStyleMode('default');
      await diva.renderAndFocusOnModelByName(name, distance, pitch, mode);
    },
  },
  components: {
    AppTableMulitCol3,
    AppEcharts,
  },
};
</script>

<style lang="scss" scoped>
</style>