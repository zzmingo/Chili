<template>
  <div class="cl-flexbox-col-full cl-full-height">
    <Toolbar>
      <template slot="left">
        <Dropdown value="New" :menus="true" :items="newMenus" :hoverable="true" icon="fas fa-plus" @select="onNewMenuSelect" />
        <button style="margin-left: 0.5rem;" class="button is-primary is-small" @click="onNewMixerClick">
          <span class="icon"><i class="fas fa-plus"></i></span>
          <span>New Mixer</span>
        </button>
      </template>
      <template slot="center">
        <button class="button is-primary is-small" @click="play" :disabled="!canPlay">
          <span class="icon"><i class="fas fa-play"></i></span>
          <span>Play</span>
        </button>
        <button style="margin-left: 0.5rem;" class="button is-primary is-small" @click="exportCurrent" :disabled="!canExport">
          <span class="icon"><i class="fas fa-save"></i></span>
          <span>Export</span>
        </button>
      </template>
      <template slot="right">
        <button style="margin-left: 0.5rem;" class="button is-primary is-small" @click="onSaveClick" :disabled="!savable">
          <span class="icon"><i class="fas fa-save"></i></span>
          <span>Save</span>
        </button>
        <button style="margin-left: 0.5rem;" class="button is-primary is-small" @click="onClickNewFile">
          <span class="icon"><i class="fas fa-save"></i></span>
          <span>New File</span>
        </button>
        <button style="margin-left: 0.5rem;" class="button is-primary is-small" @click="onClickOpenFile">
          <span class="icon"><i class="fas fa-save"></i></span>
          <span>Open File</span>
        </button>
      </template>
    </Toolbar>
    <div class="cl-flex-1 cl-full-width">
      <Splitter :margin="20" :initPercent="20">
        <div slot="left-pane" class="left-pane cl-full-height">
          <Tabs :tabs="tabs" v-model="tab">
            <template slot-scope="slotProps">
              <div v-if="slotProps.tab.name === 'synth'" class="cl-flexbox-col-full cl-full-height cl-synth-list">
                <div class="item cl-full-width"
                  v-for="synth in synthList"
                  :key="synth.uuid"
                  :class="{ active: activeSynth && synth.uuid === activeSynth.uuid }"
                  @click="onSelectSynth(synth)">
                  <span class="tag is-small is-info">{{tone.synthTypeTags[synth.type]}}</span>
                  <span class="name">{{synth.name}}</span>
                </div>
              </div>
              <div v-if="slotProps.tab.name === 'mixer'" class="cl-flexbox-col-full cl-full-height cl-mixer-list">
                <div class="item cl-full-width"
                  v-for="mixer in mixerList"
                  :key="mixer.name"
                  :class="{ active: mixer.uuid === activeMixer.uuid }"
                  >{{mixer.name}}</div>
              </div>
            </template>
          </Tabs>
        </div>
        <div slot="right-pane" class="panel-ct right-pane cl-full-height">
          <div v-show="tab === 'synth'" class="panel-synth columns">

            <div v-if="activeSynth" class="column">
              <DevidePanel title="Basic">
                <Input label="Name" v-model="activeSynth.name" placeholder=""/>
              </DevidePanel>
              <div class="vertical-spacing"></div>
              <DevidePanel title="Play">
                <ButtonRadio label="Note" v-model="activeSynth.note" :items="tone.notes" />
                <Slider label="Volume" v-model="activeSynth.volume" :min="0" :max="1" :step="0.01" />
                <Slider label="Bpm" v-model="activeSynth.bpm" :min="30" :max="320" :step="30" />
              </DevidePanel>
            </div>

            <!-- normal synth -->
            <template v-if="activeSynth && activeSynth.type === 'synth'">
              <div class="column">
                <OscillatorPanel :oscillator.sync="activeSynth.synth.oscillator" />
              </div>
              <div class="column">
                <EnvelopePanel :envelope.sync="activeSynth.synth.envelope" />
              </div>
            </template>

          </div>

          <div v-if="tab === 'mixer'" class="panel-mixer">
            <template v-if="activeMixer">
              <DevidePanel title="Mixer" style="width: 400px;">
                <Input label="Name" v-model="activeMixer.name" placeholder=""/>
                <Slider label="Volume" v-model="activeMixer.volume" :min="0" :max="1" :step="0.01" />
              </DevidePanel>

              <div class="mixer-timeline">
                <table class="table is-bordered is-fullwidth is-hoverable">
                  <thead>
                    <tr class="is-selected">
                      <th width="100px">Name</th>
                      <th width="120px">Volume</th>
                      <th width="*">Timeline</th>
                      <th width="20px"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(synthItem, idx) in activeMixer.synth" :key="idx">
                      <td>
                        <Dropdown style="width: 100px;" v-model="synthItem.uuid" :items="mixItems" />
                      </td>
                      <td>
                        <div class="control is-small">
                          <span class="tag is-success">{{synthItem.volume}}</span>
                          <input v-model="synthItem.volume" 
                            class="slider is-fullwidth" :min="0" :max="1" :step="0.01" type="range">
                        </div>
                      </td>
                      <td></td>
                      <td><a class="delete" @click="onDeleteMixSynthClick(idx, synthItem)"></a></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </div>
        </div>
      </Splitter>
    </div>
    <div class="footer">
      <div v-if="currentFile">Editing: {{currentFile}}</div>
    </div>

    <div class="modal" :class="{ 'is-active': !currentFile }">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="card">
          <div class="card-content">
            <div class="content">
              <div>
                <h1 style="font-size: 24px; font-weight: bold; padding-bottom: 1rem;">
                  Chili, a sound workstation.
                </h1>
              </div>
              <div>
                Recent files: <br>
                <ul>
                  <li v-for="(file, idx) in recentFiles" :key="idx">
                    <a href="javascript: void(0)" @click="openFilePath(file)">{{fileBaseName(file)}}</a> <span class="">({{file}})</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <footer class="card-footer">
            <a href="javascript: void(0)" class="card-footer-item" @click="onClickNewFile">New File</a>
            <a href="javascript: void(0)" class="card-footer-item" @click="onClickOpenFile">Open File</a>
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import path from 'path'
import fs from 'fs'
import uuid from 'uuid'
import Tone from 'tone'
import EnvelopePanel from './panel/EnvelopePanel.vue'
import OscillatorPanel from './panel/OscillatorPanel.vue'
import { synthDefaults, mixerDefaults, mixerSynthDefaults } from '@/data/tone'
import { chiliSynthFileJSON, chiliSynthFileExt, showCreateDialog, showOpenFileDialog } from '@/data/file'
import * as toneMgr from './toneMgr'
import * as stateMgr from './stateMgr'
import { recursiveDeepCopy } from '@/utils'

