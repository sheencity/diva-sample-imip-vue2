<template>
  <main class="area-bg">
    <div style="pointer-events: none">
      <header>
        <p>{{ dataSource.title }}</p>
        <div></div>
      </header>
      <aside>
        <div class="area-content">
          <div class="content">
            <img :src="dataSource.icon" />
          </div>
          <div class="content">
            <p>{{ dataSource.info_left.title }}</p>
            <div>
              <span>
                {{ dataSource.info_left.value }}
              </span>
              {{ dataSource.info_left.unit }}
            </div>
          </div>
          <div v-if="dataSource.info_right" class="content">
            <p>{{ dataSource.info_right.title }}</p>
            <div>
              <span>
                {{ dataSource.info_right.value }}
              </span>
              {{ dataSource.info_right.unit }}
            </div>
          </div>
        </div>
      </aside>
    </div>
  </main>
</template>

<script>
export default {
  props: ['dataSource'],
};
</script>

<style lang="scss" scoped>
.area-bg {
  width: 100%;
  border: 1px solid rgba(235, 235, 235, 0.2);
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  header {
    p {
      font-weight: 500;
      font-size: 0.88rem;
      line-height: 1.19rem;
      text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.5);
    }
    div {
      width: 7.88rem;
      height: 0px;
      margin: 4px 0px 3px 0px;
      border-bottom: 1px dashed rgba(4, 205, 152, 0.6);
    }
  }
  .area-content {
    display: flex;
    .content {
      flex: 1 1 0;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      img {
        flex-basis: 0;
      }
      p {
        font-size: 0.75rem;
        line-height: 1.25rem;
        color: #ebebeb;
      }
      span {
        font-family: Saira;
        font-weight: 500;
        font-size: 1rem;
        line-height: 1.25rem;
        color: #00f7ff;
        letter-spacing: 1px;
      }

      &:first-of-type {
        align-items: flex-start !important;
        justify-content: flex-end;
      }
    }
  }
}
</style>
