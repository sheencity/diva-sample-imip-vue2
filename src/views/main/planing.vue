<template>
  <article class="space-between">
    <aside class="space-left all">
      <app-button-tab
        v-if="buttonTab"
        :header="buttonTab.header"
        :dataSource="buttonTab.content"
        @select="buttonTabChange"
      ></app-button-tab>

      <app-row-list
        class="card-mt"
        v-if="rowList"
        :header="rowList.header"
        :dataSource="rowList.content"
        :disabled="rowDisabled"
        :key="rowList.header.title"
        @select="rowItemChange"
      ></app-row-list>
    </aside>
    <aside class="space-right all">
      <app-switcher-list
        v-if="switcherList"
        :header="switcherList.header"
        :dataSource="switcherList.content.data"
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
      divaParams: null,
      buttonTab: null,
      rowList: null,
      switcherList: null,
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
    await this.init();
  },
  destroyed() {
    diva.setEntityVisibleByGroup(this.currentShowPath, false);
    this.removeTransformAnimation();
  },
  methods: {
    async init() {
      await this.initConfig();
      await this.initScene();
    },

    async initConfig() {
      const { data } = await this.axios.get('config/page/plan.json');
      this.divaParams = data.diva;
      [this.buttonTab] = data['panel-left'];
      this.rowList = this.buttonTab.content.data[0]['target-panel'];
      [this.switcherList] = data['panel-right'];
    },
    
    /**
     * 初始化场景
     */
    async initScene() {
      this.currentShowPath = this.buttonTab.content.data[0].diva.init.group;
      await diva.applySceneByName(this.divaParams.init.scene_name);
      await diva.setEntityVisibleByGroup(this.currentShowPath, true);
    },

    /**
     * 重置状态
     */
    async reset() {
      await diva.applySceneByName(this.divaParams.init.scene_name);
      await diva.setEntityVisibleByGroup(this.currentShowPath, false);
      this.switcherList.content.data
        .forEach((item) => item.default = false);
    },

    /**
     * 开关切换
     */
    switcherChange(e) {
      diva.applySceneByName(this.switcherList.content.diva.init.scene_name, {
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
      this.currentShowPath = this.buttonTab.content.data[index].diva.init.group;
      this.rowList = this.buttonTab.content.data[index]['target-panel'];
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
        this.animeDuration = this.rowList.content.diva.action
          .filter((action) => action.name === 'animation')[0]
          .param
          .duration;

        diva.applySceneByName(this.rowList.content.diva.init.scene_name, {
          camera: true,
          visibility: false,
        });
        this.showFloorsByIndex(index);
        this.setTransformAnimation(item.diva.model);
        setTimeout(() => this.rowDisabled = false, this.animeDuration * 1000 + 200);
        return;
      }
      const { distance, pitch } = this.rowList.content.diva.action
        .filter((action) => action.name === 'focus')[0]
        .param;
      const name = item.diva.model.map((model) => model.name)[0];
      diva.focusOnModelByName(name, distance, pitch);
    },

    /**
     * 大于索引值的条目中的模型将会被隐藏
     */
    showFloorsByIndex(i) {
      this.rowList.content.data.forEach((item, index) => {
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
        if (model.name) return diva.getEntityByName(model.name);
        if (model.group) return diva.client.getEntitiesByGroupPath(model.group);
      }));
      // 只取当前模型组内的楼层模型
      this.animeModelGroup = this.animeModelGroup.concat(totalModels.flat().filter((model) => !(model instanceof Overlay)));
      
      if (this.animeModelGroup.length) {
        await Promise.all(this.animeModelGroup.map((model) => model.setScale(new Vector3(1, 1, 0.01))));
        await Promise.all(
          this.animeModelGroup.map((model) => {
            const { x, y, z } = model.position;
            diva.setTransformAnimation(model.id, this.animeDuration, {
              scale: [1, 1, 1],
              position: [x, y, z],
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
          diva.removeTransformAnimation(model.id);
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