let playTimer

export default {
  components: {
    EnvelopePanel,
    OscillatorPanel,
  },
  computed: {
    mixItems() {
      return [{ text: 'none', value: 'none' }].concat(this.synthList.map(synth => {
        return { text: synth.name, value: synth.uuid }
      }))
    },
    canPlay() {
      return this.tab === 'synth' && this.activeSynth || (this.tab === 'mixer' && this.activeMixer)
    },
    canExport() {
      return this.tab === 'synth' && this.activeSynth
    }
  },
  data() {

    let recentFiles = []
    try {
      let recentFilesStr = localStorage.getItem('chili.recentFiles')
      if (recentFilesStr) {
        recentFiles = JSON.parse(recentFilesStr)
      }
    } catch(error) {
      console.warn(error)
    }

    return {
      // welcome board
      recentFiles,

      version: 1,
      currentFile: null,
      savable: false,

      // toolbar
      newMenus: [
        { text: 'New Synth', value: 'synth' },
        // { text: 'New AM Synth', value: 'amsynth' },
        // { text: 'New FM Synth', value: 'fmsynth' },
      ],

      // tabs
      tab: 'synth',
      tabs: [{
        name: 'synth',
        icon: 'fas fa-music'
      }, {
        name: 'mixer',
        icon: 'fas fa-vials'
      }],

      // synth
      synthList: [],
      activeSynth: null,
      synthChanged: true,


      // mixer
      mixerList: [],
      activeMixer: null,
      mixerChanged: true,
    }
  },
  watch: {
    activeSynth: {
      deep: true,
      handler: function(val, old) {
        this.synthChanged = true
        this.mixerChanged = true
        if (val === old) {
          this.schedulePlay()
        }
      }
    },
    activeMixer: {
      deep: true,
      handler: function(val, old) {
        this.mixerChanged = true
        this.schedulePlay()
      }
    },
    synthList: {
      deep: true,
      handler: function() {
        this.savable = true
      }
    },
    mixerList: {
      deep: true,
      handler: function() {
        this.savable = true
      }
    }
  },
  methods: {
    fileBaseName(filePath) {
      return path.basename(filePath)
    },
    onClickNewFile() {
      this.checkSavable()
      chiliSynthFileJSON.synthList[0].uuid = uuid.v4()
      let fileInfo = showCreateDialog(chiliSynthFileJSON, chiliSynthFileExt)
      if (!fileInfo) {
        return
      }
      this.openFile(fileInfo.filePath, JSON.parse(fileInfo.content))
    },
    onClickOpenFile() {
      this.checkSavable()
      let fileInfo = showOpenFileDialog(chiliSynthFileExt)
      if (!fileInfo) {
        return
      }
      this.openFile(fileInfo.filePath, JSON.parse(fileInfo.content))
    },
    openFilePath(filePath) {
      this.openFile(filePath, JSON.parse(fs.readFileSync(filePath, 'utf8')))
    },
    openFile(filePath, fileJSON) {
      this.synthList = fileJSON.synthList
      this.mixerList = fileJSON.mixerList
      this.currentFile = filePath
      this.version = fileJSON.version
      this.updateRecentFiles()
    },
    onSaveClick() {
      if (!this.savable) {
        return
      }
      fs.writeFileSync(this.currentFile, JSON.stringify({
        version: this.version,
        synthList: this.synthList,
        mixerList: this.mixerList
      }))
      this.savable = false
    },
    checkSavable() {
      if (this.savable) {
        if (window.confirm('Save current file?')) {
          this.onSaveClick()
        }
      }
    },
    updateRecentFiles() {
      let idx = this.recentFiles.indexOf(this.currentFile)
      if (idx >= 0) {
        this.recentFiles.splice(idx, 1)
      }
      this.recentFiles.unshift(this.currentFile)
      localStorage.setItem('chili.recentFiles', JSON.stringify(this.recentFiles))
    },
    onNewMenuSelect(item) {
      let defaults = synthDefaults[item.value]
      if (!defaults) {
        return
      }
      let synth = recursiveDeepCopy(defaults)
      synth.uuid = uuid.v4()
      this.synthList.push(synth)
      this.$set(this, 'activeSynth', synth)
    },
    onNewMixerClick() {
      let mixer = recursiveDeepCopy(mixerDefaults)
      mixer.uuid = uuid.v4()
      this.mixerList.push(mixer)
      this.$set(this, 'activeMixer', mixer)
      this.tab = "mixer"
    },
    schedulePlay() {
      if (playTimer) {
        return
      }
      playTimer = setTimeout(() => {
        playTimer = null
        if (!stateMgr.isDragging) {
          this.play()
        }
      }, 100)
    },
    play() {
      if (this.tab === "synth") {
        if (this.synthChanged) {
          this.synthChanged = false
          toneMgr.createSynth(recursiveDeepCopy(this.activeSynth.synth))
        }
        toneMgr.play(this.activeSynth.note, this.activeSynth.volume)
      } else if (this.tab === "mixer") {
        if (this.mixerChanged) {
          this.mixerChanged = false
          toneMgr.createMixer(this.activeMixer, this.synthList)
        }
        toneMgr.playMixer(this.activeMixer.volume)
      }
    },
    exportCurrent() {
      toneMgr.exportSynth(this.activeSynth)
    },
    onSelectSynth(synth) {
      this.activeSynth = synth
    },
    onDeleteMixSynthClick(idx, synth) {
      this.activeMixer.synth[idx] = recursiveDeepCopy(mixerSynthDefaults)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/all-variables.scss";

.panel-ct {
  padding: 1rem;
}

.toolbar-buttons {
  margin-bottom: 0;
}

.vertical-spacing {
  padding: 1rem;
}

.left-pane {
  background-color: #F5F5F5;
}

.right-pane {
  background-color: #F9F9F9;
}

.cl-mixer-list, .cl-synth-list {
  .item {
    position: relative;
    height: 1.8rem;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover {
      background-color: $grey-lighter;
    }
    &.active {
      background-color: $primary;
      color: $primary-invert;
    }
  }
}

.cl-synth-list {
  .item {
    .tag {
      position: absolute;
      left: 0.5rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.625rem;
      background-color: #C1044F;
    }

    .name {
      width: 100%;
      display: block;
      padding-left: 3.8rem;
    }
  }
}

.cl-mixer-list {
  .item {

    &.active {
      background-color: $info;
      color: $info-invert;
    }
  }
}

.footer {
  width: 100%;
  border-top: 1px solid $border;
  font-size: 12px;
  padding: 0.5rem 1rem;
}

.mixer-timeline {
  margin-top: 1rem;
  input[type=range].slider {
    margin: 0.5rem 0;
  }

  th {
    font-size: 12px;
  }
}
</style>

