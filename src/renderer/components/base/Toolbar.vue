<template>
  <div class="cl-toolbar cl-flexbox-row-full cl-full-width">
    <slot name="left" />
    <div class="cl-flex-1"></div>
    <slot name="center" />
    <div class="cl-flex-1"></div>
    <slot name="right" />
  </div>
</template>
<script>
export default {

}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/all-variables.scss";

.cl-toolbar {
  height: 3.5rem;
  border-bottom: $cl-split-border;
  box-sizing: border-box;
  padding: 0 2rem;
}
</style>

