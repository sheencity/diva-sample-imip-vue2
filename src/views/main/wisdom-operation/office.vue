<template>
  <article class="space-between">
    <aside style="position: relative" class="space-left all">
      <!-- 电梯按钮 -->
      <div class="elevator-button">
        <div
          :key="item.num"
          v-for="(item, index) in floors"
          class="item"
          :class="{ 'elevator-selected': item.name === currentFloor.name }"
          @click="switchFloor(item, index)"
        >
          {{ item.name }}
        </div>
      </div>
      <!-- 楼层分析模式 -->
      <div>
        <app-dialog :header-key="header_2">
          <template v-slot:dialog-article>
            <div class="module-2">
              <button
                :key="item.title"
                v-for="(item, index) in floorModes"
                class="pattern"
                :class="{ 'item-selected': item === currentFloor.mode }"
                :ref="'btn' + index"
                @click="switchFloorMode(item)"
              >
                {{ item }}
              </button>
            </div>
          </template>
        </app-dialog>
      </div>
      <!-- 楼层配套 -->
      <div
        class="top10"
        v-show="currentFloor.devices && currentFloor.devices.length > 0"
      >
        <app-dialog :header-key="header_3">
          <template v-slot:dialog-article>
            <app-table-col3
              :tbody="currentFloor.devices"
              :thead="floorDeviceThead"
              :maxItem="4"
              v-on:select="selectModel"
              v-on:unselect="unselect"
            ></app-table-col3>
          </template>
        </app-dialog>
      </div>
      <!-- 楼层企业 -->
      <div
        class="top10"
        v-if="currentFloor.companies && currentFloor.companies.length > 0"
      >
        <app-dialog :header-key="header_4">
          <template v-slot:dialog-article>
            <div class="module-4">
              <app-table-col2
                :thead="floorCompanyThead"
                :data="currentFloor.companies"
                :dataLength="currentFloor.companies.length"
                :height="36"
                :contentHeight="36 * currentFloor.companies.length"
              ></app-table-col2>
            </div>
          </template>
        </app-dialog>
      </div>
      <!-- 楼宇控制 -->
      <div class="top10">
        <app-dialog :header-key="header_1">
          <template v-slot:dialog-article>
            <div class="module-1">
              <span> 楼宇拆分 </span>
              <app-switcher
                v-model="isSplit"
                v-on:change="explode"
              ></app-switcher>
            </div>
          </template>
        </app-dialog>
      </div>
    </aside>
    <aside class="space-right all">
      <div class="top10">
        <app-dialog :header-key="header_5">
          <template v-slot:dialog-article>
            <div class="module-5">
              <div class="statistics">
                <div
                  :key="item.icon"
                  v-for="item in statistics_data"
                  class="item"
                >
                  <img :src="require('../assets/route3-1/' + item.icon)" />
                  <div>
                    <p>{{ item.title }}</p>
                    <p :style="{ color: item.fontColor ? item.fontColor : '' }">
                      {{ item.number }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </app-dialog>
      </div>
      <div class="top10">
        <app-dialog :header-key="header_6">
          <template v-slot:dialog-article>
            <div ref="pieChart" style="width: 320px; height: 180px"></div>
          </template>
        </app-dialog>
      </div>
      <div class="top10">
        <app-dialog :header-key="header_7">
          <template v-slot:dialog-article>
            <div ref="lineChart" style="width: 320px; height: 180px"></div>
          </template>
        </app-dialog>
      </div>
    </aside>
  </article>
</template>

<script>
import * as echarts from "echarts";
import AppDialog from "../components/dialog/dialog";
import AppSwitcher from "../components/switcher/switcher";
import AppTableCol3 from "../components/table/table-col3";
import AppTableCol2 from "../components/table/table-col2";
import { diva, echartService } from "../global";
import { RenderingStyleMode, Vector3 } from "@sheencity/diva-sdk";

export default {
  data() {
    return {
      header_1: "operation-1", //从左到右，从上到下，即第一个组件框
      header_2: "operation-2",
      header_3: "operation-3",
      header_4: "operation-4",
      header_5: "operation-5",
      header_6: "operation-6",
      header_7: "operation-7",
      isSplit: false,
      groupName: null,
      defaultSceneName: null,
      modeToSceneMap: null,
      disassembleGroupOptions: null, // 炸开参数
      emissionOptions: null, // 自发光参数
      entityConfigOptions: null, // 实体配置参数
      floorModes: [], // 可供选择的楼层分析模式
      currentFloor: {
        mode: null, // 当前楼层的分析模式
        name: null, // 当前楼层的名称
        index: null, // 当前楼层的索引
        /**
         * @type {import("@sheencity/diva-sdk").TypedGroup}
         */
        modelGroup: null, // 当前楼层的实体
        companies: [],
        devices: [],
      },
      floorSupport: {},
      // 入驻企业表头
      floorDeviceThead: {},
      floorCompanyThead: {},
      floors: [],
      floorCompanies: {},
      statistics_data: [],
      /**
       * @type {import("@sheencity/diva-sdk").TypedGroup}
       */
      floorsModelGroup: null,
      explodeState: false,
      echartsData: {},
    };
  },
  async created() {
    const { data } = await this.axios.get("https://diva.sheencity.cn/samples/imip-vue2-embedded/data/office.json");
    this.echartsData = data.echarts_data;
    this.floorModes = data.floor_modes;
    this.floorDeviceThead = data.floor_device_thead;
    this.floorCompanyThead = data.floor_company_thead;
    this.floors = data.floors;
    this.statistics_data = data.statistics_data;
    this.groupName = data.group_name;
    this.defaultSceneName = data.default_scene_name;
    this.currentFloor.mode = data.default_mode;
    this.modeToSceneMap = new Map(data.floor_mode_to_scene_name);
    this.disassembleGroupOptions = data.disassemble_group_options;
    this.emissionOptions = data.emission_options;
    this.entityConfigOptions = data.entity_config.options;
    this.initCharts();
    await this.initScene();
    await this.getFloorsInfo();
    this.floorsModelGroup?.forEach(model => {
      if (new RegExp('POI卫生间').test(model.name)) {
        diva.setEntityVisibleByName(model.name, true);
      }
    })
  },
  updated() {
    if (this.$refs.btn0) {
      // this.floorModes?.forEach((e, index) => {
      //   const domName = "btn" + index;
      //   this.$refs[domName][0].addEventListener("click", () => {
      //     this.switchFloorMode(e);
      //   });
      // });
    }
  },
  async destroyed() {
    if (this.explodeState) {
      await this.floorsModelGroup?.assemble();
    }
    await this.resetFloorMode();
  },

  methods: {
    initCharts() {
      const pieChart = echarts.init(this.$refs.pieChart);
      const lineChart = echarts.init(this.$refs.lineChart);
      const pieOption = echartService.getPieOption(
        this.echartsData.people_entry_analysis,
        true,
        true,
        true
      );
      const lineOption = echartService.getTimeLineOption(
        this.echartsData.people_entry_counts,
        false
      );
      pieChart.setOption(pieOption);
      lineChart.setOption(lineOption);
    },
    /**
     * 重置楼层模式
     */
    async resetFloorMode() {
      const { mode, modelGroup, index } = this.currentFloor;
      if (mode === "抽出" && modelGroup) {
        await diva.drawOutFloor(modelGroup, true, index);
        return;
      }
      if (mode === "独立" && modelGroup) {
        this.floorsModelGroup.forEach(async (modelGroup) => {
          await modelGroup.setRenderingStyleMode(RenderingStyleMode.Default);
        });
        await this.floorsModelGroup.setVisibility(true);
        return;
      }
      if (mode === "高亮" && modelGroup) {
        this.floorsModelGroup.forEach(async (modelGroup) => {
          await modelGroup.setRenderingStyleMode(RenderingStyleMode.Default);
        });
      }
    },
    async initScene() {
      await diva?.client?.applyScene(this.defaultSceneName);
    },
    async getFloorsInfo() {
      this.floorsModelGroup = await diva.client?.getModelGroupByGroupPath(
        this.groupName
      );
    },
    async getFloorInfoByName(floorName) {
      const name = this.groupName + "/" + floorName;
      const result = await diva.getFloorInfoByName(name);
      return result;
    },
    async explode(explodeState) {
      if (explodeState) {
        await this.floorsModelGroup?.disassemble(this.disassembleGroupOptions);
      } else {
        await this.floorsModelGroup?.assemble();
      }
      this.explodeState = explodeState;
    },
    /**
     * 根据模式来切换功能
     */
    async displayFloorByMode(floorModelGroup, mode, index) {
      if (mode === "抽出") {
        await diva.drawOutFloor(floorModelGroup, false, index + 1);
        return;
      }
      if (mode === "独立") {
        // 隐藏除当前楼层外所有楼层
        await this.floorsModelGroup.setVisibility(false);
        await floorModelGroup.setVisibility(true);
        return;
      }
      if (mode === "高亮") {
        // 当前层默认其他楼层半透明
        this.setHighlightMode(floorModelGroup);
        return;
      }
    },
    // 高亮效果
    async setHighlightMode(floorModelGroup) {
      this.floorsModelGroup.forEach(async (modelGroup) => {
        await modelGroup.setRenderingStyleMode(
          RenderingStyleMode.Emission,
          this.emissionOptions
        );
      });
      await floorModelGroup.setRenderingStyleMode(RenderingStyleMode.Default);
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
        companies: null,
        devices: null
      };
    },
    /**
     * 切换楼层模式
     */
    async switchFloorMode(mode) {
      if (this.currentFloor.mode === mode) {
        return;
      }
      await this.resetFloorMode();
      this.clearCurrentFloorInfo();
      this.currentFloor.mode = mode;
      const sceneName = this.modeToSceneMap.get(mode);
      await diva.client?.applyScene(sceneName, { camera: true, visibility: false });
      this.floorsModelGroup.forEach(model => {
      if (new RegExp('POI卫生间').test(model.name)) {
        diva.setEntityVisibleByName(model.name, true);
      }
    })
    },
    /**
     * 切换楼层
     */
    async switchFloor(floor, index) {
      if (this.currentFloor.name === floor.name) {
        return;
      }
      if (
        this.currentFloor.modelGroup &&
        this.currentFloor.index &&
        this.currentFloor.mode === "抽出"
      ) {
        await diva.drawOutFloor(this.currentFloor.modelGroup, true, index);
      }

      if (
        this.currentFloor.modelGroup &&
        this.currentFloor.index
      ) {
        await this.currentFloor.modelGroup.setRenderingStyleMode(RenderingStyleMode.Default);
        // await diva.drawOutFloor(this.currentFloor.modelGroup, true, index);
      }
      
      this.currentFloor.name = floor.name;
      this.currentFloor.modelGroup = await this.getFloorInfoByName(floor.name);
      this.currentFloor.index = index;
      // 获取楼层配套设备信息
      this.getFloorDevicesByName(floor.name);
      // 获取楼层入驻企业
      this.getFloorCompaniesByName(floor.name);
      // const [floorModel] = await diva.getEntitiesByName(floor.name);
      await this.displayFloorByMode(
        this.currentFloor.modelGroup,
        this.currentFloor.mode,
        index + 1
      );
      const floorConfig = this.entityConfigOptions.find(
        (option) => option.type === "floor"
      );
      const { distance, pitch } = floorConfig.focus_param;
      const translate = floorConfig.default_translate_distance;

      // TODO: 楼层抽出的偏移量存放到配置文件中
      const floorBoundingInfo =
        await this.currentFloor.modelGroup.getBoundingInfo();
      const floorCoord = floorBoundingInfo.boundingBox.center;
      const focusCoord =
        this.currentFloor.mode === "抽出"
          ? floorCoord.add(new Vector3(0, translate, 0))
          : floorCoord;
      await diva.client.request("FocusOnCoord", {
        coord: focusCoord.tuple,
        pitch: pitch,
        distance,
      });
    },
    /**
     * 楼层配套
     */
    getFloorDevicesByName(floorName) {
      const { devices } = this.floors.find(
        (floor) => floor.name === floorName
      ) || { devices: [] };
      this.currentFloor.devices = devices;
    },
    getFloorCompaniesByName(floorName) {
      const { companies } = this.floors.find(
        (floor) => floor.name === floorName
      ) || { companies: [] };
      this.currentFloor.companies = companies;
    },
    /**
     * 聚焦到指定实体目标上
     */
    async selectModel(name) {
      const device = this.currentFloor.devices.find(
        (device) => device.name === name
      );

      const option = this.entityConfigOptions.find(option => option.category === device.category);
      const { distance, pitch } = option.focus_param;
      const mode = option.render_mode;
      if (device.category === "楼梯") {
        await diva.renderAndFocusOnModelByName(name, distance, pitch, mode);
      }
      if (device.category === "卫生间") {
        await diva.focusOnModelByName(name, distance, pitch);
      }
    },
    /**
     * 取消实体的聚焦状态
     */
    async unselect(name) {
      await diva.setModelDefaultRenderModel(name);
    }
  },
  components: {
    AppDialog,
    AppSwitcher,
    AppTableCol3,
    AppTableCol2
  }
};
</script>

