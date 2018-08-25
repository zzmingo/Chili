<template>
  <div class="panel">
    <div class="title">{{title}}</div>
    <div class="body"><slot /></div>
  </div>
</template>
<script>
export default {
  props: {
    title: String
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/all-variables.scss";

.panel {
  position: relative;
  border: 1px solid $cl-panel-border-color;
  border-radius: 6px;
  box-sizing: border-box;
  background-color: white;
  width: 100%;
}

.title {
  position: absolute;
  font-size: 0.75rem;
  top: 0;
  left: 1.25rem;
  transform: translateY(-50%);
  box-sizing: border-box;
  background-color: inherit;
  padding: 0 0.25rem;
}

.body {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 1rem;
}
</style>

