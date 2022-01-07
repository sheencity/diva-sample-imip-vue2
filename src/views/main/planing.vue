<template>
  <article class="space-between">
    <aside class="space-left all">
      <app-button-tab
        v-if="buttonTabData"
        :header="buttonTabData.header"
        :dataSource="buttonTabData.content"
        @select="buttonTabChange"
      ></app-button-tab>

      <app-row-list
        class="top10"
        v-if="rowListData"
        :header="rowListData.header"
        :dataSource="rowListData.content"
        :disabled="rowDisabled"
        :key="rowListData.header.title"
        @select="rowItemChange"
      ></app-row-list>
    </aside>
    <aside class="space-right all">
      <app-switcher-list
        v-if="switcherListData"
        :header="switcherListData.header"
        :dataSource="switcherListData.content.data"
        @checked="switcherChange"
      ></app-switcher-list>
    </aside>
  </article>
</template>

<script>
import { Overlay } from '@sheencity/diva-sdk';
import { Vector3 } from '@sheencity/diva-sdk-math';
import AppButtonTab from 'components/common/button-tab';
import AppRowList from 'components/common/row-list';
import AppSwitcherList from 'components/common/switcher-list-panel';
import { diva } from 'services/global';

export default {
  data() {
    return {
      initDivaData: null,
      buttonTabData: null,
      rowListData: null,
      switcherListData: null,
      selectedBtnTabIndex: 0,
      // 当前显示的模型组路径
      currentShowPath: null,
      // 列表条目是否禁用
      rowDisabled: false,
      // 生长动画持续时间
      animeDuration: null,
      // 用于生长动画的模型组
      animeModelGroup: [],
    };
  },
  async created() {
    this.init();
  },
  destroyed() {
    diva.setEntityVisibleByGroup(this.currentShowPath, false);
    this.removeTransformAnimation();
  },
  methods: {
    async init(){
      await this.getConfig();
      this.initScene();
    },

    async getConfig(){
      const { data } = await this.axios.get('/config/page/plan.json');
      this.initDivaData = data.diva;
      this.buttonTabData = data['panel-left'][0];
      this.rowListData = this.buttonTabData.content.data[0]['target-panel'];
      this.switcherListData = data['panel-right'][0];
    },
    
    /**
     * 初始化场景
     */
    async initScene() {
      this.currentShowPath = this.buttonTabData.content.data[0].diva.init.group;
      await diva.client?.applyScene(this.initDivaData.init.scene_name);
      await diva.setEntityVisibleByGroup(this.currentShowPath, true);
    },

    /**
     * 重置状态
     */
    async reset() {
      await diva.client?.applyScene(this.initDivaData.init.scene_name);
      await diva.setEntityVisibleByGroup(this.currentShowPath, false);
      this.switcherListData.content.data
        .forEach((item) => item.default = false);
    },

    /**
     * 开关切换
     */
    switcherChange(e) {
      diva.client.applyScene(this.switcherListData.content.diva.init.scene_name, {
        camera: true,
        visibility: false,
      });
      diva.setEntityVisibleByName(e.diva.model[0].name, e.default);
    },

    /**
     * 按钮组切换
     */
    async buttonTabChange(index) {
      await this.reset();
      this.selectedBtnTabIndex = index;
      this.currentShowPath = this.buttonTabData.content.data[index].diva.init.group;
      this.rowListData = this.buttonTabData.content.data[index]['target-panel'];
      // 分期规划
      if (index === 2) return;
      diva.setEntityVisibleByGroup(this.currentShowPath, true);
    },

    /**
     * 条目点击切换，聚焦至对应体块
     */
    rowItemChange(item, index) {
      if (this.selectedBtnTabIndex === 2) {
        this.rowDisabled = true;
        this.animeDuration = this.rowListData.content.diva.action
          .filter((action) => action.name === 'animation')[0]
          .param
          .duration;

        diva.client?.applyScene(this.rowListData.content.diva.init.scene_name, {
          camera: true,
          visibility: false,
        });
        this.showFloorsByIndex(index);
        this.setTransformAnimation(item.diva.model);
        setTimeout(() => this.rowDisabled = false, this.animeDuration * 1000 + 200);
        return;
      }
      const focusOption = this.rowListData.content.diva.action
        .filter((action) => action.name === 'focus')[0]
        .param;
      const name = item.diva.model.map((model) => model.name)[0];
      diva.focusOnModelByName(name, focusOption.distance, focusOption.pitch);
    },

    /**
     * 大于索引值的条目中的模型将会被隐藏
     */
    showFloorsByIndex(i) {
      this.rowListData.content.data.forEach((item, index) => {
        if (index < i) this.setFloorsVisibility(item.diva.model, true);
        else this.setFloorsVisibility(item.diva.model, false);
      });
    },

    async setFloorsVisibility(models, visible) {
      await Promise.all(models.map((model) => {
        if (model.name) diva.setEntityVisibleByName(model.name, visible);
        if (model.group) diva.setEntityVisibleByGroup(model.group, visible);
      }));
    },

    /**
     * 设置生长动画
     */
    async setTransformAnimation(models) {
      this.animeModelGroup.length = 0;
      const totalModels = await Promise.all(models.map((model) => {
        if (model.name) return diva.client.getEntitiesByName(model.name);
        if (model.group) return diva.client.getEntitiesByGroupPath(model.group);
      }));
      // 只取当前模型组内的楼层模型
      this.animeModelGroup = this.animeModelGroup.concat(totalModels.flat().filter((model) => !(model instanceof Overlay)));
      
      if (this.animeModelGroup.length) {
        await Promise.all(this.animeModelGroup.map((model) => model.setScale(new Vector3(1, 1, 0.01))));
        await Promise.all(
          this.animeModelGroup.map((model) => {
            diva.client.request('SetTransformAnimation', {
              id: model.id,
              duration: this.animeDuration,
              scale: [1, 1, 1],
            });
          })
        );
        await Promise.all(this.animeModelGroup.map((model) => model.setVisibility(true)));
      }
    },

    /**
     * 移除位移动画，重置模型的缩放
     */
    async removeTransformAnimation() {
      await Promise.all(
        this.animeModelGroup.map((model) => {
          diva.client.request('RemoveTransformAnimation', {
            id: model.id,
          });
          model.setScale(new Vector3(1, 1, 1));
        })
      );
    },
  },
  components: {
    AppButtonTab,
    AppRowList,
    AppSwitcherList,
  },
};
</script>

<style lang="scss" scoped>

</style>