<style scoped lang="scss">
.elevator-button {
  position: absolute;
  display: flex;
  flex-direction: column;
  z-index: 1;
  top: 0px;
  right: -120px;
  .elevator-selected {
    background: rgba(5, 205, 157, 0.6) !important;
  }
  .item {
    width: 52px;
    height: 36px;
    margin-bottom: 4px;
    font-weight: 500;
    font-size: 14px;
    line-height: 36px;
    text-align: center;
    background: rgba(4, 14, 29, 0.6);
    border: 1px solid rgba(5, 205, 157, 0.6);
    box-sizing: border-box;
    border-radius: 4px;
    text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.5);
    &:hover {
      background: rgba(5, 205, 157, 0.6);
    }
  }
}

.module-1 {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    width: 132px;
    height: 20px;
    font-size: 14px;
    line-height: 19px;
    text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.5);
  }
}
.module-2 {
  width: 100%;
  display: flex;
  justify-content: space-between;
  .pattern {
    width: 155px;
    height: 36px;
    border: 1px solid rgba(5, 205, 157, 0.3);
    border-radius: 4px;
    background: transparent;
    font-weight: 500;
    font-size: 14px;
    color: #ffffff;
    vertical-align: middle;
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
}
.module-5 {
  .statistics {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .item {
      width: 148px;
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    p:first-of-type {
      height: 16px;
      text-align: right;
      font-size: 12px;
      line-height: 16px;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 4px;
    }
    p:last-of-type {
      height: 20px;
      font-weight: bold;
      font-size: 20px;
      line-height: 20px;
      text-align: right;
      letter-spacing: 1px;
      color: #caff87;
      font-family: "Saira";
    }
  }
}
</style>
