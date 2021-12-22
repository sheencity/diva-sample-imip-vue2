<template>
  <main class="bg">
    <div v-for="item in contentArr" :key="item.text">
      <header>
        <app-dialog-header
          :title="item.text"
          :icon="item.icon"
          width="160"
        ></app-dialog-header>
      </header>
      <aside>
        <slot :name="item.text"></slot>
      </aside>
    </div>
  </main>
</template>

<script>
import AppDialogHeader from "./dialog-header";
import { metadata } from "./data"; // 引入组件数据

export default {
  props: ["headerKeys"],
  data() {
    return {
      contentArr: [],
    };
  },
  created() {
    this.headerKeys.forEach((key) => {
      const data = metadata.get(key);
      this.contentArr.push(data);
    });
  },
  components: {
    AppDialogHeader,
  },
};
</script>

<style lang="scss" scoped>
.bg {
  width: 200px;
  background: rgba(4, 14, 29, 0.6);
  // backdrop-filter: blur(4px);
  border-radius: 2px;
  padding: 16px 20px 20px 20px;
}
</style>
