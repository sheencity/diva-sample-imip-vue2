<template>
  <article v-if="initDivaData" class="space-between">
    <aside class="space-left all">
      <app-basic-info
        class="top10"
        :header="basicInfoData.header"
        :dataSource="basicInfoData.content.data"
      ></app-basic-info>

      <app-card-table
        class="top10"
        :header="cardTableData.header"
        :dataSource="cardTableData.content.data"
      ></app-card-table>

      <app-echarts
        class="top10"
        :header="roseChartsData.header"
        :dataSource="roseChartsData.content"
      ></app-echarts>
    </aside>
    <aside class="space-right all">
      <app-card-list
        class="top10"
        :header="cardListData.header"
        :dataSource="cardListData.content.data"
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
      initDivaData: null,
      basicInfoData: null,
      cardTableData: null,
      roseChartsData: null,
      cardListData: null,

      cardListAction: [],
      POIList: [],
      floorList: [],
      modelEventList: [],
    };
  },
  created() {
    this.init();
  },

  beforeDestroy() {
    this.modelEventList?.forEach((model) => {
      model.removeEventListener('click', this.addEvent);
    });
    this.setFloorReset();
  },
  destroyed() {},
  methods: {
    async init() {
      await this.getConfig();
      this.initScene(this.initDivaData.init.scene_name);
      // 为楼体区块添加点击事件
      this.addModelListener();
    },
    async getConfig() {
      const { data } = await this.axios.get('config/page/introduction.json');
      this.initDivaData = data.diva;
      this.basicInfoData = data['panel-left'][0];
      this.cardTableData = data['panel-left'][1];
      this.roseChartsData = data['panel-left'][2];
      this.cardListData = data['panel-right'][0];
      this.cardListAction = this.cardListData.content.diva.action;
    },
    /**
     * 初始化场景
     */
    initScene(name) {
      diva.client?.applyScene(name);
    },
    /**
     * 选择区域聚焦
     * @param e 区域信息
     */
    selectArea(e) {
      // 楼梯恢复原样
      this.setFloorReset();
      this.POIlist = [];
      this.floorList = [];
      this.setRendering(e.diva);
    },
    /**
     * 渲染实体，显示POI
     * @param v POI和楼体信息
     */
    async setRendering(v) {
      const floorList = v.models;
      const POIList = v.poi;
      const { floor, POI } = await this.getFloorPOI(floorList, POIList);
      this.floorList = floor;
      this.POIList = POI;
      // 显示POI并聚焦
      this.POIList.forEach((p) => {
        p?.setVisibility(true);
        p?.focus(
          this.cardListAction[1].param.distance,
          this.cardListAction[1].param.pitch
        );
      });
      // 楼层高亮
      this.floorList.forEach((f) => {
        if (f.get_type === 'group') {
          f.setRenderingStyleMode(RenderingStyleMode.Highlight);
        } else if (f.get_type === 'block') {
          f[0].setVisibility(true);
        } else {
          f[0].setRenderingStyleMode(RenderingStyleMode.Highlight);
        }
      });
      await diva.client.request(
        'SetHighlightStyle',
        this.cardListAction[0].param
      );
    },
    /**
     * 清除楼体样式
     */
    setFloorReset() {
      if (this.POIList.length > 0) {
        this.POIList.forEach((p) => {
          p.setVisibility(false);
        });
      }
      if (this.floorList.length > 0) {
        this.floorList.forEach((floor) => {
          if (floor.get_type === 'group') {
            floor.setRenderingStyleMode(RenderingStyleMode.Default);
          } else if (floor.get_type === 'block') {
            floor[0].setVisibility(false);
          } else {
            floor[0].setRenderingStyleMode(RenderingStyleMode.Default);
          }
        });
      }
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
        switch (key) {
          case 'name': {
            const model = await diva.client.getEntitiesByName(floor.name);
            model.get_type = 'name';
            floorArray.push(model);
            break;
          }
          case 'group': {
            const typedGroup = await diva.client.getModelGroupByGroupPath(
              floor.group
            );
            typedGroup.get_type = 'group';
            floorArray.push(typedGroup);
            break;
          }
          case 'block': {
            const model = await diva.client.getEntitiesByName(floor.block);
            model.get_type = 'block';
            floorArray.push(model);
            break;
          }
        }
      }
      for (const p of poiList) {
        const [poi] = await diva.client.getEntitiesByName(p.name);
        POIArray.push(poi);
      }
      return { floor: floorArray, POI: POIArray };
    },
    /**
     * 为楼体添加点击事件
     */
    addModelListener() {
      this.cardListData.content.data.forEach((area) => {
        area.list.forEach((item) => {
          item.diva.models.forEach(async (floor) => {
            const key = Object.keys(floor)[0];
            switch (key) {
              case 'name': {
                const [model] = await diva.client.getEntitiesByName(floor.name);
                this.modelEventList.push(model);
                model.addEventListener('click', this.addEvent);
                break;
              }
              case 'group': {
                const typedGroup = await diva.client.getModelGroupByGroupPath(
                  floor.group
                );
                this.modelEventList.push(typedGroup);
                typedGroup.addEventListener('click', this.addEvent);
                break;
              }
              case 'block': {
                const [model] = await diva.client.getEntitiesByName(
                  floor.block
                );
                this.modelEventList.push(model);
                model.addEventListener('click', this.addEvent);
                break;
              }
            }
          });
        });
      });
    },
    /**
     * 实体添加的click事件
     */
    async addEvent(e) {
      const model = await diva.client.getEntityById(e.target);
      let name = model.name;
      const group = model.group;
      const nameList = group.split('楼栋');
      if (nameList[1].includes('#')) {
        name = '产业园区/楼栋/' + nameList[1].split('/')[1];
      }
      const item = this.getEventTarget(name);
      if (item) {
        this.selectArea(item);
      }
    },
    /**
     * 获取点击对象
     */
    getEventTarget(name) {
      let target = null;
      this.cardListData.content.data.forEach((area) => {
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
