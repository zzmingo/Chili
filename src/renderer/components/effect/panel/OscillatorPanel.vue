<template>
  <DevidePanel title="Oscillator">
    <ButtonRadio label="Source" v-model="oscillator.sourceType" :items="tone.sourceTypes" />
    <ButtonRadio v-if="isFat || isFmAm" label="Type" v-model="oscillator.type" :items="tone.oscillatorTypes" />
    <Slider label="Frequency" v-model="oscillator.frequency" :min="0" :max="3000" :step="1" :format="toneSuffix('hz')"/>
    <Slider label="Detune" v-model="oscillator.detune" :min="0" :max="1" :step="0.01" />
    <Slider label="Phase" v-model="oscillator.phase" :min="0" :max="1" :step="0.01" />
    <Slider v-if="isFmAm" label="Harmonicity" v-model="oscillator.harmonicity" :min="0" :max="1" :step="0.1" />
    <Slider v-if="isPulse" label="Width" v-model="oscillator.width" :min="0" :max="1" :step="0.01" />
    <Slider v-if="isFat" label="Count" v-model="oscillator.count" :min="1" :max="10" :step="1" />
    <Slider v-if="isFat" label="Spread" v-model="oscillator.spread" :min="0" :max="100" :step="1" />
    <ButtonRadio v-if="isFmAm" label="Modulation Type" v-model="oscillator.modulationType" :items="tone.oscillatorTypes" />
    <Slider v-if="isFm" label="Modulation Index" v-model="oscillator.modulationIndex" :min="0" :max="100" :step="1" />
    <Slider v-if="isPwm" label="Modulation Frequency" v-model="oscillator.modulationFrequency" :min="0" :max="1" :step="0.01" />
  </DevidePanel>
</template>

<script>
export default {
  props: {
    oscillator: Object,
  },
  computed: {
    isOsc() {
      return this.oscillator.sourceType === 'osc'
    },
    isFat() {
      return this.oscillator.sourceType === 'fat'
    },
    isFmAm() {
      let sourceType = this.oscillator.sourceType
      return sourceType === 'fm' || sourceType === 'am'
    },
    isFm() {
      return this.oscillator.sourceType === 'fm'
    },
    isPulse() {
      return this.oscillator.sourceType === 'pulse'
    },
    isPwm() {
      return this.oscillator.sourceType === 'pwm'
    }
  },
}
</script>
