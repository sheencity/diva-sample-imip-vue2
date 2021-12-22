<template>
  <main class="bg">
    <header :key="headerKey">
      <app-dialog-header
        :key="title"
        :title="title"
        :icon="icon"
      ></app-dialog-header>
    </header>
    <aside>
      <slot name="dialog-article"></slot>
    </aside>
  </main>
</template>

<script>
import AppDialogHeader from "./dialog-header";
import { metadata } from "./data"; // 引入组件数据
export default {
  props: ["headerKey"],
  data() {
    return {
      title: "",
      icon: "",
    };
  },

  created() {
    const data = metadata.get(this.headerKey);
    this.icon = data ? data.icon : "";
    this.title = data ? data.text : "";
  },

  mounted() {},
  watch: {
    headerKey() {
      const data = metadata.get(this.headerKey);
      this.icon = data ? data.icon : "";
      this.title = data ? data.text : "";
    },
  },

  components: {
    AppDialogHeader,
  },
};
</script>

<style lang="scss" scoped></style>
