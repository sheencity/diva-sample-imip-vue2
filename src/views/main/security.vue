<template>
  <article class="space-between">
    <aside class="space-left all">
      <app-button-tab
        v-if="buttonTab"
        :header="buttonTab.header"
        :dataSource="buttonTab.content"
        @select="buttonTabChange"
      ></app-button-tab>

      <app-table-col3
        v-if="monitorList && selectedIndex === 0"
        ref="monitorTable"
        class="top10"
        :maxItem="7"
        :header="monitorList.header"
        :thead="monitorList.content.head"
        :dataSource="monitorList.content.data"
        @select="monitorChange"
      >
      </app-table-col3>

      <app-switcher-list
        v-if="trafficList && selectedIndex === 1"
        class="top10"
        :header="trafficList.header"
        :dataSource="trafficList.content.data"
        @checked="switchChange"
      >
      </app-switcher-list>
    </aside>
    <aside class="space-right all">
      <app-echarts
        v-if="abnormalEvents"
        :header="abnormalEvents.header"
        :dataSource="abnormalEvents.content"
      ></app-echarts>

      <app-echarts
        class="top10"
        v-if="abnormalArea"
        :header="abnormalArea.header"
        :dataSource="abnormalArea.content"
      ></app-echarts>
    </aside>
  </article>
</template>

<script>
import AppEcharts from 'components/common/echarts';
import AppButtonTab from 'components/common/button-tab';
import AppSwitcherList from 'components/common/switcher-list-panel';
import AppTableCol3 from 'components/common/table/table-col3';
import { diva } from 'services/global';

