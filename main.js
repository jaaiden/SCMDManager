const electron = require('electron')
const os = require('os')
const config = require('electron-json-config')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipc = require('electron').ipcMain

let mainWindow, installWindow



function createWindow () {
  mainWindow = new BrowserWindow({width: 1280, height: 800})
  mainWindow.loadURL(`file://${__dirname}/pages/index.html`)
  // mainWindow.webContents.openDevTools()
  mainWindow.on('closed', function () { mainWindow = null })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (!os.platform() == "darwin") {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

ipc.on('create-server-window', function(event, arg) {
  console.log("Received server installation parameters")
  console.log(arg)
  console.log("Creating server installation window with parameters...")
  installWindow = new BrowserWindow({width: 1020, height: 600})
  installWindow.loadURL(`file://${__dirname}/pages/server_install.html`)
  installWindow.webContents.on('did-finish-load', () => {
    installWindow.webContents.send('set-install-contents', arg)
    console.log("Sending server parameters to install window...")
  })
})

ipc.on('add-server-to-list', function(event, arg) {
  console.log('Adding server to Server List...')
  mainWindow.webContents.send('add-server', arg)
})