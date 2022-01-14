<template>
  <main>
    <div ref="backendContainer" class="backend-container"></div>
    <router-view></router-view>
  </main>
</template>
<script>
import { diva, dataService } from 'services/global';

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
  .backend-container{
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
