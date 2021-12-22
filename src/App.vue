<template>
  <main>
    <div ref="backendContainer" class="backend-container"></div>
    <router-view></router-view>
  </main>
</template>
<script>

export default {
  async mounted() {
    if (this.$refs.backendContainer) {
      await diva.init(this.$refs.backendContainer);
      if (diva.client) dataService._diva.next(true);
    }
  },
};
</script>

<style lang="scss" scoped>

</style>
