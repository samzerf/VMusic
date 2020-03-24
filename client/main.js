const { app, BrowserWindow } = require('electron')
const isDev = require('electron-is-dev')

function createWindow () {
  console.log('createWindow')
  let win = new BrowserWindow({
    width: 1024,
    height: 680,
    webPreferences: {
      nodeIntegration: true
    }
  })

  const url = isDev ? 'http://localhost:8080' : ''
  win.loadURL(url)
  // win.webContents.openDevTools()
}

app.whenReady().then(createWindow)