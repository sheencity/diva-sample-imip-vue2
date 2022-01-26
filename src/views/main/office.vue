<template>
  <article v-if="divaParams" class="space-between">
    <aside class="space-left all">
      <app-floor-panel
        class="card-mt"
        :dataSource="floorPanel"
        @changeElevator="changeElevator"
        @explode="explodeFloor"
        @switchMode="switchFloorRendering"
        @selectFloor="selectFloor"
        @unselectFloor="unselectFloor"
      ></app-floor-panel>
    </aside>
    <aside class="space-right all">
      <app-statistics-panel
        class="card-mt"
        :dataSource="staPanel"
      ></app-statistics-panel>

      <app-echarts
        class="card-mt"
        :header="basicPie.header"
        :dataSource="basicPie.content"
      ></app-echarts>

      <app-echarts
        class="card-mt"
        :header="basicLine.header"
        :dataSource="basicLine.content"
      ></app-echarts>
    </aside>
  </article>
</template>

<script>
import { RenderingStyleMode } from '@sheencity/diva-sdk';
import { diva } from 'services/global';
import AppFloorPanel from 'components/floor-panel';
import AppStatisticsPanel from 'components/common/statistics-panel';
import AppEcharts from 'components/common/echarts';

export default {
  data() {
    return {
      /**
       * @type {import("@sheencity/diva-sdk").TypedGroup}
       */
      floorsModelGroup: null,
      divaParams: null,
      floorPanel: null,
      staPanel: null,
      basicPie: null,
      basicLine: null,
      groupName: '',

      explodeState: false, // 楼层是否炸开
      currentFloor: {
        // 当前楼层信息
        mode: '', // 当前楼层的分析模式
        name: null, // 当前楼层的名称
        index: null, // 当前楼层的索引
        /**
         * @type {import("@sheencity/diva-sdk").TypedGroup}
         */
        modelGroup: null, // 当前楼层的实体
      },
      emissionOptions: null, // 自发光参数
      floorConfig: null, // 楼层动作参数
      deviceConfig: null, // 设备动作参数
    };
  },
  created() {
    this.init();
  },
  async destroyed() {
    if (this.explodeState) {
      await this.floorsModelGroup?.assemble();
    }
    await this.resetFloorMode();
  },
  methods: {
    async init() {
      await this.initConfig();
      await this.initScene(this.divaParams.init.scene_name);
      this.switchFloorRendering(this.floorPanel['panel-left'][0].content.data[0]);
      this.floorConfig = this.floorPanel['floor-btn-group'].diva.action[0].param;
    },
    
    async initConfig() {
      const { data } = await this.axios.get('config/page/office.json');
      this.divaParams = data.diva;
      [ this.floorPanel ] = data['panel-left'];
      [ this.staPanel, this.basicPie, this.basicLine ] = data['panel-right'];
      this.groupName = data.diva.common.group_name;
      this.currentFloor.mode = data.diva.common.default_mode;
      this.floorsModelGroup = await diva.getFloorInfoByName(this.groupName);
    },
    /**
     * 初始化场景
     */
    async initScene(name) {
      await diva.applySceneByName(name);
    },
    /**
     * 切换电梯按钮楼层
     */
    async changeElevator({ index, item: floor }) {
      if (this.currentFloor.name === floor.name) {
        return;
      }
      if (this.currentFloor.modelGroup && this.currentFloor.index) {
        await this.currentFloor.modelGroup.setRenderingStyleMode(
          RenderingStyleMode.Default
        );
      }
      this.currentFloor.name === floor.name;
      this.currentFloor.modelGroup = await this.getFloorInfoByName(floor.name);
      this.currentFloor.index = index;
      await this.displayFloorByMode(
        this.currentFloor.modelGroup,
        this.currentFloor.mode
      );
      const floorBoundingInfo =
        await this.currentFloor.modelGroup.getBoundingInfo();
      const floorCoord = floorBoundingInfo.boundingBox.center;
      await diva.focusOnCoord({
        coord: floorCoord.tuple,
        ...this.floorConfig,
      });
    },
    /**
     * 切换楼梯渲染模式
     */
    async switchFloorRendering(e) {
      const sceneName = e.diva.init.scene_name;
      const { param } = e.diva.action[0];
      if (e.title === '高亮') {
        this.emissionOptions = param;
      }
      await this.resetFloorMode();
      this.clearCurrentFloorInfo();
      this.currentFloor.mode = e.title;
      await diva.applySceneByName(sceneName, {
        camera: true,
        visibility: false,
      });
      this.floorsModelGroup.forEach((model) => {
        if (new RegExp('POI卫生间').test(model.name)) {
          diva.setEntityVisibleByName(model.name, true);
        }
      });
    },
    /**
     * 聚焦到指定实体目标上
     */
    async selectFloor(name, device) {
      this.deviceConfig =
        this.floorPanel['panel-left'][1].content.diva.action;
      const mode = this.deviceConfig[0].name;
      const { distance, pitch } = this.deviceConfig[1].param;
      if (device.category === '楼梯') {
        await diva.renderAndFocusOnModelByName(name, distance, pitch, mode);
      }
      if (device.category === '卫生间') {
        await diva.focusOnModelByName(name, distance, pitch);
      }
    },
    /**
     * 取消实体的聚焦状态
     */
    async unselectFloor(name) {
      await diva.setModelDefaultRenderModel(name);
    },
    /**
     * 炸开楼层
     */
    async explodeFloor(e) {
      if (e.default) {
        await this.floorsModelGroup?.disassemble(e.diva.action[0].param);
      } else {
        await this.floorsModelGroup?.assemble();
      }
      this.explodeState = e.default;
    },
    /**
     * 根据模式来切换功能
     */
    async displayFloorByMode(floorModelGroup, mode) {
      if (mode === '独立') {
        // 隐藏除当前楼层外所有楼层
        await this.floorsModelGroup.setVisibility(false);
        await floorModelGroup.setVisibility(true);
        return;
      }
      if (mode === '高亮') {
        // 当前层默认其他楼层半透明
        this.setHighlightMode(floorModelGroup);
        return;
      }
    },
    /**
     * 设置高亮效果
     */
    async setHighlightMode(floorModelGroup) {
      console.log(this.emissionOptions)
      this.floorsModelGroup.forEach(async (modelGroup) => {
        await diva.renderEmissionModelById(
          modelGroup.id,
          RenderingStyleMode.Emission,
          this.emissionOptions
        )
      });
      await floorModelGroup.setRenderingStyleMode(RenderingStyleMode.Default);
    },
    /**
     * 重置楼层模式
     */
    async resetFloorMode() {
      const { mode, modelGroup } = this.currentFloor;
      if (mode === '独立' && modelGroup) {
        this.floorsModelGroup.forEach(async (modelGroup) => {
          await modelGroup.setRenderingStyleMode(RenderingStyleMode.Default);
        });
        await this.floorsModelGroup.setVisibility(true);
        return;
      }
      if (mode === '高亮' && modelGroup) {
        this.floorsModelGroup.forEach(async (modelGroup) => {
          await modelGroup.setRenderingStyleMode(RenderingStyleMode.Default);
        });
      }
    },
    /**
     * 重置当前楼层信息
     */
    clearCurrentFloorInfo() {
      this.currentFloor = {
        mode: null,
        name: null,
        index: null,
        modelGroup: null,
      };
    },
    /**
     * 根据名称获取楼层
     */
    async getFloorInfoByName(floorName) {
      const name = this.groupName + '/' + floorName;
      const result = await diva.getFloorInfoByName(name);
      return result;
    },
  },
  components: {
    AppStatisticsPanel,
    AppEcharts,
    AppFloorPanel,
  },
};
</script>
<style lang="scss" scoped>
</style>
