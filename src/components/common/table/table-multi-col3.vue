<template>
  <main v-if="dataSource && dataSource.length > 0">
    <div
      :key="item.id"
      v-for="item in dataSource"
      style="margin-bottom: 0.625rem"
    >
      <div class="card-mt">
        <app-dialog :header="item.header">
          <div class="thead">
            <span class="col-1">{{ item.thead[0].title }}</span>
            <span class="col-2">{{ item.thead[1].title }}</span>
            <span class="col-3">{{ item.thead[2].title }}</span>
          </div>
          <div class="container">
            <div class="main" :style="{ maxHeight: maxItem * 40 + 'px' }">
              <div
                class="tbody"
                v-for="ele in item.tbody"
                :key="ele[item.thead[0].name]"
                :class="{ 'item-selected': selectId === ele.id }"
                @click="selectItem(ele, item)"
                :style="{ opacity: ele[item.thead[2].name] === '检修' ? 0.3 : 1}"
              >
                <span class="col-1">{{ ele[item.thead[0].name] }}</span>
                <span class="col-2">{{ ele[item.thead[1].name] }}</span>
                <span
                  class="col-3"
                  :class="{ disabled: ele[item.thead[2].name] === '检修' }"
                >{{ ele[item.thead[2].name] }}</span>
              </div>
            </div>
          </div>
        </app-dialog>
      </div>
    </div>
  </main>
</template>

<script>
import AppDialog from '../dialog/dialog';

export default {
  props: ['maxItem', 'dataSource'],
  data() {
    return {
      selectId: -1,
    };
  },
  methods: {
    selectItem(e, item) {
      if (e.status === '检修') {
        return;
      }
      if (e.id !== this.selectId) {
        this.unselectItem();
      }
      this.selectId = e.id;
      this.$emit('select', e[item.thead[3].name], e);
    },
    unselectItem() {
      this.dataSource.forEach((params) => {
        params?.tbody?.forEach((obj) => {
          // 将其他选中的取消
          const otherName = obj[params.thead[3].name];
          if (this.selectId === obj[params.thead[0].name]) {
            this.$emit('unselect', otherName, obj);
          }
        });
      });
    },
  },
  beforeDestroy() {
    this.unselectItem();
  },
  components: {
    AppDialog,
  },
};
</script>

<style lang="scss" scoped>
.container {
  overflow: visible;
  .main {
    width: 330px;
    overflow: auto;
    overflow-x: hidden;
  }
}
.thead {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 10px;
  span {
    text-align: center;
    font-weight: 500;
    font-size: 14px;
    line-height: 19px;
    text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.5);
    letter-spacing: 0px;
    pointer-events: none;
  }
  .col-1 {
    text-align: left;
    width: 50px;
  }
  .col-2 {
    width: 180px;
  }
  .col-3 {
    width: 60px;
  }
}
.tbody {
  @extend .thead;
  width: 320px;
  height: 36px;
  margin-bottom: 4px;
  border: 1px solid rgba(5, 205, 157, 0.3);
  border-radius: 4px;
  .col-3 {
    color: #00e400;
  }
  .disabled {
    color: #ffff00;
  }
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}
</style>
