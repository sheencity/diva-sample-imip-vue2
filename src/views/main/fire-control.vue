<template>
  <article v-if="divaParams" class="space-between">
    <aside class="space-left all">
      <app-table-multi-col3
        class="card-mt"
        :dataSource="tablePanel.content.data"
        :maxItem="4"
        @select="select"
      ></app-table-multi-col3>
    </aside>
    <aside class="space-right all">
      <app-echarts
        :header="pieChart.header"
        :dataSource="pieChart.content"
      ></app-echarts>

      <app-echarts
        class="card-mt"
        :header="lineChart.header"
        :dataSource="lineChart.content"
      ></app-echarts>

      <app-echarts
        class="card-mt"
        :header="barChart.header"
        :dataSource="barChart.content"
      ></app-echarts>
    </aside>
  </article>
</template>

<script>
import { Vector3 } from '@sheencity/diva-sdk-math';
import { POI } from '@sheencity/diva-sdk';
import { diva } from 'services/global';
import AppTableMultiCol3 from 'components/common/table/table-multi-col3';
import AppEcharts from 'components/common/echarts';

export default {
  data() {
    return {
      divaParams: null,
      commonConfig: null,
      tablePanel: null,
      pieChart: null,
      lineChart: null,
      barChart: null,
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
      await this.initConfig();
      await this.initScene();
    },
    async initConfig() {
      const { data } = await this.axios.get('config/page/firecontrol.json');
      this.divaParams = data.diva;
      [ this.tablePanel ] = data['panel-left'];
      [ this.pieChart, this.lineChart, this.barChart ] = data['panel-right'];
      this.commonConfig = this.divaParams.common;
    },
    /**
     * 初始化场景
     */
    async initScene() {
      await diva.applySceneByName(this.divaParams.init.scene_name);
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
      await diva.focusOnCoord({
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
    AppTableMultiCol3,
    AppEcharts,
  },
};
</script>

<style lang="scss" scoped>
</style>