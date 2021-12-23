<template>
  <article class="space-between">
    <aside v-if="basicInfoData && buttonTestData" class="space-left all">
      <app-basic-info class="top10" :header="basicInfoData.header" :dataSource="basicInfoData.content.data"></app-basic-info>
      <app-button-tab class="top10" :header="basicInfoData.header" :dataSource="buttonTestData.content.data" @select="switbtn" ></app-button-tab>
      <app-table-col3 class="top10" :header="basicInfoData.header" :dataSource="tableCol3TestData" @select="swit" @unselect="unswit"></app-table-col3>
      <!-- <app-card-table :data="cardTableData"></app-card-table> -->
      <!-- <pie-charts :data="pieChartsData"></pie-charts> -->
    </aside>
    <aside class="space-right all">
      <!-- <app-card-list :data="cardListData"></app-card-list> -->
    </aside>
  </article>
</template>

<script>
import AppBasicInfo from 'components/common/basic-info';
import AppDialog from 'components/common/dialog/dialog';
import AppButtonTab from 'components/common/button-tab';
import AppTableCol3 from 'components/common/table/table-col3'
// import AppCardTable from '../../components/common/basic-info/index';
// import PieCharts from '../../components/common/charts/pie/index';
// import AppCardList from '../../components/common/card-list/index';
// import AppAreaModule from "../components/area-module/area-module";

export default {
  data() {
    return {
      initDivaData: null,
      basicInfoData: null,
      cardTableData: null,
      pieChartsData: null,
      cardListData: null,

      buttonTestData: null,
      tableCol3TestData: {
        thead: [
          { name: "id", title: "编号" },
          { name: "category", title: "类别" },
          { name: "status", title: "状态" },
        ],
        tbody: [
           {
            id: "WF171",
            name: "POI卫生间17F01",
            category: "卫生间",
            status: "正常"
          },
          {
            id: "WF172",
            name: "POI卫生间17F02",
            category: "卫生间",
            status: "检修"
          },
        ]
      }
    };
  },
  created() {
    this.init();
  },
  async mounted() {
    const { data } = await this.axios.get('config/page/energy.json');
    this.buttonTestData = data.panel['panel-left'][0];
    console.log(this.buttonTestData)
  },
  methods: {
    async init() {
      await this.getConfig()
      this.initScene(this.initDivaData.init.scene_name)
    },
    async getConfig() {
      const { data } = await this.axios.get('config/page/introduction.json');
      console.log(data)
      this.initDivaData = data.diva;
      this.basicInfoData = data.panel['panel-left'][0];
      this.cardTableData = data.panel['panel-left'][1];
      this.pieChartsData = data.panel['panel-left'][2];
      this.cardListData = data.panel['panel-right'][0];
    },
    initScene(name) {
      console.log(name)
    },
    switbtn(e){
      console.log(e);
    },
    swit(resourceName,item){
      console.log("选中");
      console.log({resourceName,item});
    },
    unswit(resourceName,item){
      console.log("取消选中");
      console.log({resourceName,item});
    }
  },
  beforeDestroy(){
   
  },
  destroyed(){
    
  },
  components: {
    AppDialog,
    AppBasicInfo,
    AppButtonTab,
    AppTableCol3
    // AppBasicInfo,
    // AppCardTable,
    // AppCardList,
    // PieCharts
  },
};
</script>
<style lang="scss" scoped>
.module-1 {
  .image {
    width: 100%;
    margin-bottom: .63rem;
  }
  p {
    font-size: .88rem;
    letter-spacing: .06rem;
    color: #ebebeb;
  }
}

.module-2 {
  .content-table {
    width: 100%;
    border-collapse: collapse;
    td {
      width: 50%;
      padding-top: .5rem;
      border-top: 0;
      border-right: 1px solid rgba(235, 235, 235, 0.2);
      border-bottom: 1px solid rgba(235, 235, 235, 0.2);
      border-left: 0;
      vertical-align: middle;
      &:last-of-type {
        border-right: 0;
      }
    }
    .content-each {
      margin-left: 1.25rem;
      p {
        font-size: .75rem;
        line-height: 1.25rem;
        margin-bottom: .38rem;
        color: #ebebeb;
      }
      div {
        margin-bottom: .63rem;
        ::v-deep span {
          font-family: Saira;
          color: #00f7ff;
          line-height: 1.25rem;
          font-weight: 500;
          font-size: 1.25rem;
        }
      }
    }
    // 因为组件内容默认有个上边距，而每个表格也需要上边距，消除冲突
    tr:nth-child(1) {
      td {
        padding-top: 0px;
      }
    }
  }
}

.module-4 {
  .prod-area,
  .life-area {
    h3 {
      padding-bottom: 0.6rem;
      font-weight: 500;
      font-size: 1rem;
      line-height: 1.38rem;
      text-align: center;
      text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.5);
      // background: url("../assets/route1/title.png") no-repeat 50% 10%;
    }
  }
  .life-area {
    margin-top: 1rem;
  }
  .area-module:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: #00f7ff;
  }
}
</style>