export default {
  data() {
    return {
      divaParams: null,
      buttonTab: null,
      monitorList: null,
      trafficList: null,
      abnormalEvents: null,
      abnormalArea: null,
      selectedIndex: 0,
      // 摄像机模型组
      monitors: null,
      // 摄像机 POI 模型组
      monitorsPoi: null,
      // 摄像机与其 POI 的对应关系
      monitorsPoiMap: new Map(),
      // 摄像机与数据项 id 的对应关系
      monitorsIdMap: new Map(),
      // 存在弹窗的设备 id
      deviceId: null,
      // 聚焦和弹窗的参数信息
      options: {
        focus: null,
        widget: null,
      },
      // 摄像机点击事件
      monitorClickListener: (e) => {
        this.deviceId = e.target;
        const equipmentId = this.monitorsIdMap.get(e.target);
        const url = `${window.location.origin}/#/pop-up/monitoring/widget/${equipmentId}`;
        diva.createWedWidget(e.target, url, this.options.widget);
      },
      // 摄像机POI 点击事件
      monitorPoiClickListener: (e) => {
        const name = this.monitorsPoiMap.get(e.target);
        if (!name) return;
        this.focusMonitor(name);
      },
    };
  },
  async created() {
    await this.init();
  },
  async destroyed() {
    this.destroyWidget();
    this.setMonitorPoiVisibility(false);
    this.monitorsPoi?.forEach((poi) => {
      poi.removeEventListener('click', this.monitorPoiClickListener);
    });
    this.monitors?.forEach((model) => {
      model.removeEventListener('click', this.monitorClickListener);
    });
    await Promise.all(this.divaParams.init.locked.group
      .map((group) => diva.updateEntityPropertyByGroup(group, { locked: false })));
  },
  methods: {
    async init() {
      await this.initConfig();
      await this.initScene();
    },
    async initConfig() {
      const { data } = await this.axios.get('config/page/security.json');
      this.divaParams = data.diva;
      [this.buttonTab, this.monitorList, this.trafficList] = data['panel-left'];
      [this.abnormalEvents, this.abnormalArea] = data['panel-right'];
    },
    /**
     * 初始化场景
     */
    async initScene() {
      await this.initBasicInfo();
      this.buttonTabChange(0);
      this.initDivaOptions();
      await Promise.all(this.divaParams.init.locked.group
        .map((group) => diva.updateEntityPropertyByGroup(group, { locked: true })));
    },

    /**
     * 获取聚焦和弹窗的参数信息
     */
    initDivaOptions() {
      this.monitorList.content.diva.action.forEach((action) => {
        if (action.name === 'focus') this.options.focus = action.param;
        if (action.name === 'set_web_widget') this.options.widget = action.param;
      });
    },

    /**
     * 获取摄像机和摄像机POI的对应信息
     */
    async initBasicInfo() {
      const monitorList = this.monitorList.content.data;
      const { group, poi } = this.monitorList.content.diva.init;
      this.monitors = await diva.client?.getModelGroupByGroupPath(group);
      this.monitorsPoi = await diva.client?.getModelGroupByGroupPath(poi);

      Array.from(this.monitorsPoi).map((poi) => {
        const modelName = monitorList.find((data) => data.diva.poi[0].name === poi.name).diva.model[0].name;
        this.monitorsPoiMap.set(poi.id, modelName);
        poi.addEventListener('click', this.monitorPoiClickListener);
      });
      this.monitors.forEach((model) => {
        const data = monitorList.find((data) => data.diva.model[0].name === model.name);
        this.monitorsIdMap.set(model.id, data?.id || null);
      });
    },

    /**
     * 聚焦至摄像机
     */
    async focusMonitor(name) {
      this.destroyWidget();
      const camera = diva.getEntityFromGroup(this.monitors, name);
      if (!camera) throw new Error('未获取到当前摄像机模型');
      this.setSelectedMonitor(camera);
      const { distance, pitch } = this.options.focus;
      await diva.focusOnModelByName(camera.name, distance, pitch);
      await this.setMonitorPoiVisibility(false);

      camera?.addEventListener('click', this.monitorClickListener);
    },

    /**
     * 设置当前选中的摄像机
     */
    setSelectedMonitor(model) {
      this.deviceId = model.id;
      const name = model.name || '';
      const selected = this.monitorList.content.data
        .find((data) => data.diva.model[0].name === name);
      const selectedId = selected?.id || -1;
      this.$refs.monitorTable.selectId = selectedId;
    },

    /**
     * 设置摄像机显示/隐藏
     */
    async setMonitorVisibility(visible) {
      await this.monitors.setVisibility(visible);
    },
    /**
     * 设置摄像机 POI 显示/隐藏
     */
    async setMonitorPoiVisibility(visible) {
      if (this.monitorsPoi) {
        await this.monitorsPoi?.setVisibility(visible);
      }
    },

    /**
     * 销毁弹窗
     */
    async destroyWidget() {
      if (this.deviceId) {
        try {
          await diva.destroyWedWidget(this.deviceId);
        } catch (err) {
          console.warn(err);
        }
      }
    },

    /**
     * 交通流线
     */
    async setTrafficVisibility() {
      await Promise.all(
        this.trafficList.content.data.map((item) =>
          diva.setEntityVisibleByName(item.diva.model[0].name, item.default)
        )
      );
    },

    /**
     * 信息类型按钮切换
     */
    buttonTabChange(index) {
      this.selectedIndex = index;
      const sceneName = this.buttonTab.content.data[index].diva.init.scene_name;
      diva.applySceneByName(sceneName);
      if (index === 0) {
        this.setMonitorVisibility(true);
        this.setMonitorPoiVisibility(true);
        this.destroyWidget();
      } else if (index === 1) {
        this.setTrafficVisibility();
      }
    },

    /**
     * 摄像机列表点击切换
     */
    monitorChange(name, e) {
      this.focusMonitor(e.diva.model[0].name);
    },
    /**
     * 交通流线开关
     */
    switchChange(e) {
      diva.setEntityVisibleByName(e.diva.model[0].name, e.default);
    },
  },
  components: {
    AppEcharts,
    AppButtonTab,
    AppSwitcherList,
    AppTableCol3,
  }
};
</script>

<style lang="scss" scoped>

</style>
