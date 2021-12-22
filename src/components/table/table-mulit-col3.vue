<template>
  <main v-if="data && data.length>0">
    <div :key="item.id" v-for="(item,index1) in data" style="margin-bottom: 0.625rem">
      <div class="top10">
        <app-dialog :header-key="item.headerKey">
          <template v-slot:dialog-article>
              <div class="thead">
                <span class="col-1">{{ item.thead[0].title }}</span>
                <span class="col-2">{{ item.thead[1].title }}</span>
                <span class="col-3">{{ item.thead[2].title }}</span>
              </div>
              <div class="container">
                <div class="main" :style="{ maxHeight: maxItem * 40 + 'px'}">
                  <div
                    v-for="(ele,index2) in item.tbody"
                    :ref="'row'+index1+ '-' + index2 "
                    :key="ele[item.thead[0].name]"
                    class="tbody"
                    :class="{ 'item-selected': selectId === ele.id }"
                    @click="selectItem(ele,item)"
                    :style="{ opacity: ele[item.thead[2].name] === '检修' ? 0.3 : 1}"
                  >
                    <span class="col-1">{{ ele[item.thead[0].name] }}</span>
                    <span class="col-2">{{ ele[item.thead[1].name] }}</span>
                    <span class="col-3" :class="{ 'disabled': ele[item.thead[2].name] === '检修' }">{{ ele[item.thead[2].name] }}</span>
                  </div>
                </div>
              </div>
              
          </template>
        </app-dialog>
      </div>
    </div>
    
    
  </main>
</template>

<script>
import AppDialog from "../dialog/dialog";

export default {
  props: ['maxItem', 'data'],
  data(){
    return{
      selectId: -1,
      clickListener: (e) => {
        const dom = e.target.classList.contains("tbody")
          ? e.target
          : e.target.parentNode;
        const index = dom.getAttribute("listIndex");
        if (!index) throw new Error("未获取到事件 DOM");
        const indexArray = index.split('-');
        const item = this.data[indexArray[0]];
        const ele = item.tbody[indexArray[1]];
        this.selectItem(ele, item);
      },
    }
  },
  methods: {
    selectItem(e,item) {
      if (e.status === "检修") {
        return;
      }
      this.unselectItem(e,item);
      this.selectId = e.id;
      this.$emit("select", e[item.thead[3].name], e);
    },
    unselectItem(target,item) {
        item?.tbody?.forEach((obj) => {
          // 将其他选中的取消
          const targeName = target[item.thead[3].name];
          const otherName = obj[item.thead[3].name];
          if (this.selectId === obj[item.thead[0].name] && targeName !== otherName) {
            this.$emit("unselect", otherName, obj);
          }
        });
    },
  },
  updated() {
    if (Object.keys(this.$refs)?.length) {
      this.data.forEach((item,index1)=>{
        item.tbody?.forEach((e, index2) => {
          const domName = "row" + index1 + '-' + index2;
          const dom = this.$refs[domName][0];
          dom.setAttribute("listIndex", index1 + '-' + index2);
          dom.addEventListener("click", this.clickListener);
        });
      })
    }
  },
  beforeDestroy() {
    this.unselectItem();
  },
  components: {
    AppDialog
  }
};
</script>

<style lang="scss" scoped>
.container{
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
  .disabled{
    color: #FFFF00;
  }
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}
</style>
