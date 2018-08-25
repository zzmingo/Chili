<template>
  <div class="field">
    <label class="label is-small">{{label}}</label>
    <div class="control buttons has-addons is-small">
      <span class="button is-small" 
        v-for="item in items" 
        :key="item.value || item"
        :class="{
          'is-selected': value === (item.value || item),
          'is-success': value === (item.value || item),
        }"
        @click="$emit('input', item.value || item)"
        >{{item.text || item.value || item}}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: ['value', 'items', 'label'],
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/all-variables.scss";
</style>

