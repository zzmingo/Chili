<template>
  <DevidePanel title="Envelope">
    <ButtonRadio label="AttackCurve" v-model="envelope.attackCurve" :items="tone.attackCurves" />
    <Slider label="Attack" v-model="envelope.attack" :min="0" :max="3" :step="0.01" />
    <Slider label="Decay" v-model="envelope.decay" :min="0" :max="3" :step="0.01" />
    <Slider label="Sustain" v-model="envelope.sustain" :min="0" :max="3" :step="0.01" />
    <Slider label="Release" v-model="envelope.release" :min="0" :max="5" :step="0.01" />
    <figure class="image">
      <img src="@/assets/images/ADSR.png">
    </figure>
  </DevidePanel>
</template>

<script>
export default {
  props: {
    envelope: Object,
  }
}
</script>

<style lang="scss" scoped>
.image {
  margin-top: 2rem;
}
</style>

