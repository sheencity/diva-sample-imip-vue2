<template>
  <app-dialog :header="header">
    <div v-if="thead.length > 0 && dataSource.length > 0">
      <div class="thead">
        <span class="col-1">{{ thead[0].title }}</span>
        <span class="col-2">{{ thead[1].title }}</span>
        <span class="col-3">{{ thead[2].title }}</span>
      </div>
      <div class="container">
        <div class="main" :style="{ maxHeight: maxItem * 40 + 'px' }">
          <div
            class="tbody"
            :class="{ 'item-selected': selectId === item[thead[0].name] }"
            :style="{ opacity: item[thead[2].name] === '检修' ? 0.3 : 1 }"
            :key="item[thead[0].name]"
            v-for="(item, index) in dataSource"
            @click="select(item, index)"
          >
            <span class="col-1">{{ item[thead[0].name] }}</span>
            <span class="col-2">{{ item[thead[1].name] }}</span>
            <span
              class="col-3"
              :class="{ disabled: item[thead[2].name] === '检修' }"
              >{{ item[thead[2].name] }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </app-dialog>
</template>

<script>
import AppDialog from '../dialog/dialog';

export default {
  props: ['thead', 'dataSource', 'maxItem', 'header'],
  data() {
    return {
      selectId: -1,
    };
  },
  methods: {
    select(e, index) {
      if (e[this.thead[2].name] === '检修') return;
      const targetName = e.name;
      if (e.id !== this.selectId) {
        this.unselect();
      }
      this.selectId = e.id;
      this.$emit('select', targetName, e);
    },
    unselect() {
      this.dataSource?.forEach((obj, index) => {
        // 将其他选中的取消
        const otherName = obj.name;
        if (this.selectId === obj.id) {
          this.$emit('unselect', otherName, obj);
        }
      });
    },
  },
  beforeDestroy() {
    this.unselect();
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
