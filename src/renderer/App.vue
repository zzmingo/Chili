<template>
  <div id="app" class="cl-full-height">
    <div class="cl-full-height cl-flexbox-row-full">
      <!--
      <div class="cl-side-list is-narrow cl-flexbox-col-full cl-full-height">
        <div class="item cl-flexbox-center" @click="$router.push('/node-beat')">
          <span class="icon"><i class="fas fa-scrubber fa-2x"></i></span>
        </div>
        <div class="item cl-flexbox-center" @click="$router.push('/effect-maker')">
          <span class="icon"><i class="fas fa-sliders-h-square fa-2x"></i></span>
        </div>
      </div>
      -->
      <div class="cl-main cl-full-height cl-flex-1">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/all-variables.scss";

$list-width: 4rem;

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.cl-side-list {
  border-right: $cl-split-border;
  width: $list-width;
  box-sizing: border-box;

  .item {
    width: $list-width;
    height: $list-width;
    color: $text;
  }

  .item.active {
    color: $primary;
  }
}
</style>

<style>
html, body {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
