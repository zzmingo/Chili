<template>
  <div class="dropdown" :class="{ 'is-active': popup }">
    <div class="dropdown-trigger cl-full-width" @click="popup = true">
      <button class="button is-small is-primary cl-full-width">
        <span v-if="menus" class="icon is-small">
          <i :class="icon || 'fas fa-angle-down'" aria-hidden="true"></i>
        </span>
        <span>{{ menus ? value : selectedText }}</span>
        <span v-if="!menus" class="icon is-small">
          <i :class="icon || 'fas fa-angle-down'" aria-hidden="true"></i>
        </span>
      </button>
    </div>
    <div class="dropdown-menu" role="menu">
      <div class="dropdown-content">
        <a v-for="item in items" :key="getItemValue(item)" href="javascript: void(0);" class="dropdown-item" @click="onMenuClick(item)">
          {{ getItemText(item) }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>

let idGen = 0

export default {
  props: ['value', 'icon', 'menus', 'items', 'hoverable'],
  computed: {
    selectedText() {
      return this.getItemText(this.items.filter(item => this.getItemValue(item) === this.value)[0])
    }
  },
  data() {
    return {
      id: 'cl-dropdown-' + (++idGen),
      popup: false
    }
  },
  methods: {
    getItemValue(item) {
      if (item.value != void 0) {
        return item.value
      }
      return item
    },
    getItemText(item) {
      if (item.text != void 0) {
        return item.text
      }
      if (item.value != void 0) {
        return item.value
      }
      return item
    },
    onMenuClick(item) {
      this.popup = false
      this.$emit('select', item)
      this.$emit('input', this.getItemValue(item))
    }
  }
}
</script>

<style lang="scss" scoped>
.dropdown-trigger {
  width: 100%;
}
</style>
