<template>
  <div class="cl-tabs-container cl-flexbox-col-full">
    <div class="tabs is-centered is-boxed is-small cl-full-width">
      <ul>
        <li v-for="tab in tabs" :class="{ 'is-active': tab.name === value }" :key="tab.name">
          <a @click="onClickTab(tab)">
            <span v-if="tab.icon" class="icon is-small"><i :class="tab.icon" aria-hidden="true"></i></span>
            <span>{{tab.text || tab.name}}</span>
          </a>
        </li>
      </ul>
    </div>
    <div class="panels cl-flex-1 cl-full-width">
      <div v-for="tab in tabs" :key="tab.name" :class="{ active: tab.name === value }" class="panel cl-full-width cl-full-height">
        <slot :tab="tab"></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    tabs: Array,
    value: String,
  },
  methods: {
    onClickTab(tab) {
      this.$emit('input', tab.name)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/all-variables.scss";

.tabs {
  margin-top: 0.5rem;
}

.panel {
  display: none;
  &.active {
    display: block;
  }
}

</style>

