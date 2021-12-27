<template>
  <article v-if="initDivaData" class="space-between">
    <aside class="space-left all">
      <app-table-mulit-col3 
        class="top10" 
        :dataSource="tablePanelData.content.data"
        :maxItem="4"
        @select="select"
        @unselect="unselect"
      ></app-table-mulit-col3>
    </aside>
    <aside class="space-right all">
      
    </aside>
  </article>
</template>


<script>
import { diva } from 'services/global'
import AppTableMulitCol3 from 'components/common/table/table-mulit-col3'
export default {
   data() {
    return {
      initDivaData: null,
      tablePanelData: null,
    };
  },
  async created() {
    await this.init();
    this.initScene(this.initDivaData.init.scene_name);
  },
  methods: {
    async init() {
      await this.getConfig();
    },
    async getConfig() {
      const { data } = await this.axios.get('config/page/firecontrol.json');
      this.initDivaData = data.diva;
      this.tablePanelData = data['panel-left'][0];
    },
    /**
     * 初始化场景
     * @param[string] e
     */
    initScene(name) {
      diva.client?.applyScene(name);
    },
    /**
     * 点击列表事件
     * @param name 点击设备名
     * @param e 点击对象
     */
    select(name,e){
      console.log({ name, e })
    },
    /**
     * 点击列表获取上次点击事件
     * @param name 点击设备名
     * @param e 点击对象
     */
    unselect(oldName,e){
      console.log({ oldName, e })
    }
  },
  beforeDestroy(){
   
  },
  components: {
    AppTableMulitCol3
  }

}
</script>

<style lang="scss" scoped>

</style>