<template>
  <app-dialog :header="header">
    <template v-slot:dialog-article>
      <div class="module-5">
        <div class="statistics">
          <div :key="item.icon" v-for="item in items" class="item">
            <img :src="'/assets/images/route3-1/' + item.icon" />
            <div>
              <p>{{ item.title }}</p>
              <p :style="{ color: item.fontColor || '' }">
                {{ item.number }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from "../dialog/dialog.vue";
export default {
  props: ["items", 'dataSource'],
  data() {
    return {
      currentIndex: null,
      header: null,
    };
  },
  created() {},
  mounted() {},
  methods: {},
  destroyed() {},
  component: [AppDialog]
};
</script>
<style lang="scss" scoped>
.module-5 {
  .statistics {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .item {
      width: 148px;
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    p:first-of-type {
      height: 16px;
      text-align: right;
      font-size: 12px;
      line-height: 16px;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 4px;
    }
    p:last-of-type {
      height: 20px;
      font-weight: bold;
      font-size: 20px;
      line-height: 20px;
      text-align: right;
      letter-spacing: 1px;
      color: #caff87;
      font-family: "Saira";
    }
  }
}
</style>
