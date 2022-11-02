<template>
  <app-dialog :header="header">
    <table class="content-table">
      <tr :key="index" v-for="(item, index) in basicData">
        <td>
          <div v-if="item.left" class="content-each">
            <p>{{ item.left.title }}</p>
            <div>
              <span>{{ item.left.value }}</span>
              {{ item.left.unit }}
            </div>
          </div>
        </td>
        <td>
          <div v-if="item.right" class="content-each">
            <p>{{ item.right.title }}</p>
            <div>
              <span>{{ item.right.value }}</span>
              {{ item.right.unit }}
            </div>
          </div>
        </td>
      </tr>
    </table>
  </app-dialog>
</template>

<script>
import AppDialog from '../common/dialog/dialog';

export default {
  props: ['header', 'dataSource'],
  data() {
    return {
      basicData: [],
    };
  },
  created() {
    this.getStructuredData();
  },
  methods: {
    getStructuredData() {
      let param = {};
      let num = 0;
      this.dataSource.forEach((item, index) => {
        index % 2 === 0 ? param.left = item : param.right = item;
        num = Object.keys(param).length;
        if (num === 2) {
          this.basicData.push(param);
          param = {};
        }
      });
      if (num === 1) this.basicData.push(param);
    },
  },
  components: {
    AppDialog,
  },
};
</script>

<style lang="scss" scoped>
.content-table {
  width: 100%;
  border-collapse: collapse;
  td {
    width: 50%;
    padding-top: 0.5rem;
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
      font-size: 0.75rem;
      line-height: 1.25rem;
      margin-bottom: 0.38rem;
      color: #ebebeb;
    }
    div {
      margin-bottom: 0.63rem;
      span {
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
</style>>