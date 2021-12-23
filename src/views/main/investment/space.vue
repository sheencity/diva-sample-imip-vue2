<template>
  <article class="space-between">
    <aside class="space-left all">
      <template v-if="panelLeft">
        <div class="top10">
          <app-dialog :header="panelLeft[0].header">
            <echarts :dataSource="panelLeft[0].content"></echarts>
          </app-dialog>
        </div>
        <div class="top10">
          <app-dialog :header="panelLeft[1].header">
            <app-basic-info :data="panelLeft[1].content.data"></app-basic-info>
          </app-dialog>
        </div>
      </template>
    </aside>
    <aside class="space-right all">
      
    </aside>
  </article>
</template>

<script>
import AppDialog from "components/common/dialog/dialog";
import AppBasicInfo from 'components/common/basic-info';
import Echarts from "components/common/echarts";

export default {
  data() {
    return {
      panelLeft: null,
    };
  },
  created() {
    this.axios.get('/config/page/space.json').then((res) => {
      this.panelLeft = res.data['panel-left'];
    });
  },
  components: {
    AppDialog,
    AppBasicInfo,
    Echarts,
  }
};
</script>

<style lang="scss" scoped>

</style>
