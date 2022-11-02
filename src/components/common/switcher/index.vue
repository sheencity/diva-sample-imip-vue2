<template>
  <main>
    <div class="switcher" :class="{ 'switch-disabled': disabled || !checked }">
      <input type="checkbox" :checked="checked" :disabled="disabled" />
      <div class="slider round" ref="switch"></div>
    </div>
  </main>
</template>

<script>
export default {
  model: {
    prop: 'checked',
    event: 'change',
  },
  props: ['disabled', 'checked'],

  methods: {
    onClick() {
      if (!this.disabled) {
        this.$emit('change', !this.checked);
        this.$emit('switch', !this.checked);
      }
    },
  },
  mounted() {
    this.$refs.switch?.addEventListener('click', () => {
      this.onClick();
    });
  },
};
</script>

<style lang="scss" scoped>
.switcher {
  width: 36px;
  height: 20px;
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  input {
    display: none;
  }

  .round {
    border: 1px solid #ffffff;
    border-radius: 10px;
  }

  .slider {
    // background: rgba(255, 255, 255, 0.1);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 36px;
    transition: all 0.2s;
    cursor: pointer;
  }

  //小圆点
  .slider:after {
    content: "";
    width: 14px;
    height: 14px;
    display: block;
    border-radius: 50%;
    background: #ffffff;
    position: absolute;
    top: 2px;
    left: 2px;
    transition: all 0.2s;
  }

  .ball-color:after {
    background: #444;
  }

  //单选框选中后改变的样式
  input:checked + .slider:after {
    transform: translateX(16px);
    background: #fff;
  }
}
.switch-disabled {
  opacity: 0.5;
}
</style>
