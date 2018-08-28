import fs from 'fs'
import electron from 'electron'
import Tone from 'tone'
import lamejs from 'lamejs'

export let synth
export let mixer = {}

export const synthFactory = {
  'synth': (config) => {
    return new Tone.Synth(config)
  },
  'membrane': (config) => {
    return new Tone.MembraneSynth(config)
  }
}

function volume2decibels(volume) {
  return 48 * volume - 24
}

export function createSynth(type, config, master = true) {
  switch (type) {
    case 'membrane':
      Object.keys(config.membrane).forEach(key => {
        config[key] = config.membrane[key]
      })
      delete config.membrane
      Object.keys(config.oscillator).forEach(key => {
        if (key !== 'type') {
          delete config.oscillator[key]
        }
      })
      break
    case 'synth':
      switch (config.oscillator.sourceType) {
        case 'am':
        case 'fm':
        case 'fat':
          config.oscillator.type = config.oscillator.sourceType + config.oscillator.type
          break
        case 'pulse':
        case 'pwm':
          config.oscillator.type = config.oscillator.sourceType
        default:
      }
      delete config.oscillator.sourceType
      break
  }

  let factory = synthFactory[type]
  if (master) {
    if (synth) {
      synth.disconnect(Tone.Master)
    }
    synth = factory(config)
  } else {
    return factory(config)
  }
}

export function play(note, noteTime, volume = 1) {
  let theSynth = synth
  theSynth.connect(Tone.Master)
  theSynth.volume.setValueAtTime(volume2decibels(volume), 0)
  theSynth.triggerAttackRelease(note, noteTime)
}

export function exportSynth(activeSynth) {
  let filePath = electron.remote.dialog.showSaveDialog({
    defaultPath: (activeSynth.name || 'sound') + '.mp3',
    filters: [
      { name: 'All Files', extensions: ['mp3'] }
    ]
  })
  if (!filePath) {
    return
  }

  let noteTime = activeSynth.note
  let config = activeSynth.synth
  let bpm = activeSynth.bpm
  let envelope = config.envelope
  let duration = envelope.attack + envelope.decay + envelope.sustain + envelope.release
                + new Tone.Time(noteTime).toSeconds()

  return Tone.Offline(Transport => {
    let synth = createSynth(config, false).toMaster()
    let note = new Tone.Frequency(synth.frequency.value).toNote()
    synth.volume.setValueAtTime(volume2decibels(activeSynth.volume), 0)
    synth.triggerAttackRelease(note, noteTime)
    Transport.bpm.value = bpm
    Transport.start()
  }, duration).then(buffer => {
    buffer = buffer.get()

    var sampleRate = buffer.sampleRate
    var numberOfChannels = buffer.numberOfChannels
    var ld = buffer.getChannelData(0)
    var rd = numberOfChannels > 1 ? buffer.getChannelData(1) : null

    var lbuff = new Float32Array(ld.length)
    var rbuff = new Float32Array(rd.length)

    for(var i=0; i<ld.length;i++) {
      lbuff[i] = ld[i] * 32767.5
      rbuff[i] = rd[i] * 32767.5
    }

    var mp3Encoder = new lamejs.Mp3Encoder(2, sampleRate, 128)

    var blockSize = 1152
    var blocks = []
    var mp3Buffer

    var length = lbuff.length
    for (var i = 0; i < length; i += blockSize) {
      var lc = lbuff.subarray(i, i + blockSize)
      var rc = rbuff.subarray(i, i + blockSize)
      mp3Buffer = mp3Encoder.encodeBuffer(lc, rc)
      if (mp3Buffer.length > 0) {
        blocks.push(mp3Buffer)
      }
    }
    mp3Buffer = mp3Encoder.flush()
    if (mp3Buffer.length > 0) {
      blocks.push(mp3Buffer)
    }

    let blob = new Blob(blocks, {type: 'audio/mp3'})

    blobToBuffer(blob, (error, buffer) => {
      if (error) {
        console.error(error)
        return
      }
      fs.writeFileSync(filePath, buffer)
    })
  })
}


/* mixer */

export function createMixer(mixerConfig, synthList) {
  if (mixerConfig.synth.length <= 0) {
    return
  }
  let synthMap = {}
  synthList.forEach(synth => {
    synthMap[synth.uuid] = synth
  })
  mixer = {
    volume: mixerConfig.volume
  } 
  mixer.synth = mixerConfig.synth.filter(mixedSynth => {
    return !!synthMap[mixedSynth.uuid]
  }).map(mixedSynth => {
    let synthConfig = synthMap[mixedSynth.uuid]
    return {
      config: synthConfig,
      synth: createSynth(synthConfig.synth, false)
    }
  })
}

export function playMixer(volume) {
  mixer.synth.forEach(synthItem => {
    let theSynth = synthItem.synth
    let note = new Tone.Frequency(synthItem.synth.frequency.value).toNote()
    theSynth.connect(Tone.Master)
    console.log(synthItem.config.volume * volume)
    theSynth.volume.setValueAtTime(volume2decibels(synthItem.config.volume * volume), 0)
    theSynth.triggerAttackRelease(note, synthItem.config.note)
  })
}

function blobToBuffer (blob, cb) {
  if (typeof Blob === 'undefined' || !(blob instanceof Blob)) {
    throw new Error('first argument must be a Blob')
  }
  if (typeof cb !== 'function') {
    throw new Error('second argument must be a function')
  }

  var reader = new FileReader()

  function onLoadEnd (e) {
    reader.removeEventListener('loadend', onLoadEnd, false)
    if (e.error) cb(e.error)
    else cb(null, Buffer.from(reader.result))
  }

  reader.addEventListener('loadend', onLoadEnd, false)
  reader.readAsArrayBuffer(blob)
}