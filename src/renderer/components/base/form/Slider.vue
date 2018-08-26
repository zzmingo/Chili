<template>
  <div class="field cl-slider">
    <label class="label is-small">{{label}}: 
      <span v-if="!input" class="tag is-info is-pulled-right">{{format(value)}}</span>
      <input v-if="input" class="input is-small is-info is-pulled-right" type="number" 
        :value="value"
        @keyup.enter="$event.target.blur()"
        @input="$emit('input', $event.target.value)">
    </label>
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
    input: Boolean,
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

  &::-webkit-slider-thumb {
    border: none;
    background: $primary;
  }
}

.input {
  background-color: $info;
  border-color: $info;
  box-shadow: none;
  outline: none;
  color: white;
  font-weight: bold;
  max-width: 4rem;
  width: auto;
  padding: 0 0.8em;
  height: 1.6em;
  -webkit-appearance: none;
  text-align: right;

  &::-webkit-outer-spin-button, 
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:focus {
    box-shadow: none;
    outline: none;
    border-color: $info;
  }
}
</style>

