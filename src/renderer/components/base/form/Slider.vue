<template>
  <div class="field cl-slider">
    <label class="label is-small">{{label}}: <span class="tag is-info is-pulled-right">{{format(value)}}</span></label>
    <div class="control is-small">
      <input :value="value" @input="$emit('input', parseFloat($event.target.value))" class="slider is-fullwidth" :min="min" :max="max" :step="step" type="range">
    </div>
  </div>
</template>
<script>
export default {
  props: {
    label: String,
    value: Number,
    min: Number,
    max: Number,
    step: Number,
    format: {
      type: Function,
      default: (value) => value
    }
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/all-variables.scss";
.cl-slider .tag {
  height: 1.6em;
}
input[type=range].slider {
  margin: 0.5rem 0;
}
</style>

