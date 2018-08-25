import Tone from 'tone'

export const oscillatorTypes = [
  'sine',
  'triangle',
  'sawtooth',
  'square'
]

export const attackCurves = [
  'linear',
  'exponential',
  'sine',
  'cosine',
  'bounce',
  'ripple',
  'step'
]

export const sourceTypes = [
  'osc',
  'fm',
  'am',
  'fat',
  'pulse',
  'pwm',
]

export const notes = [
  '16n',
  '8n',
  '4n',
  '2n',
  '1n'
]

export const synthTypeTags = {
  'synth': 'SNTH',
}

export const envelope = {
  attackCurve : 'sine',
  attack : 0.05,
  decay : 0.2,
  sustain : 0.2,
  release : 1.5,
}

export const omniOscillator = {
  frequency : 440,
  detune : 0,
  sourceType: 'osc',
  type : "sine",
  phase : 0,
  harmonicity : 0.5,
  width: 0.5,
  count: 1,
  spread: 40,
  modulationType : 'sine',
  modulationIndex: 1,
  modulationFrequency: 0.2,
}

export const synth = {
  oscillator: omniOscillator,
  envelope,
  portamento : 0
}

export const synthDefaults = {
  synth: {
    uuid: '',
    name: 'synth',
    type: 'synth',
    note: '8n',
    volume: 0.5,
    bpm: 120,
    synth
  }
}


export const mixerSynthDefaults = {
  uuid: 'none',
  volume: 1,
  start: 0
}

export const mixerDefaults = {
  uuid: '',
  name: 'mixer',
  volume: 0.5,
  synth: [
    mixerSynthDefaults,
    mixerSynthDefaults,
    mixerSynthDefaults,
    mixerSynthDefaults,
    mixerSynthDefaults,
    mixerSynthDefaults,
  ]
}

export const toneMixin = {
  data() {
    return {
      tone: {
        notes,
        sourceTypes,
        oscillatorTypes,
        attackCurves,
        synthTypeTags,
      }
    }
  },
  methods: {
    toneSuffix(unit) {
      return (val) => val + unit
    },
    toneF2N(val) {
      return new Tone.Frequency(val, 'hz').toNote()
    }
  }
}
