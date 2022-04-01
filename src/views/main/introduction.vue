<template>
  <article v-if="divaParams" class="space-between">
    <aside class="space-left all">
      <app-basic-info
        class="card-mt"
        :header="basicInfo.header"
        :dataSource="basicInfo.content.data"
      ></app-basic-info>

      <app-card-table
        class="card-mt"
        :header="cardTable.header"
        :dataSource="cardTable.content.data"
      ></app-card-table>

      <app-echarts
        class="card-mt"
        :header="roseCharts.header"
        :dataSource="roseCharts.content"
      ></app-echarts>
    </aside>
    <aside class="space-right all">
      <app-card-list
        class="card-mt"
        :header="cardList.header"
        :dataSource="cardList.content.data"
        @select="selectArea"
      ></app-card-list>
    </aside>
  </article>
</template>

<script>
import { diva } from 'services/global';
import { RenderingStyleMode } from '@sheencity/diva-sdk';
import AppBasicInfo from 'components/common/basic-info';
import AppCardTable from 'components/card-table';
import AppCardList from 'components/card-list';
import AppEcharts from 'components/common/echarts';

export default {
  data() {
    return {
      divaParams: null,
      basicInfo: null,
      cardTable: null,
      roseCharts: null,
      cardList: null,

      cardListAction: [],
      poiList: [],
      floorList: [],
      modelEventList: [],

      typeMap: new Map([
        ['name', this.getEntitiesByName],
        ['group', this.getModelGroupByGroupPath],
        ['block', this.getEntitiesByName],
      ])
    };
  },
  created() {
    this.init();
  },

  beforeDestroy() {
    this.modelEventList?.forEach((model) => {
      model.removeEventListener('mousedown', this.modelClickEvent);
    });
    this.setFloorReset();
  },
  methods: {
    async init() {
      await this.initConfig();
      await this.initScene();
      // 为楼体区块添加点击事件
      this.addModelListener();
    },
    async initConfig() {
      const { data } = await this.axios.get('config/page/introduction.json');
      [ this.basicInfo, this.cardTable, this.roseCharts ] = data['panel-left'];
      [ this.cardList ] = data['panel-right'];
      this.divaParams = data.diva;
      this.cardListAction = this.cardList.content.diva.action;
    },
    /**
     * 初始化场景
     */
    async initScene() {
      await diva.applySceneByName(this.divaParams.init.scene_name);
    },
    /**
     * 选择区域聚焦
     * @param e 区域信息
     */
    selectArea(e) {
      this.resetState();
      e.checked = true;
      // 楼梯恢复原样
      this.setFloorReset();
      this.POIlist = [];
      this.floorList = [];
      this.setRendering(e.diva);
    },
    /**
     * 重置右侧列表高亮状态
     */
    resetState() {
      this.cardList.content.data.forEach((area) => {
        area.list.forEach((ele) => ele.checked = false);
      });
    },
     /**
     * 获取POI 和 楼体
     * @param floorList 楼体列表形参
     * @param poiList POI列表形参
     */
    async getFloorPOI(floorList, poiList) {
      const floorArray = [];
      const POIArray = [];
      for (const floor of floorList) {
        const key = Object.keys(floor)[0];
        const fun = this.typeMap.get(key);
        const model = await fun(floor[key]);
        model.get_type = key;
        floorArray.push(model);
      }
      for (const p of poiList) {
        const [poi] = await diva.getEntityByName(p.name);
        POIArray.push(poi);
      }
      return { floor: floorArray, POI: POIArray };
    },
     /**
     * 获取点击对象
     */
    getEventTarget(name) {
      let target = null;
      this.cardList.content.data.forEach((area) => {
        area.list.forEach((item) => {
          item.diva.models.forEach((floor) => {
            const key = Object.keys(floor)[0];
            if (name === floor[key]) {
              target = item;
            }
          });
        });
      });
      return target;
    },
    /**
     * 渲染实体，显示POI
     * @param v POI和楼体信息
     */
    async setRendering(v) {
      const floorList = v.models;
      const poiList = v.poi;
      const { floor, POI } = await this.getFloorPOI(floorList, poiList);
      const { distance, pitch } = this.cardListAction[1].param;
      this.floorList = floor;
      this.poiList = POI;
      // 显示POI并聚焦
      this.poiList.forEach((p) => {
        p?.setVisibility(true);
        p?.focus(distance, pitch);
      });
      // 楼层高亮
      this.floorList.forEach((floor) => {
        this.setRenderingStyle(floor, true, RenderingStyleMode.Highlight)
      });
      await diva.setHighlightStyle(this.cardListAction[0].param);
    },
    /**
     * 设置楼体渲染样式
     * @param model 模型
     * @param {boolean} param 参数选项
     * @param visibility 是否显示体块
     */
    setRenderingStyle(model,visibility, param){
      if (model.get_type === 'group') {
        model.setRenderingStyleMode(param);
      } else if (model.get_type === 'block') {
        model[0].setVisibility(visibility);
      } else {
        model[0].setRenderingStyleMode(param);
      }
    },
    /**
     * 为楼体添加点击事件
     */
    addModelListener() {
      this.cardList.content.data.forEach((area) => {
        area.list.forEach((item) => {
          item.diva.models.forEach(async (floor) => {
            const key = Object.keys(floor)[0];
            const fun = this.typeMap.get(key);
            const model = await fun(floor[key]);
            if (model instanceof Array) {
              const [m] = model;
              this.modelEventList.push(m);
              m.addEventListener('mousedown', this.modelClickEvent);
            } else {
              this.modelEventList.push(model);
              model.addEventListener('mousedown', this.modelClickEvent);
            }
          });
        });
      });
    },
    /**
     * 实体添加的click事件
     */
    async modelClickEvent(e) {
      if (e.detail.button !== 0) return;
      const model = await diva.getEntityById(e.target);
      const group = model.group;
      const nameList = group.split('楼栋');
      let name = model.name;
      if (nameList[1].includes('#')) {
        name = '产业园区/楼栋/' + nameList[1].split('/')[1];
      }
      const item = this.getEventTarget(name);
      if (item) {
        this.selectArea(item);
      }
    },
    /**
     * 通过名称获取实体
     */
      /**
     * 清除楼体样式
     */
    setFloorReset() {
      if (this.poiList.length > 0) {
        this.poiList.forEach((p) => {
          p.setVisibility(false);
        });
      }
      if (this.floorList.length > 0) {
        this.floorList.forEach((floor) => {
          this.setRenderingStyle(floor, false, RenderingStyleMode.Default)
        });
      }
    },
    async getEntitiesByName(name){
      return await diva.getEntityByName(name);
    },
    /**
     * 通过路径获取模型组
     */
    async getModelGroupByGroupPath(path){
      return await diva.getFloorInfoByName(path);
    }
  },
  components: {
    AppBasicInfo,
    AppCardTable,
    AppCardList,
    AppEcharts,
  },
};
</script>
<style lang="scss" scoped>
</style>
