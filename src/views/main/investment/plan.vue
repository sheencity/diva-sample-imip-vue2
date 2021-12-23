<template>
  <article class="space-between">
    <aside class="space-left all">
      <template v-if="buttonTabData">
        <app-button-tab
          :header="buttonTabData.header"
          :dataSource="buttonTabData.content"
          @select="buttonTabChange"
        >
        </app-button-tab>
      </template>
      <template v-if="rowListData">
        <app-row-list
          class="top10"
          :header="rowListData.header"
          :dataSource="rowListData.content"
          :key="rowListData.header.title"
          @select="rowItemChange"
        >
        </app-row-list>
      </template>
    </aside>
    <aside class="space-right all">
      <template>

      </template>
    </aside>
  </article>
</template>

<script>
import AppButtonTab from "components/common/button-tab";
import AppRowList from "components/common/row-list";

export default {
  data() {
    return {
      buttonTabData: null,
      rowListData: null,
      switcherListData: null,
    };
  },
  created() {
    this.axios.get('/config/page/plan.json').then((res) => {
      this.buttonTabData = res.data['panel-left'][0];
      this.rowListData = this.buttonTabData.content.data[0]['target-panel'];
      this.switcherListData = res.data['panel-right'][0];
    });
  },
  methods: {
    buttonTabChange(index) {
      this.rowListData = this.buttonTabData.content.data[index]['target-panel'];
      // TODO diva action
    },
    rowItemChange(index) {
      console.log(index);
      // TODO diva action
    }
  },
  components: {
    AppButtonTab,
    AppRowList,
  }
};
</script>

<style lang="scss" scoped>

</style>
