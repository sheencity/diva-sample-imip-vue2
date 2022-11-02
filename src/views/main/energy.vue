<template>
  <article v-if="divaParams" class="space-between">
    <aside class="space-left all">
      <app-button-tab
        class="card-mt"
        :header="buttonTab.header"
        :dataSource="buttonTab.content"
        @select="selectResources"
      ></app-button-tab>

      <app-echarts
        class="card-mt"
        :key="currCategoryIndex + 'bar'"
        :header="barCharts[currCategoryIndex].header"
        :dataSource="barCharts[currCategoryIndex].content"
      ></app-echarts>

      <app-echarts
        class="card-mt"
        :key="currCategoryIndex + 'pie'"
        :header="pieCharts[currCategoryIndex].header"
        :dataSource="pieCharts[currCategoryIndex].content"
      ></app-echarts>
    </aside>
    <aside class="space-right all">
      <app-switcher-list-panel
        class="card-mt"
        :header="switchPanel.header"
        :dataSource="switchPanel.content.data"
        @checked="checked"
      ></app-switcher-list-panel>
    </aside>
  </article>
</template>


<script>
import { Vector3 } from '@sheencity/diva-sdk';
import { diva } from 'services/global';
import AppButtonTab from 'components/common/button-tab';
import AppSwitcherListPanel from 'components/common/switcher-list-panel';
import AppEcharts from 'components/common/echarts';

export default {
  data() {
    return {
      divaParams: null,
      buttonTab: null,
      barCharts: null,
      pieCharts: null,
      switchPanel: null,

      currCategoryIndex: 0,
      currCategoryData: [],
      POIList: null,
      divaParam: null,
      POIChecked: false,
    };
  },
  async created() {
    await this.init();
  },
  beforeDestroy() {
    this.resetPOI();
  },
  methods: {
    async init() {
      await this.initConfig();
      await this.initScene();
      this.setDivaParam();
    },
    async initConfig() {
      const { data } = await this.axios.get('config/page/energy.json');
      this.divaParams = data.diva;
      [ this.buttonTab, this.barCharts, this.pieCharts ] = data['panel-left'];
      [ this.switchPanel ] = data['panel-right'];
    },
    async initScene() {
      await diva.applySceneByName(this.divaParams.init.scene_name);
    },
    /**
     * 选择能耗类型资源种类
     * @param {number} e
     */
    selectResources(e) {
      this.currCategoryIndex = e;
      this.setCurrCategoryData();
      this.setDivaParam();
      if (this.POIChecked) {
        const { minValue, maxValue } = this.ruleNum(this.divaParam);
        this.divaParam.minValue = minValue;
        this.divaParam.maxValue = maxValue;
        this.showPOI(this.divaParam);
      }
    },
    /**
     * POI 显示隐藏开关
     * @param e
     */
    async checked(e) {
      if (e.title === 'POI') {
        this.setCurrCategoryData();
        this.POIList = await this.getPOI(e.diva.resource.group);
        if (e.default) {
          this.POIChecked = true;
          const { opacity } = this.divaParam;
          const { minValue, maxValue } = this.ruleNum(this.divaParam);
          this.showPOI({ minValue, maxValue, opacity });
        } else {
          this.POIChecked = false;
          this.resetPOI();
        }
      }
    },
    /**
     * 处理最大值最小值，没有最大值时，数据里面的最大的就为最大值，最小值不为0时，数据里最小的即为最小值
     */
    ruleNum({ minValue, maxValue }) {
      if (!maxValue || minValue != 0) {
        const poiValueList = [];
        this.POIList.forEach(async (poi) => {
          const key = poi.name.split('#')[0] + '#';
          const item = this.currCategoryData.find((ele) => ele.name === key);
          if (item.value.includes('kW·h')) {
            const value = item.value.split('kW·h')[0].replace(/,/g, '');
            poiValueList.push(value);
          } else {
            const value = item.value.split('m³')[0].replace(/,/g, '');
            poiValueList.push(value);
          }
        });
        minValue = Math.min(...poiValueList);
        maxValue = Math.max(...poiValueList);
      }
      return { minValue, maxValue };
    },
    /**
     * 根据类型显示POI
     */
    showPOI({ minValue, maxValue, opacity }) {
      this.POIList.forEach(async (poi) => {
        const key = poi.name.split('#')[0] + '#';
        const item = this.currCategoryData.find((ele) => ele.name === key);
        let option = {};
        if (item.value.includes('kW·h')) {
          const value = item.value.split('kW·h')[0].replace(/,/g, '');
          option.content = item.value;
          option.color = this.getColor(value, minValue, maxValue);
          option.opacity = opacity;
          diva.updateEntityPropertyById(poi.id, option);
        } else {
          const value = item.value.split('m³')[0].replace(/,/g, '');
          option.content = item.value;
          option.color = this.getColor(value, minValue, maxValue);
          option.opacity = opacity;
          diva.updateEntityPropertyById(poi.id, option);
        }
      });
      this.POIList.setVisibility(true);
    },
    /**
     * 获取 POI
     * @param {String} group POI路径
     * @returns 获取到的 POI 列表
     */
    async getPOI(group) {
      return await diva.getFloorInfoByName(group);
    },
    /**
     * 计算渐变色
     */
    getColor(value, minValue, maxValue) {
      minValue = parseInt(minValue);
      maxValue = parseInt(maxValue);
      value = value < minValue ? minValue : value;
      value = value > maxValue ? maxValue : value;
      const ratio = (value - minValue) / (maxValue - minValue).toFixed(2);
      // 绿->黄->红
      const green = new Vector3(51, 154, 0);
      const yellow = new Vector3(255, 184, 0);
      const red = new Vector3(218, 31, 0);
      let R,G,B;
      if (ratio < 0.5) {
        [R, G, B] = green.lerpTo(yellow, ratio * 2).tuple;
      } else {
        [R, G, B] = yellow.lerpTo(red, ratio * 2 - 1).tuple;
      }
      return [parseInt(R), parseInt(G), B];
    },
    /**
     * 清空POI
     */
        /**
     * 获取当前 POI 资源种类数据
     */
    setCurrCategoryData() {
      this.currCategoryData = this.buttonTab.content.data[this.currCategoryIndex].data;
    },
    /**
     * 获取 DIVA 行为参数
     */
    setDivaParam() {
      this.divaParam = this.buttonTab.content.data[this.currCategoryIndex].diva.action[0].param;
    },
    resetPOI() {
      if (this.POIList) this.POIList.setVisibility(false);
    },
  },
  components: {
    AppButtonTab,
    AppSwitcherListPanel,
    AppEcharts,
  },
};
</script>

<style lang="scss" scoped>
</style>