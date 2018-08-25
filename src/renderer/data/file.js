import electron from 'electron'
import fs from 'fs'
import * as tone from './tone'

export const chiliSynthFileJSON = {
  version: 1,
  synthList: [
    tone.synthDefaults.synth
  ],
  mixerList: []
}

export const chiliSynthFileExt = 'clsynth'

export function showCreateDialog(fileJSON, chiliSynthFileExt) {
  let filePath = electron.remote.dialog.showSaveDialog({
    defaultPath: 'newfile.' + chiliSynthFileExt,
    filters: [
      { name: 'All Files', extensions: [chiliSynthFileExt] }
    ]
  })
  
  if (filePath) {
    let content = JSON.stringify(fileJSON, null, '  ')
    fs.writeFileSync(filePath, content)
    return {
      filePath,
      content
    }
  }
}

export function showOpenFileDialog(chiliSynthFileExt) {
  let filePaths = electron.remote.dialog.showOpenDialog({
    properties: [
      'openFile'
    ],
    filters: [
      { name: 'All Files', extensions: [chiliSynthFileExt] }
    ]
  })
  if (filePaths && filePaths[0]) {
    return {
      filePath: filePaths[0],
      content: fs.readFileSync(filePaths[0], 'utf8')
    }
  }
}