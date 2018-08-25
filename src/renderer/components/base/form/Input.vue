<template>
  <div class="field">
    <label class="label is-small">{{label}}</label>
    <div class="control">
      <input class="input is-small" type="text" 
        :placeholder="placeholder" 
        :value="value"
        @keyup.enter="$event.target.blur()"
        @input="$emit('input', $event.target.value)">
    </div>
  </div>
</template>

<script>
export default {
  props: ["label", "value", "placeholder"]
}
</script>
