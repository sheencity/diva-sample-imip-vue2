<template>
  <app-dialog :header="header">
    <div
      :style="{borderColor: item.checked?'#00F7FF':'',borderStyle: item.border?'solid':'unset'}"
      class="analyse" 
      :key="item.title" 
      v-for="item in dataSource">
      <div class="content">
        <span v-if="item.color" class="color" :style="{ background: item.color }"></span>
        <span class="title">{{ item.title }}</span>
      </div>
      <app-switcher
        v-model="item.checked"
        @switch="switcher(item)"
      ></app-switcher>
      <p v-if="item.checked" class="explain">
        {{ item.description }}
      </p>
    </div>
  </app-dialog>
</template>

<script>
import AppDialog from '../dialog/dialog'
import AppSwitcher from '../switcher'
export default {
  props: ['header','dataSource'],
  data(){
    return{
    }
  },
  creat(){
    
  },
  methods: {
    switcher(e){
      console.log(e);
    }
  },
  components: {
    AppDialog,
    AppSwitcher
  }
}
</script>

<style lang="scss" scoped>
  .analyse {
    width: 100%;
    min-height: 2.69rem;
    padding: .75rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    border: 1px solid rgba(5, 205, 157, 0.3);
    border-radius: 4px;
    .explain {
      width: 100%;
      border-top: 1px dashed rgba(4, 205, 152, 0.6);
      padding-top: .75rem;
      margin-top: .63rem;
      font-size: .75rem;
      line-height: 1rem;
      color: #ffffff;
      text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.5);
    }
    .content{
      display: flex;
      .color{
        width: 40px;
        height: 20px;
        border-radius: 4px;
        margin-right: 20px;
      }
      .title{
        height: 20px;
        font-size: 14px;
        line-height: 19px;
        text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.5);
      }
    }
    &:nth-child(1) {
      margin-bottom: 1.25rem;
    }
  }
</style>>