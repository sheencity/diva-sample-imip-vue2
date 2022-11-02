<template>
  <app-dialog :header="header">
    <div class="main">
      <div class="image" v-if="dataSource.image">
        <img
          style="width: 100%; height: 100%"
          v-if="dataSource.image.url"
          :src="dataSource.image.url"
        />
      </div>
      <p v-if="dataSource.text.length === 1">
        {{ dataSource.text[0] }}
      </p>
      <template v-else>
        <ul 
          class="list" 
          :key="item" 
          v-for="item in dataSource.text"
        >
          <li>{{ item }}</li>
        </ul>
      </template>

      <slot></slot>
    </div>
  </app-dialog>
</template>

<script>
import AppDialog from '../dialog/dialog';

export default {
  props: ['dataSource', 'header'],
  components: {
    AppDialog,
  },
};
</script>

<style lang="scss" scoped>
.main {
  .image {
    width: 100%;
    margin-bottom: 0.63rem;
  }
  p {
    font-size: 0.88rem;
    letter-spacing: 0.06rem;
    color: #ebebeb;
  }
  .list {
    color: #ebebeb;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 1px;
    padding-left: 20px;
    li {
      list-style: unset;
    }
  }
}
</style>>
