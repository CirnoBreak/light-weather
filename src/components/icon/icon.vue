<template>
  <i class="icon" :class="'icon-' + type + '' + className"></i>
</template>

<script>
  export default {
    name: 'w-icon',
    props: {
      type: {
        type: String,
        default: ''
      },
      className: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style lang="less" scoped>
  @import './icon.less';
</style>