import { app, BrowserWindow, dialog } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */


import { autoUpdater } from 'electron-updater'

autoUpdater.logger = require("electron-log")
autoUpdater.logger.transports.file.level = process.env.NODE_ENV === 'production' ? 'info' : false
autoUpdater.logger.transports.console.level = "debug"

autoUpdater.on('error', (error) => {
  console.error(error)
})

autoUpdater.on('download-progress', (info) => {
  console.log('downloading ' + info.percent)
})

autoUpdater.on('checking-for-update', () => {
  console.log('checking-for-update')
})

autoUpdater.on('update-available', (info) => {
  console.log(info)
})

autoUpdater.on('update-not-available', (info) => {
  console.log(info)
})

autoUpdater.on('update-downloaded', () => {
  let install = dialog.showMessageBox(mainWindow, {
    title: '更新',
    message: '检查到有更新，重启安装？',
    buttons: ["取消", "重启安装"]
  })
  install && autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  console.log('check updates ' + process.env.NODE_ENV)
  if (process.env.NODE_ENV === 'production') {
    autoUpdater.checkForUpdatesAndNotify()
  } else {
    autoUpdater.checkForUpdatesAndNotify()
  }
})
